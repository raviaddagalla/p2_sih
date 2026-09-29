# ChainShield — Real-Time Crypto Fraud Attribution Platform
### *"From victim complaint to exchange freeze request in seconds."*

ChainShield is an advanced cryptocurrency intelligence, forensic attribution, and asset preservation platform purpose-built for Indian Law Enforcement Agencies (LEAs), including State Cyber Crime Cells, the Indian Cybercrime Coordination Centre (I4C), CBI, and the Enforcement Directorate (ED).

---

## 🚀 Key Capabilities

1. **Automated Blockchain Ingestion:**
   - Multi-rail address format auto-detection (**TRON USDT-TRC20**, **Bitcoin Bech32/Legacy**, **Ethereum / EVM**, **BNB Chain**, **Solana**).
   - Ingestion from National Cyber Crime Reporting Portal (**NCRP**) and **SAHYOG** webhooks, plus manual single/bulk CSV import.
2. **Real-Time Graph Tracing:**
   - Best-first forward traversal with Cytoscape.js interactive canvas, edge value scaling, and live WebSocket hop streaming.
   - **"Follow The Money"** path highlight animating the flow from victim intake to exchange offramp.
3. **Nearest VASP Direct Deposit Attribution:**
   - Rapid identification of FIU-IND registered custodial exchanges (Binance, CoinDCX, WazirX, ZebPay, Bybit, KuCoin).
   - Deposit sweep heuristics correlating burner deposit wallets with exchange hot wallets.
4. **Automated Statutory Freeze Requisitions:**
   - 1-click legal requisition generation under **Section 106 Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023** / Section 94 CrPC.
   - Full Kanban workflow (**Draft → Sent → Acknowledged → Frozen**).
5. **Courtroom-Ready PDF Intelligence Reports:**
   - High-fidelity formal LEA PDF reports generated with ReportLab including case particulars, AML typology tags, and digital signatures.
6. **LEA Command Analytics:**
   - Indian state geographic heatmap (15 states), crime typologies breakdown, VASP risk matrix, and asset recovery funnel.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript (Strict), Tailwind CSS, Cytoscape.js + Dagre, Framer Motion, Recharts, Lucide Icons, Zustand, Radix Primitives.
- **Backend:** Python 3.11/3.13, FastAPI (Async), SQLAlchemy 2.0, aiosqlite / PostgreSQL, ReportLab, Scikit-Learn, NetworkX, Uvicorn.
- **Design System:** Cyber-intelligence command center theme (`#070B14`, electric cyan `#22D3EE`, emerald `#10B981`, glassmorphism blur).

---

## ⚡ Quickstart & Local Setup

### Prerequisites
- Node.js 18+ (tested on v26)
- Python 3.11+ (tested on v3.13)

### 1. Clone & Setup Backend
```bash
cd backend
python -m venv venv

# Windows:
./venv/Scripts/pip install -r requirements.txt greenlet

# Populate ~250 historical Indian cases and showcase scenarios:
./venv/Scripts/python -m app.seed.seed_data

# Start FastAPI Backend (Port 8000):
./venv/Scripts/python -m uvicorn app.main:app --port 8000
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

### 2. Setup & Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🔑 Demo Accounts & Credentials

Shown directly on the cinematic login screen:
- **Investigating Officer (IO):** `io@demo.gov.in` / `Demo@1234`
- **Supervisor (SP):** `supervisor@demo.gov.in` / `Demo@1234`
- **I4C Nodal Officer:** `nodal@demo.gov.in` / `Demo@1234`
- **System Administrator:** `admin@demo.gov.in` / `Demo@1234`

*MFA OTP Screen: Enter **`123456`** to verify.*

---

## 🎥 YouTube Showcase Demo Director

Press **`Ctrl + Shift + D`** anywhere in the app to toggle the **Demo Director Panel**:
- **1-Click Headline Showcase:** Automates the complete flow from login to simulated NCRP complaint to live graph tracing and Section 106 freeze requisition!
- **Speed Controls:** Adjust tracing pace (`0.5x`, `1.0x`, `2.0x`).
- **Interactive Tour:** Step-by-step guidance for viewers.

---

## 🧪 Testing

Run automated unit and integration tests:
```bash
cd backend
./venv/Scripts/python -m pytest
```
*7 passed in 2.27s (100% success rate)*

---

## 🛡️ Statutory Compliance & Disclaimer
All wallet addresses, victim identities, and complaint numbers in demo mode are deterministically simulated for training and demonstration purposes. No real personal data is stored or processed.
