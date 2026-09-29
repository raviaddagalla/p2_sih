from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.models import VASP

router = APIRouter(prefix="/vasps", tags=["VASP Directory"])

@router.get("")
async def list_vasps(
    query: Optional[str] = None,
    fiu_only: Optional[bool] = None,
    db: AsyncSession = Depends(get_db)
):
    stmt = select(VASP).order_by(VASP.name)
    if fiu_only:
        stmt = stmt.where(VASP.india_registered == True)
    if query:
        stmt = stmt.where(VASP.name.ilike(f"%{query}%"))

    res = await db.execute(stmt)
    vasps = res.scalars().all()

    return [
        {
            "id": v.id,
            "name": v.name,
            "type": v.type,
            "country": v.country,
            "jurisdiction": v.jurisdiction,
            "compliance_email": v.compliance_email,
            "nodal_officer_contact": v.nodal_officer_contact,
            "india_registered": v.india_registered,
            "freeze_response_sla_hours": v.freeze_response_sla_hours,
            "supported_chains": v.supported_chains or [],
            "logo_url": v.logo_url
        } for v in vasps
    ]

@router.get("/{id}")
async def get_vasp(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(VASP).where(VASP.id == id))
    v = res.scalars().first()
    if not v:
        raise HTTPException(status_code=404, detail="VASP not found")
    return {
        "id": v.id,
        "name": v.name,
        "type": v.type,
        "country": v.country,
        "jurisdiction": v.jurisdiction,
        "compliance_email": v.compliance_email,
        "nodal_officer_contact": v.nodal_officer_contact,
        "india_registered": v.india_registered,
        "freeze_response_sla_hours": v.freeze_response_sla_hours,
        "supported_chains": v.supported_chains or [],
        "logo_url": v.logo_url
    }
