# ChainShield — Real-Time Crypto Fraud Attribution Platform
## Master Architecture & System Design

### Executive Overview
**ChainShield** is an intelligence and attribution platform purpose-built for Indian Law Enforcement Agencies (LEAs) such as State Cyber Crime Cells, I4C, CBI, and ED. It ingests suspect crypto addresses from victim complaints (NCRP, SAHYOG, manual, or CSV), traces cross-chain transaction flows in real time, clusters entities, identifies the nearest exchange/VASP receiving deposits, detects laundering typologies, scores risk, and issues Section 106 BNSS / Section 94 CrPC freeze requests in seconds.

---

## 1. System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        COMPLAINT INGESTION LAYER                       │
│  [NCRP Webhook / API]  [SAHYOG Portal]  [Manual Entry]  [Bulk CSV]     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                         Chain Detection & Dedupe
                                    │
┌───────────────────────────────────▼────────────────────────────────────┐
│                         CORE BACKEND (FastAPI)                         │
│                                                                        │
│  ┌────────────────────────┐         ┌───────────────────────────────┐  │
│  │ Simulated Chain Engine │         │  Graph Analysis & ML Engine   │  │
│  │ - 6 Showcase Scenarios │         │  - Best-First Outflow Tracer  │  │
│  │ - BTC, ETH, TRON, BSC  │◄───────►│  - VASP Attribution Engine    │  │
│  │ - Deterministic walks  │         │  - Pattern Detectors (9 types)│  │
│  │ - Artificial hop delay │         │  - Hybrid 0-100 Risk Scorer   │  │
│  └────────────────────────┘         └──────────────┬────────────────┘  │
│                                                    │                   │
│  ┌─────────────────────────────────────────────────▼────────────────┐  │
│  │ REST APIs + Real-Time WebSocket Hub (Hop & Progress Streaming)   │  │
│  │ PDF Report Generator (ReportLab) + BNSS Freeze Notice Drafter    │  │
│  └─────────────────────────────────────────────────┬────────────────┘  │
└────────────────────────────────────────────────────┼───────────────────┘
                                                     │
                                   WebSocket + REST  │
                                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│               FRONTEND: NEXT.JS 14 (CYBER COMMAND CENTER)              │
│                                                                        │
│  - Cinematic Dark Mode (#070B14, glassmorphism, electric cyan glow)    │
│  - Cytoscape.js Real-Time Interactive Canvas with Particles & Paths   │
│  - Pipeline Stepper & Live Finding Alerts Stream                       │
│  - Node Inspector, Sankey Flow, & Cross-Chain Journey Strip            │
│  - Freeze Request Kanban with Section 106 BNSS Editable Notice         │
│  - India LEA Dashboard with State Heatmap (SVG) & ₹ Lakh/Cr Formatting │
│  - Demo Mode Controller (Ctrl+Shift+D) & 1-Click Guided Storyline      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Technical Stack Breakdown

| Layer | Technologies Selected | Justification |
|---|---|---|
| **Frontend Framework** | Next.js 14+ (App Router) + TypeScript | Modern SSR/SPA, strict typing, high reliability |
| **Styling & Design** | Tailwind CSS + Radix UI + Custom Glassmorphism | Custom cyber-intelligence palette, no generic UI |
| **Graph Visualization** | Cytoscape.js + Dagre/fcose layout | Handles 500+ nodes smoothly, rich styling, edge particles |
| **Motion & Charts** | Framer Motion, Recharts, Lucide Icons | Fluid count-ups, staggered reveals, high-density charts |
| **Client State** | TanStack Query + Zustand | Persistent filters, live WebSocket cache management |
| **Backend Engine** | Python 3.11/3.13 + FastAPI (Async) | Async performance, native WebSocket support, Pydantic v2 |
| **Database** | SQLite3 (Async via aiosqlite, default) + PostgreSQL ready | Zero-friction local run with Docker-ready Postgres schema |
| **Graph & ML** | NetworkX, Scikit-Learn | Graph traversal, clustering, explainable risk scoring |
| **Document Export** | ReportLab + openpyxl | Formal police PDF reports & XLSX exports |

---

## 3. Database Schema Blueprint

1. **`users`**: UUID, email, name, password_hash, role (`IO`, `ANALYST`, `NODAL`, `SUPERVISOR`, `ADMIN`, `AUDITOR`), agency_id, badge_no, is_active, mfa_secret, last_login.
2. **`agencies`**: UUID, name (e.g. *Maharashtra Cyber Cell*, *I4C New Delhi*, *Telangana Cyber Security Bureau*), state, type.
3. **`cases`**: UUID, case_no (`2024-NCRP-MH-084920`), source (`NCRP`/`SAHYOG`/`MANUAL`), complaint_ref, fraud_type (`TASK_SCAM`, `INVESTMENT`, `SEXTORTION`, `RANSOMWARE`, `PHISHING`), victim_loss_inr, status (`NEW`, `UNDER_INVESTIGATION`, `TRACED`, `FROZEN`, `CLOSED`), priority (`CRITICAL`, `HIGH`, `MEDIUM`), assigned_to, created_at.
4. **`victims`**: UUID, case_id, masked_name (`R*****h S.`), state, city, age_bracket, loss_inr.
5. **`reported_wallets`**: UUID, case_id, address, chain (`TRON`, `BTC`, `ETH`, `BSC`, `POLYGON`), reported_amount, reported_at, status.
6. **`wallets`**: address (PK), chain, first_seen, last_seen, tx_count, balance_native, balance_usd, cluster_id, entity_type (`EXCHANGE`, `MIXER`, `BRIDGE`, `DEFI`, `BURNER`, `INTERMEDIARY`, `UNKNOWN`), risk_score, risk_category, labels.
7. **`transactions`**: hash (PK), chain, block, timestamp, from_addr, to_addr, value_native, value_usd, token, fee, method, is_bridge, is_mixer_touch.
8. **`clusters`**: UUID, chain, heuristic, size, label, vasp_id, confidence.
9. **`vasps`**: UUID, name (*Binance*, *WazirX*, *CoinDCX*, *ZebPay*, *Bybit*, *KuCoin*, *OKX*), type, country, jurisdiction, compliance_email, nodal_officer_contact, india_registered (FIU-IND), freeze_response_sla_hours, supported_chains, logo_url.
10. **`vasp_addresses`**: address (PK), chain, vasp_id, wallet_role (`HOT`, `COLD`, `DEPOSIT`), confidence, source.
11. **`trace_jobs`**: UUID, case_id, root_address, chain, depth, status (`RUNNING`, `COMPLETED`, `FAILED`), progress, started_at, finished_at, stats_json.
12. **`trace_edges`**: UUID, job_id, from_addr, to_addr, chain, total_value_usd, tx_count, hop_no, pattern_tag.
13. **`findings`**: UUID, job_id, type (`VASP_HIT`, `PATTERN`, `MIXER`, `BRIDGE`), severity, title, description, evidence_json, confidence.
14. **`alerts`**: UUID, case_id, job_id, severity, title, body, status (`NEW`, `ACK`, `ACTIONED`), created_at.
15. **`freeze_requests`**: UUID, case_id, vasp_id, addresses, amount_usd, status (`DRAFT`, `SENT`, `ACKNOWLEDGED`, `FROZEN`, `REJECTED`), sent_at, response_at, legal_provision, notes.
16. **`reports`**: UUID, case_id, type (`LEA_FULL`, `VASP_FREEZE_NOTICE`, `STIX_EXPORT`), file_path, generated_by, created_at.
17. **`audit_logs`**: UUID, user_id, action, entity, entity_id, ip, metadata_json, created_at.
18. **`watchlist`**: address (PK), chain, reason, added_by, created_at.

---

## 4. The 6 Hand-Crafted Showcase Scenarios

1. **Scenario 1 — Task-Scam USDT-TRC20 → Exchange (Headline Demo):**
   - Address: `TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L` (TRON)
   - Story: Victim duped in Telegram "like YouTube videos for money" task fraud (₹42,50,000 / $51,200 USDT).
   - Topology: Root -> 3 Intermediary mule wallets (Hop 1) -> Structuring (Hop 2) -> Consolidation (Hop 3) -> Direct deposit into Binance Hot Deposit address (Hop 4).
   - Target: Identified at Hop 4 in 6s with 94% confidence. Immediate Section 106 BNSS notice generated.
2. **Scenario 2 — Investment Scam BTC Peel Chain:**
   - Address: `bc1q9v0k4x7p2m8s3t5w6u8y1z2a3b4c5d6e7f8g9`
   - Story: High-yield crypto trading club scam (₹1.8 Crore).
   - Topology: Classical Bitcoin peel chain splitting into CoinDCX & ZebPay deposit addresses across 6 hops.
3. **Scenario 3 — Cross-Chain Launder:**
   - Address: `0x71C67E7e9a8f219E2B3a7d4A54F3B8C1D9e0A48F` (ETH)
   - Story: DeFi phishing scam; funds swapped ETH -> Stargate Bridge -> BNB Chain -> PancakeSwap -> TRON Bridge -> Bybit.
4. **Scenario 4 — Mixer Exposure:**
   - Address: `0x3a4F91d8A3b7C2E4F5D6B7890123456789aBcDeF`
   - Story: Ransomware payout routed through Tornado Cash. System detects mixer contract, halts direct graph expansion, and computes temporal correlation exit candidates.
5. **Scenario 5 — Sextortion Small-Ticket Cluster:**
   - Address: `1BoatSLRHtKNngkdXEeobR76b53LETtpyT` (BTC)
   - Story: 45 victim payments pooled into unhosted Trezor cold storage. Recommends LEA surveillance and ISP subpoena.
6. **Scenario 6 — Ransomware BTC Critical Threat:**
   - Address: `bc1qa8m4p7z2x9w3y5v1u8t6s4r2q0p8o6n4m2k0j8`
   - Story: Hospital extorted for 8.5 BTC. Darknet Hydra marketplace proximity flagged, 98/100 risk score with pulsing alert.

---

## 5. Phased Build Roadmap

- **Phase 1: Project Scaffolding & Core Architecture**
  - Setup directory structure, Python virtual environment & dependencies, Next.js frontend with Tailwind and TypeScript.
  - Setup SQLite async database with complete schema and connection pooling.
- **Phase 2: Backend Engines & Data Simulation**
  - Chain adapter interface with regex auto-detection for BTC, ETH/EVM, TRON, BSC, Polygon, Solana.
  - Implement `SimulatedChainProvider` with deterministic generation and the 6 showcase scenarios.
  - Implement Analysis Engine: Best-first BFS tracer, VASP attribution, cluster detection, 9 pattern heuristics, hybrid 0-100 risk scoring, typology classifier, and recommendation generator.
  - Comprehensive seed script generating ~250 historical Indian cases, 15 states, 12 VASPs, audit trails, and watchlist.
- **Phase 3: REST & WebSocket APIs**
  - JWT Authentication with RBAC, simulated MFA/OTP (`123456`), audit logging middleware.
  - Cases, Ingest (single + bulk CSV + NCRP/SAHYOG webhooks), Trace job creation, and live WebSocket streaming (`/ws/trace/{job_id}`).
  - ReportLab PDF generator for official LEA investigation reports and Section 106 BNSS notices.
- **Phase 4: Design System & Core Shell**
  - Cyber-intelligence command center theme: `#070B14`, electric cyan (`#22D3EE`), emerald (`#10B981`), amber, red, glassmorphism panels.
  - Topbar with live system status, agency badge, notification center, quick command palette (`Ctrl+K`).
  - Navigation sidebar with active state indicators.
- **Phase 5: The Hero Trace Workspace (`/trace/[jobId]`)**
  - Real-time Cytoscape.js graph canvas with animated edge particles, zoom/pan/minimap, and layout switcher.
  - Left panel: Live pipeline stepper (Ingested → Chain detected → Tracing hops → Clustering → VASP attribution → Risk scoring → Ready) + findings stream with confidence meters.
  - Right panel: Interactive entity inspector with risk dial, cluster stats, timeline, and actions.
  - Attribution celebration banner with 1-click [Generate Freeze Request] and [Follow The Money] path highlight.
  - Sankey fund-flow toggle & cross-chain journey strip.
- **Phase 6: Supporting Pages & Workflows**
  - Cinematic Login page with animated network background & quick demo credentials.
  - Command Center Dashboard with live alert rail, India LEA state heatmap (SVG), typology donut, and simulated NCRP trigger button.
  - Ingestion Hub (`/ingest`) with auto chain detection badge and CSV drag-and-drop.
  - Cases & Case Detail (`/cases/[id]`) with multi-trace correlation.
  - Freeze Request Center (`/freeze-requests`) Kanban with rich-text BNSS notice editor.
  - VASP Directory (`/vasps`), Alerts (`/alerts`), Analytics (`/analytics`), Reports (`/reports`), and Admin (`/admin`).
- **Phase 7: Demo Recording Aids, Testing & Polish**
  - "Demo Mode" panel (`Ctrl+Shift+D`): speed controls, 1-click headline scenario runner, guided tour overlay.
  - Automated smoke tests & browser visual verification at 1920x1080.
  - Documentation: `README.md`, `DEMO_SCRIPT.md`, and `ARCHITECTURE.md`.
