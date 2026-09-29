import uuid
from datetime import datetime, timezone
from typing import Optional, List
from sqlalchemy import (
    String, Integer, Float, Boolean, DateTime, Text, JSON, ForeignKey, Index
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="IO")  # IO, ANALYST, NODAL, SUPERVISOR, ADMIN, AUDITOR
    agency_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("agencies.id"), nullable=True)
    badge_no: Mapped[Optional[str]] = mapped_column(String(60), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    mfa_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    last_login: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    agency = relationship("Agency", back_populates="users", lazy="selectin")

class Agency(Base):
    __tablename__ = "agencies"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    type: Mapped[str] = mapped_column(String(100), default="State Cyber Cell")  # State Cyber Cell, I4C, CBI, ED, etc.
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    users = relationship("User", back_populates="agency")
    cases = relationship("Case", back_populates="agency")

class Case(Base):
    __tablename__ = "cases"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    case_no: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    source: Mapped[str] = mapped_column(String(50), default="NCRP")  # NCRP, SAHYOG, MANUAL
    complaint_ref: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    fraud_type: Mapped[str] = mapped_column(String(100), nullable=False)  # TASK_SCAM, INVESTMENT, SEXTORTION, RANSOMWARE, PHISHING
    victim_loss_inr: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(50), default="NEW")  # NEW, UNDER_INVESTIGATION, TRACED, FROZEN, CLOSED
    priority: Mapped[str] = mapped_column(String(50), default="HIGH")  # CRITICAL, HIGH, MEDIUM, LOW
    assigned_to: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("users.id"), nullable=True)
    agency_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("agencies.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    agency = relationship("Agency", back_populates="cases")
    assigned_user = relationship("User", foreign_keys=[assigned_to], lazy="selectin")
    victims = relationship("Victim", back_populates="case", cascade="all, delete-orphan", lazy="selectin")
    reported_wallets = relationship("ReportedWallet", back_populates="case", cascade="all, delete-orphan", lazy="selectin")
    trace_jobs = relationship("TraceJob", back_populates="case", cascade="all, delete-orphan", lazy="selectin")
    freeze_requests = relationship("FreezeRequest", back_populates="case", cascade="all, delete-orphan", lazy="selectin")
    alerts = relationship("Alert", back_populates="case", cascade="all, delete-orphan")

class Victim(Base):
    __tablename__ = "victims"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    case_id: Mapped[str] = mapped_column(String(36), ForeignKey("cases.id"), nullable=False)
    masked_name: Mapped[str] = mapped_column(String(100), nullable=False)  # synthetic e.g. R*****h S.
    state: Mapped[str] = mapped_column(String(100), nullable=False)
    city: Mapped[str] = mapped_column(String(100), nullable=False)
    age_bracket: Mapped[str] = mapped_column(String(50), default="25-35")
    loss_inr: Mapped[float] = mapped_column(Float, default=0.0)

    case = relationship("Case", back_populates="victims")

class ReportedWallet(Base):
    __tablename__ = "reported_wallets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    case_id: Mapped[str] = mapped_column(String(36), ForeignKey("cases.id"), nullable=False)
    address: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    chain: Mapped[str] = mapped_column(String(30), nullable=False)  # TRON, BTC, ETH, BSC, POLYGON
    reported_amount: Mapped[float] = mapped_column(Float, default=0.0)
    reported_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    status: Mapped[str] = mapped_column(String(50), default="PENDING_TRACE")

    case = relationship("Case", back_populates="reported_wallets")

class Wallet(Base):
    __tablename__ = "wallets"

    address: Mapped[str] = mapped_column(String(128), primary_key=True)
    chain: Mapped[str] = mapped_column(String(30), primary_key=True)
    first_seen: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_seen: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    tx_count: Mapped[int] = mapped_column(Integer, default=0)
    balance_native: Mapped[float] = mapped_column(Float, default=0.0)
    balance_usd: Mapped[float] = mapped_column(Float, default=0.0)
    cluster_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    entity_type: Mapped[str] = mapped_column(String(50), default="UNKNOWN")  # EXCHANGE, MIXER, BRIDGE, DEFI, BURNER, INTERMEDIARY, UNKNOWN
    risk_score: Mapped[int] = mapped_column(Integer, default=0)  # 0 - 100
    risk_category: Mapped[str] = mapped_column(String(30), default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    labels: Mapped[Optional[list]] = mapped_column(JSON, default=list)

    __table_args__ = (
        Index("idx_wallet_lookup", "address", "chain"),
    )

class Transaction(Base):
    __tablename__ = "transactions"

    hash: Mapped[str] = mapped_column(String(128), primary_key=True)
    chain: Mapped[str] = mapped_column(String(30), nullable=False)
    block: Mapped[int] = mapped_column(Integer, default=0)
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    from_addr: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    to_addr: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    value_native: Mapped[float] = mapped_column(Float, default=0.0)
    value_usd: Mapped[float] = mapped_column(Float, default=0.0)
    token: Mapped[str] = mapped_column(String(30), default="NATIVE")
    fee: Mapped[float] = mapped_column(Float, default=0.0)
    method: Mapped[Optional[str]] = mapped_column(String(100), default="transfer")
    is_bridge: Mapped[bool] = mapped_column(Boolean, default=False)
    is_mixer_touch: Mapped[bool] = mapped_column(Boolean, default=False)

class Cluster(Base):
    __tablename__ = "clusters"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    chain: Mapped[str] = mapped_column(String(30), nullable=False)
    heuristic: Mapped[str] = mapped_column(String(100), default="DEPOSIT_SWEEP")
    size: Mapped[int] = mapped_column(Integer, default=1)
    label: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    vasp_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("vasps.id"), nullable=True)
    confidence: Mapped[float] = mapped_column(Float, default=0.90)

class VASP(Base):
    __tablename__ = "vasps"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    name: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)
    type: Mapped[str] = mapped_column(String(100), default="Centralized Exchange (CEX)")
    country: Mapped[str] = mapped_column(String(100), default="Global / Cayman Islands")
    jurisdiction: Mapped[str] = mapped_column(String(100), default="Global")
    compliance_email: Mapped[str] = mapped_column(String(150), nullable=False)
    nodal_officer_contact: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    india_registered: Mapped[bool] = mapped_column(Boolean, default=True)  # FIU-IND registered
    freeze_response_sla_hours: Mapped[int] = mapped_column(Integer, default=24)
    supported_chains: Mapped[Optional[list]] = mapped_column(JSON, default=list)
    logo_url: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    addresses = relationship("VASPAddress", back_populates="vasp", cascade="all, delete-orphan", lazy="selectin")
    freeze_requests = relationship("FreezeRequest", back_populates="vasp")

class VASPAddress(Base):
    __tablename__ = "vasp_addresses"

    address: Mapped[str] = mapped_column(String(128), primary_key=True)
    chain: Mapped[str] = mapped_column(String(30), primary_key=True)
    vasp_id: Mapped[str] = mapped_column(String(36), ForeignKey("vasps.id"), nullable=False)
    wallet_role: Mapped[str] = mapped_column(String(50), default="DEPOSIT")  # HOT, COLD, DEPOSIT
    confidence: Mapped[float] = mapped_column(Float, default=0.95)
    source: Mapped[str] = mapped_column(String(100), default="FIU-IND Verified")

    vasp = relationship("VASP", back_populates="addresses")

class TraceJob(Base):
    __tablename__ = "trace_jobs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    case_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("cases.id"), nullable=True)
    root_address: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    chain: Mapped[str] = mapped_column(String(30), nullable=False)
    depth: Mapped[int] = mapped_column(Integer, default=6)
    status: Mapped[str] = mapped_column(String(50), default="RUNNING")  # RUNNING, COMPLETED, FAILED
    progress: Mapped[int] = mapped_column(Integer, default=0)  # 0 to 100
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    finished_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    stats_json: Mapped[Optional[dict]] = mapped_column(JSON, default=dict)

    case = relationship("Case", back_populates="trace_jobs")
    edges = relationship("TraceEdge", back_populates="job", cascade="all, delete-orphan", lazy="selectin")
    findings = relationship("Finding", back_populates="job", cascade="all, delete-orphan", lazy="selectin")

class TraceEdge(Base):
    __tablename__ = "trace_edges"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("trace_jobs.id"), nullable=False)
    from_addr: Mapped[str] = mapped_column(String(128), nullable=False)
    to_addr: Mapped[str] = mapped_column(String(128), nullable=False)
    chain: Mapped[str] = mapped_column(String(30), nullable=False)
    total_value_usd: Mapped[float] = mapped_column(Float, default=0.0)
    tx_count: Mapped[int] = mapped_column(Integer, default=1)
    hop_no: Mapped[int] = mapped_column(Integer, default=1)
    pattern_tag: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    job = relationship("TraceJob", back_populates="edges")

class Finding(Base):
    __tablename__ = "findings"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    job_id: Mapped[str] = mapped_column(String(36), ForeignKey("trace_jobs.id"), nullable=False)
    type: Mapped[str] = mapped_column(String(50), nullable=False)  # VASP_HIT, PATTERN, MIXER, BRIDGE
    severity: Mapped[str] = mapped_column(String(30), default="INFO")  # INFO, WARNING, HIGH, CRITICAL
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    evidence_json: Mapped[Optional[dict]] = mapped_column(JSON, default=dict)
    confidence: Mapped[float] = mapped_column(Float, default=0.90)

    job = relationship("TraceJob", back_populates="findings")

class Alert(Base):
    __tablename__ = "alerts"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    case_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("cases.id"), nullable=True)
    job_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("trace_jobs.id"), nullable=True)
    severity: Mapped[str] = mapped_column(String(30), default="HIGH")  # CRITICAL, HIGH, MEDIUM, LOW
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default="NEW")  # NEW, ACK, ACTIONED
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    case = relationship("Case", back_populates="alerts")

class FreezeRequest(Base):
    __tablename__ = "freeze_requests"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    case_id: Mapped[str] = mapped_column(String(36), ForeignKey("cases.id"), nullable=False)
    vasp_id: Mapped[str] = mapped_column(String(36), ForeignKey("vasps.id"), nullable=False)
    addresses: Mapped[list] = mapped_column(JSON, default=list)
    amount_usd: Mapped[float] = mapped_column(Float, default=0.0)
    status: Mapped[str] = mapped_column(String(50), default="DRAFT")  # DRAFT, SENT, ACKNOWLEDGED, FROZEN, REJECTED
    sent_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    response_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    legal_provision: Mapped[str] = mapped_column(String(100), default="Section 106 BNSS / Section 94 CrPC")
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    draft_content: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    case = relationship("Case", back_populates="freeze_requests", lazy="selectin")
    vasp = relationship("VASP", back_populates="freeze_requests", lazy="selectin")

class Report(Base):
    __tablename__ = "reports"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    case_id: Mapped[str] = mapped_column(String(36), ForeignKey("cases.id"), nullable=False)
    type: Mapped[str] = mapped_column(String(50), default="LEA_FULL")  # LEA_FULL, VASP_FREEZE_NOTICE, STIX_JSON
    file_path: Mapped[str] = mapped_column(String(255), nullable=False)
    generated_by: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    user_id: Mapped[Optional[str]] = mapped_column(String(36), nullable=True)
    user_name: Mapped[Optional[str]] = mapped_column(String(120), nullable=True)
    action: Mapped[str] = mapped_column(String(100), nullable=False)  # TRACE_STARTED, FREEZE_SENT, CASE_VIEWED
    entity: Mapped[str] = mapped_column(String(100), nullable=False)  # CASE, TRACE, VASP, WALLET
    entity_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    ip: Mapped[str] = mapped_column(String(50), default="127.0.0.1")
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

class IntegrationEvent(Base):
    __tablename__ = "integration_events"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=generate_uuid)
    system: Mapped[str] = mapped_column(String(50), nullable=False)  # NCRP, SAHYOG
    direction: Mapped[str] = mapped_column(String(30), default="INBOUND")
    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    status: Mapped[str] = mapped_column(String(50), default="PROCESSED")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

class Watchlist(Base):
    __tablename__ = "watchlist"

    address: Mapped[str] = mapped_column(String(128), primary_key=True)
    chain: Mapped[str] = mapped_column(String(30), primary_key=True)
    reason: Mapped[str] = mapped_column(String(255), nullable=False)
    added_by: Mapped[str] = mapped_column(String(120), default="IO Rajan Sharma")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
