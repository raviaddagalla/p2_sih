from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserLogin(BaseModel):
    email: str
    password: str

class UserVerifyOTP(BaseModel):
    email: str
    otp: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    agency_id: Optional[str] = None
    badge_no: Optional[str] = None
    is_active: bool
    last_login: Optional[datetime] = None

# --- Ingestion Schemas ---
class SingleIngestRequest(BaseModel):
    address: str
    chain: Optional[str] = None  # Auto-detected if omitted
    case_no: Optional[str] = None
    fraud_type: Optional[str] = "TASK_SCAM"
    victim_name: Optional[str] = "Anonymous Victim"
    victim_state: Optional[str] = "Maharashtra"
    victim_city: Optional[str] = "Mumbai"
    loss_inr: Optional[float] = 500000.0
    auto_trace: bool = True

class BulkIngestItem(BaseModel):
    address: str
    chain: Optional[str] = None
    case_no: Optional[str] = None
    fraud_type: Optional[str] = None
    loss_inr: Optional[float] = None

class SimulateComplaintRequest(BaseModel):
    scenario_id: Optional[int] = 1  # 1 to 6
    fraud_type: Optional[str] = None
    state: Optional[str] = None
    loss_inr: Optional[float] = None

# --- Wallet & Trace Schemas ---
class TraceStartRequest(BaseModel):
    address: str
    chain: Optional[str] = None
    case_id: Optional[str] = None
    depth: int = 6
    min_value_usd: float = 10.0

class TraceNode(BaseModel):
    id: str
    address: str
    chain: str
    entity_type: str
    risk_score: int
    risk_category: str
    balance_usd: float
    is_root: bool = False
    is_vasp: bool = False
    vasp_name: Optional[str] = None
    labels: List[str] = []
    hop: int = 0

class TraceEdgeItem(BaseModel):
    id: str
    from_addr: str
    to_addr: str
    chain: str
    total_value_usd: float
    tx_count: int
    hop_no: int
    pattern_tag: Optional[str] = None

class FindingItem(BaseModel):
    id: str
    type: str
    severity: str
    title: str
    description: str
    evidence_json: Dict[str, Any] = {}
    confidence: float

class TraceGraphResponse(BaseModel):
    job_id: str
    root_address: str
    chain: str
    status: str
    progress: int
    nodes: List[TraceNode]
    edges: List[TraceEdgeItem]
    findings: List[FindingItem]
    attribution: Optional[Dict[str, Any]] = None
    stats: Dict[str, Any] = {}

class WalletProfileResponse(BaseModel):
    address: str
    chain: str
    first_seen: Optional[datetime] = None
    last_seen: Optional[datetime] = None
    tx_count: int
    balance_native: float
    balance_usd: float
    entity_type: str
    risk_score: int
    risk_category: str
    labels: List[str]
    cluster_id: Optional[str] = None
    risk_factors: List[Dict[str, Any]] = []
    recent_txs: List[Dict[str, Any]] = []

# --- Case Schemas ---
class CaseCreate(BaseModel):
    case_no: str
    source: str = "NCRP"
    fraud_type: str
    victim_loss_inr: float
    priority: str = "HIGH"
    victim_name: Optional[str] = None
    victim_state: Optional[str] = None
    victim_city: Optional[str] = None
    reported_address: Optional[str] = None
    chain: Optional[str] = None

class CaseResponse(BaseModel):
    id: str
    case_no: str
    source: str
    complaint_ref: Optional[str] = None
    fraud_type: str
    victim_loss_inr: float
    status: str
    priority: str
    assigned_to: Optional[str] = None
    agency_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    victims: List[Dict[str, Any]] = []
    reported_wallets: List[Dict[str, Any]] = []
    trace_jobs: List[Dict[str, Any]] = []

# --- VASP & Freeze Requests ---
class VASPResponse(BaseModel):
    id: str
    name: str
    type: str
    country: str
    jurisdiction: str
    compliance_email: str
    nodal_officer_contact: Optional[str] = None
    india_registered: bool
    freeze_response_sla_hours: int
    supported_chains: List[str]
    logo_url: Optional[str] = None
    address_count: int = 0

class FreezeRequestCreate(BaseModel):
    case_id: str
    vasp_id: str
    addresses: List[str]
    amount_usd: float
    legal_provision: str = "Section 106 BNSS / Section 94 CrPC"
    notes: Optional[str] = None

class FreezeRequestUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    draft_content: Optional[str] = None

# --- Alerts & Watchlist ---
class AlertResponse(BaseModel):
    id: str
    case_id: Optional[str] = None
    job_id: Optional[str] = None
    severity: str
    title: str
    body: str
    status: str
    created_at: datetime

class WatchlistCreate(BaseModel):
    address: str
    chain: str
    reason: str

# --- Reports ---
class ReportGenerateRequest(BaseModel):
    case_id: str
    type: str = "LEA_FULL"  # LEA_FULL, VASP_FREEZE_NOTICE
    job_id: Optional[str] = None
    notes: Optional[str] = None
