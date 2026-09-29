import asyncio
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db, AsyncSessionLocal
from app.models.models import TraceJob, TraceEdge, Finding, ReportedWallet, Case
from app.schemas.schemas import TraceStartRequest, TraceGraphResponse
from app.chains.detector import detect_address_chain
from app.analysis.tracer import run_trace_job

router = APIRouter(tags=["Tracing Engine"])

# Active WebSocket connections dictionary for trace jobs
active_trace_sockets: Dict[str, list] = {}

@router.post("/trace")
async def start_trace(req: TraceStartRequest, db: AsyncSession = Depends(get_db)):
    detection = detect_address_chain(req.address)
    chain = req.chain or detection["chain"]

    # Create new trace job record
    job = TraceJob(
        case_id=req.case_id,
        root_address=req.address,
        chain=chain,
        depth=req.depth,
        status="RUNNING",
        progress=0
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)

    # Launch trace in background asyncio task
    asyncio.create_task(execute_trace_task(job.id, req.address, chain, req.depth))

    return {
        "job_id": job.id,
        "root_address": req.address,
        "chain": chain,
        "status": "RUNNING",
        "ws_url": f"/ws/trace/{job.id}"
    }

async def execute_trace_task(job_id: str, root_address: str, chain: str, depth: int):
    """
    Background worker that executes the trace and broadcasts events to connected WebSockets.
    """
    async def broadcast_event(event: Dict[str, Any]):
        if job_id in active_trace_sockets:
            dead_sockets = []
            for ws in active_trace_sockets[job_id]:
                try:
                    await ws.send_text(json.dumps(event))
                except Exception:
                    dead_sockets.append(ws)
            for ws in dead_sockets:
                active_trace_sockets[job_id].remove(ws)

    results = await run_trace_job(root_address, chain, depth, broadcast_event)

    # Persist results in DB
    async with AsyncSessionLocal() as session:
        query = select(TraceJob).where(TraceJob.id == job_id)
        res = await session.execute(query)
        job = res.scalars().first()
        if job:
            job.status = "COMPLETED"
            job.progress = 100
            job.finished_at = datetime.now(timezone.utc)
            job.stats_json = results.get("stats", {})

            # Persist edges
            for e in results.get("edges", []):
                session.add(TraceEdge(
                    job_id=job.id,
                    from_addr=e["from_addr"],
                    to_addr=e["to_addr"],
                    chain=e["chain"],
                    total_value_usd=e["total_value_usd"],
                    tx_count=e.get("tx_count", 1),
                    hop_no=e.get("hop_no", 1),
                    pattern_tag=e.get("pattern_tag")
                ))

            # Persist findings
            for f in results.get("findings", []):
                session.add(Finding(
                    job_id=job.id,
                    type=f["type"],
                    severity=f["severity"],
                    title=f["title"],
                    description=f["description"],
                    evidence_json=f.get("evidence_json", f.get("evidence", {})),
                    confidence=f.get("confidence", 0.90)
                ))

            # Update reported wallet status if linked
            if job.case_id:
                rw_query = select(ReportedWallet).where(ReportedWallet.case_id == job.case_id)
                rw_res = await session.execute(rw_query)
                rw = rw_res.scalars().first()
                if rw:
                    rw.status = "TRACED"

            await session.commit()

@router.get("/trace/{job_id}/graph")
async def get_trace_graph(job_id: str, db: AsyncSession = Depends(get_db)):
    query = select(TraceJob).where(TraceJob.id == job_id)
    res = await db.execute(query)
    job = res.scalars().first()

    if not job:
        raise HTTPException(status_code=404, detail="Trace job not found")

    # Run trace synchronously if needed or retrieve results
    results = await run_trace_job(job.root_address, job.chain, job.depth)

    return {
        "job_id": job.id,
        "root_address": job.root_address,
        "chain": job.chain,
        "status": job.status,
        "progress": job.progress,
        "nodes": results["nodes"],
        "edges": results["edges"],
        "findings": results["findings"],
        "attribution": results["attribution"],
        "recommendations": results.get("recommendations", []),
        "stats": results.get("stats", {})
    }

@router.websocket("/ws/trace/{job_id}")
async def trace_websocket(websocket: WebSocket, job_id: str):
    await websocket.accept()
    active_trace_sockets.setdefault(job_id, []).append(websocket)
    try:
        # Keep alive loop
        while True:
            data = await websocket.receive_text()
            # If client sends "start", trigger trace playback
            if "start" in data.lower():
                async with AsyncSessionLocal() as session:
                    res = await session.execute(select(TraceJob).where(TraceJob.id == job_id))
                    job = res.scalars().first()
                    if job:
                        asyncio.create_task(execute_trace_task(job.id, job.root_address, job.chain, job.depth))
    except WebSocketDisconnect:
        if job_id in active_trace_sockets and websocket in active_trace_sockets[job_id]:
            active_trace_sockets[job_id].remove(websocket)
