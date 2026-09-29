from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.chains.simulated import simulated_provider
from app.analysis.risk import calculate_wallet_risk

router = APIRouter(prefix="/wallets", tags=["Wallet Intelligence"])

@router.get("/{chain}/{address}")
async def get_wallet_profile(chain: str, address: str, db: AsyncSession = Depends(get_db)):
    info = await simulated_provider.get_address_info(address, chain)
    outflows = await simulated_provider.get_outflow_transactions(address, chain)

    risk_meta = calculate_wallet_risk(
        entity_type=info.get("entity_type", "INTERMEDIARY"),
        labels=info.get("labels", []),
        tx_count=info.get("tx_count", 12),
        balance_usd=info.get("balance_usd", 1200.0),
        findings=[]
    )

    return {
        "address": address,
        "chain": chain,
        "first_seen": info.get("first_seen"),
        "last_seen": info.get("last_seen"),
        "tx_count": info.get("tx_count", 15),
        "balance_native": info.get("balance_native", 0.0),
        "balance_usd": info.get("balance_usd", 0.0),
        "entity_type": info.get("entity_type", "INTERMEDIARY"),
        "risk_score": risk_meta["risk_score"],
        "risk_category": risk_meta["risk_category"],
        "labels": info.get("labels", []),
        "risk_factors": risk_meta["factors"],
        "recent_txs": outflows
    }
