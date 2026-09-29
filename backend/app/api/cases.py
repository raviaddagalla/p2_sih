from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.models import Case, Victim, ReportedWallet, TraceJob, FreezeRequest
from app.schemas.schemas import CaseCreate, CaseResponse

router = APIRouter(prefix="/cases", tags=["Cases"])

@router.get("")
async def list_cases(
    status: Optional[str] = None,
    fraud_type: Optional[str] = None,
    priority: Optional[str] = None,
    query: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(Case)
        .options(
            selectinload(Case.victims),
            selectinload(Case.reported_wallets),
            selectinload(Case.freeze_requests)
        )
        .order_by(desc(Case.created_at))
    )

    if status:
        stmt = stmt.where(Case.status == status)
    if fraud_type:
        stmt = stmt.where(Case.fraud_type == fraud_type)
    if priority:
        stmt = stmt.where(Case.priority == priority)
    if query:
        stmt = stmt.where(Case.case_no.ilike(f"%{query}%"))

    stmt = stmt.limit(limit).offset(offset)
    res = await db.execute(stmt)
    cases = res.scalars().all()

    result = []
    for c in cases:
        result.append({
            "id": c.id,
            "case_no": c.case_no,
            "source": c.source,
            "complaint_ref": c.complaint_ref,
            "fraud_type": c.fraud_type,
            "victim_loss_inr": c.victim_loss_inr,
            "status": c.status,
            "priority": c.priority,
            "created_at": c.created_at.isoformat() if c.created_at else None,
            "victims": [
                {
                    "masked_name": v.masked_name,
                    "state": v.state,
                    "city": v.city,
                    "loss_inr": v.loss_inr
                } for v in c.victims
            ],
            "reported_wallets": [
                {
                    "address": rw.address,
                    "chain": rw.chain,
                    "reported_amount": rw.reported_amount,
                    "status": rw.status
                } for rw in c.reported_wallets
            ],
            "freeze_count": len(c.freeze_requests)
        })

    return result

@router.get("/{id}")
async def get_case(id: str, db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Case)
        .where(Case.id == id)
        .options(
            selectinload(Case.victims),
            selectinload(Case.reported_wallets),
            selectinload(Case.trace_jobs),
            selectinload(Case.freeze_requests)
        )
    )
    res = await db.execute(stmt)
    case = res.scalars().first()

    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    return {
        "id": case.id,
        "case_no": case.case_no,
        "source": case.source,
        "complaint_ref": case.complaint_ref,
        "fraud_type": case.fraud_type,
        "victim_loss_inr": case.victim_loss_inr,
        "status": case.status,
        "priority": case.priority,
        "assigned_to": case.assigned_to,
        "created_at": case.created_at.isoformat() if case.created_at else None,
        "victims": [
            {
                "masked_name": v.masked_name,
                "state": v.state,
                "city": v.city,
                "loss_inr": v.loss_inr
            } for v in case.victims
        ],
        "reported_wallets": [
            {
                "address": rw.address,
                "chain": rw.chain,
                "reported_amount": rw.reported_amount,
                "status": rw.status
            } for rw in case.reported_wallets
        ],
        "trace_jobs": [
            {
                "id": tj.id,
                "root_address": tj.root_address,
                "chain": tj.chain,
                "status": tj.status,
                "progress": tj.progress,
                "stats": tj.stats_json
            } for tj in case.trace_jobs
        ],
        "freeze_requests": [
            {
                "id": fr.id,
                "vasp_id": fr.vasp_id,
                "amount_usd": fr.amount_usd,
                "status": fr.status,
                "legal_provision": fr.legal_provision
            } for fr in case.freeze_requests
        ]
    }
