from datetime import datetime, timezone
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.models import FreezeRequest, Case, VASP, AuditLog
from app.schemas.schemas import FreezeRequestCreate, FreezeRequestUpdate

router = APIRouter(prefix="/freeze-requests", tags=["Freeze Request Center"])

def build_bnss_letter(case_no: str, vasp_name: str, deposit_address: str, amount_usd: float) -> str:
    return f"""FORMAL EMERGENCY FREEZE REQUISITION
UNDER SECTION 106 BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023 / SECTION 94 CrPC

To:
The Nodal Officer / Law Enforcement Liaison Team,
{vasp_name} Compliance Department

Subject: Requisition for Immediate Debit-Freeze and Preservation of Virtual Asset Wallet: {deposit_address}
Reference: FIR / NCRP Incident Reference No: {case_no}

Sir / Madam,

1. Whereas, an active cyber financial fraud investigation is being conducted into an organized syndicate committing unauthorized fund siphoning, investment deception, and criminal breach of trust.

2. Forensic ledger tracing conducted by our Cyber Crime Cell using ChainShield intelligence platform has established that tainted victim proceeds amounting to approximately ${amount_usd:,.2f} USDT (or equivalent digital assets) were directly deposited into custodial deposit wallet {deposit_address} administered by {vasp_name}.

3. Now therefore, in exercise of statutory powers vested under Section 106 of Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 read with Section 91/94 of CrPC, you are hereby ORDERED to:
   (a) Immediately enforce a TOTAL DEBIT-FREEZE on wallet {deposit_address} and any linked internal user account/UID.
   (b) Preserve complete KYC records, registered mobile, email, login IP access history, and connected fiat Indian bank/UPI details.
   (c) Furnish transaction logs of any subsequent attempts to move or offramp these assets.

4. Please transmit written confirmation of compliance to this office within your established FIU-IND SLA window.

By Order,
Investigating Officer (IO)
Maharashtra Cyber Crime Investigation Cell / I4C National Desk
"""

@router.get("")
async def list_freeze_requests(db: AsyncSession = Depends(get_db)):
    stmt = (
        select(FreezeRequest)
        .options(selectinload(FreezeRequest.case), selectinload(FreezeRequest.vasp))
        .order_by(desc(FreezeRequest.created_at))
    )
    res = await db.execute(stmt)
    records = res.scalars().all()

    return [
        {
            "id": fr.id,
            "case_id": fr.case_id,
            "case_no": fr.case.case_no if fr.case else "Unknown Case",
            "fraud_type": fr.case.fraud_type if fr.case else "FRAUD",
            "vasp_id": fr.vasp_id,
            "vasp_name": fr.vasp.name if fr.vasp else "Binance",
            "compliance_email": fr.vasp.compliance_email if fr.vasp else "compliance@exchange.com",
            "addresses": fr.addresses,
            "amount_usd": fr.amount_usd,
            "status": fr.status,
            "sent_at": fr.sent_at.isoformat() if fr.sent_at else None,
            "legal_provision": fr.legal_provision,
            "notes": fr.notes,
            "draft_content": fr.draft_content or build_bnss_letter(
                fr.case.case_no if fr.case else "2024-NCRP-MH-084921",
                fr.vasp.name if fr.vasp else "Binance",
                fr.addresses[0] if fr.addresses else "",
                fr.amount_usd
            )
        } for fr in records
    ]

@router.post("")
async def create_freeze_request(req: FreezeRequestCreate, db: AsyncSession = Depends(get_db)):
    case_res = await db.execute(select(Case).where(Case.id == req.case_id))
    case = case_res.scalars().first()
    
    vasp_res = await db.execute(select(VASP).where(VASP.id == req.vasp_id))
    vasp = vasp_res.scalars().first()

    vasp_name = vasp.name if vasp else "Binance"
    case_no = case.case_no if case else "2024-NCRP-LIVE"
    dep_addr = req.addresses[0] if req.addresses else ""

    draft_letter = build_bnss_letter(case_no, vasp_name, dep_addr, req.amount_usd)

    fr = FreezeRequest(
        case_id=req.case_id,
        vasp_id=req.vasp_id,
        addresses=req.addresses,
        amount_usd=req.amount_usd,
        status="DRAFT",
        legal_provision=req.legal_provision,
        notes=req.notes,
        draft_content=draft_letter
    )
    db.add(fr)
    
    # Audit log
    db.add(AuditLog(
        user_name="IO Rajan Sharma",
        action="FREEZE_DRAFT_CREATED",
        entity="FREEZE_REQUEST",
        metadata_json={"vasp": vasp_name, "amount_usd": req.amount_usd, "address": dep_addr}
    ))

    await db.commit()
    await db.refresh(fr)

    return {
        "id": fr.id,
        "status": "DRAFT",
        "vasp_name": vasp_name,
        "amount_usd": fr.amount_usd,
        "draft_content": draft_letter
    }

@router.patch("/{id}")
async def update_freeze_request(id: str, req: FreezeRequestUpdate, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(FreezeRequest).where(FreezeRequest.id == id))
    fr = res.scalars().first()
    if not fr:
        raise HTTPException(status_code=404, detail="Freeze request not found")

    if req.status:
        fr.status = req.status
        if req.status == "SENT":
            fr.sent_at = datetime.now(timezone.utc)
            # Log audit
            db.add(AuditLog(
                user_name="IO Rajan Sharma",
                action="FREEZE_NOTICE_DISPATCHED",
                entity="FREEZE_REQUEST",
                entity_id=fr.id,
                metadata_json={"status": "SENT"}
            ))
        elif req.status == "FROZEN":
            fr.response_at = datetime.now(timezone.utc)
            db.add(AuditLog(
                user_name="Nodal Officer Hemant Varma",
                action="VASP_ASSETS_FROZEN",
                entity="FREEZE_REQUEST",
                entity_id=fr.id,
                metadata_json={"status": "FROZEN", "amount": fr.amount_usd}
            ))
    if req.notes is not None:
        fr.notes = req.notes
    if req.draft_content is not None:
        fr.draft_content = req.draft_content

    await db.commit()
    return {"id": fr.id, "status": fr.status, "message": f"Status updated to {fr.status}"}
