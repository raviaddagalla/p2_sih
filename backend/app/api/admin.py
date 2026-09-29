from fastapi import APIRouter, Depends
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.models import User, Agency, AuditLog

router = APIRouter(tags=["Admin & Health"])

@router.get("/health")
async def health_check():
    return {
        "status": "HEALTHY",
        "service": "ChainShield LEA Crypto Fraud Attribution Platform",
        "version": "1.0.0",
        "indexer_chains_online": ["TRON", "BTC", "ETH", "BSC", "POLYGON", "SOL"],
        "fiu_ind_sync": "CONNECTED"
    }

@router.get("/admin/users")
async def list_admin_users(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(User).order_by(User.name))
    users = res.scalars().all()
    return [
        {
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "badge_no": u.badge_no,
            "is_active": u.is_active,
            "agency_id": u.agency_id
        } for u in users
    ]

@router.get("/admin/agencies")
async def list_admin_agencies(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Agency).order_by(Agency.name))
    agencies = res.scalars().all()
    return [
        {
            "id": a.id,
            "name": a.name,
            "state": a.state,
            "type": a.type
        } for a in agencies
    ]

@router.get("/audit-logs")
async def list_audit_logs(limit: int = 50, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(AuditLog).order_by(desc(AuditLog.created_at)).limit(limit))
    logs = res.scalars().all()
    return [
        {
            "id": l.id,
            "user_name": l.user_name,
            "action": l.action,
            "entity": l.entity,
            "entity_id": l.entity_id,
            "ip": l.ip,
            "metadata": l.metadata_json,
            "created_at": l.created_at.isoformat() if l.created_at else None
        } for l in logs
    ]
