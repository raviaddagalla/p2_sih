import os
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.core.database import get_db
from app.models.models import Case, TraceJob, Report
from app.schemas.schemas import ReportGenerateRequest
from app.reports.pdf_generator import generate_lea_report_pdf
from app.analysis.tracer import run_trace_job

router = APIRouter(prefix="/reports", tags=["Reports & Exports"])

@router.post("/generate")
async def generate_report(req: ReportGenerateRequest, db: AsyncSession = Depends(get_db)):
    case_res = await db.execute(
        select(Case)
        .where(Case.id == req.case_id)
        .options(selectinload(Case.victims), selectinload(Case.reported_wallets), selectinload(Case.trace_jobs))
    )
    case = case_res.scalars().first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    # Get trace data
    root_addr = case.reported_wallets[0].address if case.reported_wallets else "TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L"
    chain = case.reported_wallets[0].chain if case.reported_wallets else "TRON"
    trace_data = await run_trace_job(root_addr, chain)

    case_dict = {
        "case_no": case.case_no,
        "fraud_type": case.fraud_type,
        "victim_loss_inr": case.victim_loss_inr,
        "source": case.source
    }

    pdf_bytes = generate_lea_report_pdf(case_dict, trace_data)

    # Save to scratch/reports directory
    os.makedirs("./generated_reports", exist_ok=True)
    report_filename = f"ChainShield_Report_{case.case_no}.pdf"
    file_path = os.path.join("./generated_reports", report_filename)
    with open(file_path, "wb") as f:
        f.write(pdf_bytes)

    report_record = Report(
        case_id=case.id,
        type=req.type,
        file_path=file_path,
        generated_by="IO Rajan Sharma"
    )
    db.add(report_record)
    await db.commit()

    return {
        "report_id": report_record.id,
        "case_no": case.case_no,
        "filename": report_filename,
        "download_url": f"/api/reports/{report_record.id}/download"
    }

@router.get("/{id}/download")
async def download_report(id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Report).where(Report.id == id))
    rep = res.scalars().first()
    if not rep or not os.path.exists(rep.file_path):
        # Generate default PDF on the fly
        case_dict = {
            "case_no": "2024-NCRP-MH-084921",
            "fraud_type": "TASK_SCAM",
            "victim_loss_inr": 4250000.0,
            "source": "NCRP"
        }
        trace_data = await run_trace_job("TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L", "TRON")
        pdf_bytes = generate_lea_report_pdf(case_dict, trace_data)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=ChainShield_Investigation_Report.pdf"}
        )

    with open(rep.file_path, "rb") as f:
        content = f.read()

    filename = os.path.basename(rep.file_path)
    return Response(
        content=content,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
