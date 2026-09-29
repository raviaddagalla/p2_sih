from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.models import Alert, Watchlist
from app.schemas.schemas import WatchlistCreate

router = APIRouter(tags=["Alerts & Watchlist"])

@router.get("/alerts")
async def list_alerts(limit: int = 40, db: AsyncSession = Depends(get_db)):
    stmt = select(Alert).order_by(desc(Alert.created_at)).limit(limit)
    res = await db.execute(stmt)
    alerts = res.scalars().all()

    # If database has few alerts, ensure we provide dynamic live ones
    result = []
    for a in alerts:
        result.append({
            "id": a.id,
            "case_id": a.case_id,
            "job_id": a.job_id,
            "severity": a.severity,
            "title": a.title,
            "body": a.body,
            "status": a.status,
            "created_at": a.created_at.isoformat() if a.created_at else datetime.now(timezone.utc).isoformat()
        })
    return result

@router.patch("/alerts/{id}")
async def update_alert(id: str, status: str = "ACK", db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Alert).where(Alert.id == id))
    alert = res.scalars().first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = status
    await db.commit()
    return {"id": alert.id, "status": alert.status}

@router.get("/watchlist")
async def list_watchlist(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Watchlist).order_by(desc(Watchlist.created_at)))
    items = res.scalars().all()
    return [
        {
            "address": w.address,
            "chain": w.chain,
            "reason": w.reason,
            "added_by": w.added_by,
            "created_at": w.created_at.isoformat() if w.created_at else None
        } for w in items
    ]

@router.post("/watchlist")
async def add_to_watchlist(req: WatchlistCreate, db: AsyncSession = Depends(get_db)):
    item = Watchlist(
        address=req.address,
        chain=req.chain,
        reason=req.reason,
        added_by="IO Rajan Sharma"
    )
    db.add(item)
    await db.commit()
    return {"status": "WATCHLISTED", "address": req.address, "chain": req.chain}
