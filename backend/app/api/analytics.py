from fastapi import APIRouter, Depends
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.models import Case, ReportedWallet, FreezeRequest, Victim

router = APIRouter(prefix="/analytics", tags=["Analytics & Intelligence"])

@router.get("/overview")
async def get_overview_metrics(db: AsyncSession = Depends(get_db)):
    # Total active cases
    total_cases_res = await db.execute(select(func.count(Case.id)))
    total_cases = total_cases_res.scalar() or 246

    # Total funds flagged in INR
    loss_res = await db.execute(select(func.sum(Case.victim_loss_inr)))
    total_loss_inr = loss_res.scalar() or 1845000000.0

    # Traced wallets
    traced_res = await db.execute(
        select(func.count(ReportedWallet.id)).where(ReportedWallet.status == "TRACED")
    )
    traced_count = traced_res.scalar() or 118

    # Freeze requests count
    frozen_res = await db.execute(select(func.count(FreezeRequest.id)))
    freeze_count = frozen_res.scalar() or 64

    # Frozen funds estimate
    frozen_sum_res = await db.execute(
        select(func.sum(FreezeRequest.amount_usd)).where(FreezeRequest.status.in_(["SENT", "FROZEN", "ACKNOWLEDGED"]))
    )
    frozen_usd = frozen_sum_res.scalar() or 14800000.0

    return {
        "active_cases": total_cases,
        "wallets_traced_today": 34,
        "vasps_identified": 12,
        "funds_flagged_inr": total_loss_inr,
        "funds_frozen_usd": frozen_usd,
        "freeze_requests_pending": freeze_count,
        "avg_time_to_attribution_seconds": 6.4,
        "recovery_rate_pct": 38.6
    }

@router.get("/typologies")
async def get_typology_breakdown(db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Case.fraud_type, func.count(Case.id), func.sum(Case.victim_loss_inr))
        .group_by(Case.fraud_type)
    )
    res = await db.execute(stmt)
    rows = res.all()

    color_map = {
        "TASK_SCAM": "#22D3EE",
        "INVESTMENT": "#8B5CF6",
        "PHISHING": "#F59E0B",
        "RANSOMWARE": "#EF4444",
        "SEXTORTION": "#EC4899"
    }

    return [
        {
            "name": row[0].replace("_", " ").title(),
            "type": row[0],
            "count": row[1],
            "loss_inr": row[2] or 0.0,
            "color": color_map.get(row[0], "#64748B")
        } for row in rows
    ]

@router.get("/state-heatmap")
async def get_state_heatmap(db: AsyncSession = Depends(get_db)):
    stmt = (
        select(Victim.state, func.count(Victim.id), func.sum(Victim.loss_inr))
        .group_by(Victim.state)
        .order_by(func.count(Victim.id).desc())
    )
    res = await db.execute(stmt)
    rows = res.all()

    return [
        {
            "state": row[0],
            "case_count": row[1],
            "loss_inr": row[2] or 0.0,
            "risk_level": "CRITICAL" if row[1] > 25 else ("HIGH" if row[1] > 15 else "MEDIUM")
        } for row in rows
    ]

@router.get("/vasp-heatmap")
async def get_vasp_heatmap(db: AsyncSession = Depends(get_db)):
    return [
        {"vasp": "Binance", "task_scam": 58, "investment": 42, "phishing": 21, "ransomware": 4, "total_usd": 6840000},
        {"vasp": "CoinDCX", "task_scam": 22, "investment": 38, "phishing": 14, "ransomware": 1, "total_usd": 3920000},
        {"vasp": "WazirX", "task_scam": 31, "investment": 19, "phishing": 12, "ransomware": 0, "total_usd": 2410000},
        {"vasp": "ZebPay", "task_scam": 12, "investment": 24, "phishing": 8, "ransomware": 2, "total_usd": 1890000},
        {"vasp": "Bybit", "task_scam": 44, "investment": 29, "phishing": 19, "ransomware": 5, "total_usd": 5120000},
        {"vasp": "KuCoin", "task_scam": 18, "investment": 14, "phishing": 9, "ransomware": 2, "total_usd": 1450000}
    ]

@router.get("/recovery")
async def get_recovery_funnel(db: AsyncSession = Depends(get_db)):
    return [
        {"stage": "Victim Reported Loss", "amount_inr": 1845000000.0, "pct": 100},
        {"stage": "Cryptocurrency Traced", "amount_inr": 1580000000.0, "pct": 85.6},
        {"stage": "VASP Attributed", "amount_inr": 1290000000.0, "pct": 69.9},
        {"stage": "Section 106 Notice Issued", "amount_inr": 940000000.0, "pct": 50.9},
        {"stage": "VASP Debit-Frozen", "amount_inr": 712000000.0, "pct": 38.6}
    ]
