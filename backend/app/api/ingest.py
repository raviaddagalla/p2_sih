import random
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.chains.detector import detect_address_chain
from app.models.models import Case, Victim, ReportedWallet, TraceJob, Alert, IntegrationEvent
from app.schemas.schemas import SingleIngestRequest, SimulateComplaintRequest
from app.chains.simulated import SHOWCASE_SCENARIOS

router = APIRouter(prefix="/ingest", tags=["Ingestion Hub"])

@router.post("/wallets")
async def ingest_wallet(req: SingleIngestRequest, db: AsyncSession = Depends(get_db)):
    # 1. Chain detection
    detection = detect_address_chain(req.address)
    chain = req.chain or detection["chain"]

    # 2. Case generation
    case_no = req.case_no or f"2024-NCRP-{req.victim_state[:2].upper() if req.victim_state else 'MH'}-{random.randint(100000, 999999)}"
    
    new_case = Case(
        case_no=case_no,
        source="MANUAL",
        complaint_ref=f"MANUAL-{random.randint(10000, 99999)}",
        fraud_type=req.fraud_type or "TASK_SCAM",
        victim_loss_inr=req.loss_inr or 500000.0,
        status="UNDER_INVESTIGATION",
        priority="HIGH"
    )
    db.add(new_case)
    await db.flush()

    victim = Victim(
        case_id=new_case.id,
        masked_name=req.victim_name or "Anonymous Victim",
        state=req.victim_state or "Maharashtra",
        city=req.victim_city or "Mumbai",
        loss_inr=req.loss_inr or 500000.0
    )
    db.add(victim)

    rep_wallet = ReportedWallet(
        case_id=new_case.id,
        address=req.address,
        chain=chain,
        reported_amount=round((req.loss_inr or 500000.0) / 83.0, 2),
        status="PENDING_TRACE"
    )
    db.add(rep_wallet)

    # 3. Create trace job record
    trace_job = TraceJob(
        case_id=new_case.id,
        root_address=req.address,
        chain=chain,
        depth=6,
        status="PENDING",
        progress=0
    )
    db.add(trace_job)
    await db.commit()

    return {
        "status": "INGESTED",
        "case_id": new_case.id,
        "case_no": new_case.case_no,
        "job_id": trace_job.id,
        "chain_detected": detection,
        "reported_address": req.address
    }

@router.post("/simulate")
async def simulate_incoming_complaint(req: SimulateComplaintRequest, db: AsyncSession = Depends(get_db)):
    """
    Demo trigger: Simulates an incoming webhook complaint from NCRP / SAHYOG.
    Used for live interactive presentation and YouTube recordings.
    """
    scen_id = req.scenario_id or 1
    # Find matching scenario
    scen_addr = list(SHOWCASE_SCENARIOS.keys())[scen_id - 1]
    scen = SHOWCASE_SCENARIOS[scen_addr]

    case_no = f"2024-NCRP-LIVE-{random.randint(10000, 99999)}"
    
    new_case = Case(
        case_no=case_no,
        source="NCRP",
        complaint_ref=f"NCRP-LIVE-INCIDENT-{random.randint(1000, 9999)}",
        fraud_type=scen["fraud_type"],
        victim_loss_inr=scen["victim_loss_inr"],
        status="UNDER_INVESTIGATION",
        priority="CRITICAL"
    )
    db.add(new_case)
    await db.flush()

    victim = Victim(
        case_id=new_case.id,
        masked_name=scen["victim_name"],
        state="Maharashtra" if scen_id == 1 else "Karnataka",
        city="Pune" if scen_id == 1 else "Bengaluru",
        loss_inr=scen["victim_loss_inr"]
    )
    db.add(victim)

    rep_wallet = ReportedWallet(
        case_id=new_case.id,
        address=scen_addr,
        chain=scen["chain"],
        reported_amount=scen["victim_loss_usd"],
        status="PENDING_TRACE"
    )
    db.add(rep_wallet)

    trace_job = TraceJob(
        case_id=new_case.id,
        root_address=scen_addr,
        chain=scen["chain"],
        depth=len(scen["nodes"]),
        status="PENDING",
        progress=0
    )
    db.add(trace_job)

    # Add an immediate live alert for the dashboard feed
    alert = Alert(
        case_id=new_case.id,
        job_id=trace_job.id,
        severity="CRITICAL",
        title=f"New NCRP Inflow Alert: ₹{scen['victim_loss_inr']:,.0f} {scen['fraud_type'].replace('_', ' ')}",
        body=f"Suspect {scen['chain']} wallet {scen_addr[:10]}... reported with urgent freeze priority. Immediate tracing recommended.",
        status="NEW"
    )
    db.add(alert)

    # Integration event log
    db.add(IntegrationEvent(
        system="NCRP",
        direction="INBOUND",
        payload={"complaint_no": case_no, "amount": scen["victim_loss_inr"], "address": scen_addr},
        status="SUCCESS"
    ))

    await db.commit()

    return {
        "status": "SIMULATED_SUCCESS",
        "case_id": new_case.id,
        "case_no": new_case.case_no,
        "job_id": trace_job.id,
        "root_address": scen_addr,
        "chain": scen["chain"],
        "fraud_type": scen["fraud_type"],
        "victim_loss_inr": scen["victim_loss_inr"],
        "message": f"Real-time NCRP complaint ingested: {case_no}"
    }
