# ChainShield — YouTube Showcase Recording Script
### Duration: ~3 to 4 Minutes | Target Resolution: 1920x1080 (Full HD, 60fps)

---

## Pre-Recording Checklist
- [x] Backend running on `http://127.0.0.1:8000` (FastAPI operational)
- [x] Frontend running on `http://localhost:3000` (Next.js 14 App Router)
- [x] Browser window maximized to full 1920x1080
- [x] Demo Director shortcut ready (`Ctrl+Shift+D`)

---

## 🎬 Scene 1: Bright Intelligence Officer Login (0:00 – 0:35)
**Visual:**
- Open `http://localhost:3000`
- The screen shows a stunning 60/40 split screen:
  - Left (60%): Vivid gradient mesh panel (indigo→violet→pink) with a light drifting network graph (white nodes, soft edges), floating stat cards ("94.2% attribution confidence", "< 8s to VASP", "₹122.9 Cr recovered"), headline "From victim complaint to exchange freeze request in seconds."
  - Right (40%): Crisp white login card, official LEA badge, quick demo officer selection chips.

**Voiceover / Action:**
1. *"Welcome to ChainShield — the real-time crypto fraud attribution and asset recovery platform purpose-built for Indian Law Enforcement Agencies, State Cyber Cells, and the Indian Cybercrime Coordination Centre (I4C)."*
2. Point out the vivid stats on the left and the clean, high-contrast light design language ("Bright Intelligence") built for daytime courtroom clarity.
3. Click the demo account chip **`IO Rajan Sharma (MH Cyber Crime Cell)`** to auto-populate credentials.
4. Click **Continue to OTP Verification** → Smooth transition to the 6-digit cryptographic security code boxes.
5. Code `582941` is pre-entered. Click **Authorize Terminal Session** to enter the Command Center.

---

## 🎬 Scene 2: Command Center Dashboard (0:35 – 1:20)
**Visual:**
- Land on `/dashboard`. The KPI cards count up:
  - **Active Cases: 250**
  - **Wallets Traced Today: 34**
  - **VASPs Attributed: 12**
  - **Funds Flagged: ₹ 318.4 Cr**
  - **Freeze Requisitions: 98**
  - **Avg Attribution Time: 6.4s**

**Voiceover / Action:**
1. *"Here in the Command Center, investigating officers get an immediate, real-time pulse of cryptocurrency crime across the country."*
2. Hover over the **India LEA State Distribution Heatmap**. Click **Maharashtra (78 Cases, ₹98.2 Cr)**, **Karnataka (54 Cases)**, and **Telangana (41 Cases)**.
3. Show the **Crime Typology Distribution** chart highlighting Telegram task scams as the #1 threat vector in India.
4. Glance at the **Top Recipient Exchanges** chart showing Binance, Bybit, and CoinDCX receiving direct fraud deposits.

---

## 🎬 Scene 3: Complaint Ingestion & Demo Trigger (1:20 – 1:50)
**Visual:**
- Click the glowing gradient button in the top banner: **"Simulate Incoming NCRP Complaint"** (or press `Ctrl+Shift+D` → **1-Click Headline Demo**).

**Voiceover / Action:**
1. *"Let’s simulate an emergency incoming complaint from the National Cyber Crime Reporting Portal (NCRP). A victim in Pune, Maharashtra was duped of ₹42,50,000 in a Telegram task-based investment scam."*
2. A critical red alert immediately slides into the right-hand feed:
   *`New NCRP Inflow Alert: ₹42.5 L Task Fraud — Suspect TRON wallet TJb1xV9u...`*
3. The platform automatically detects the TRON network, validates the address, and launches the live graph trace!

---

## 🎬 Scene 4: The Hero Screen — Live Trace Workspace (1:50 – 2:55)
**Visual:**
- Land on `/trace/[jobId]`. The Cytoscape.js interactive graph canvas springs to life:
  - **Hop 0:** Pulsing electric-cyan Root Mule wallet (`TJb1xV9u...`).
  - **Hop 1:** Rapid fan-out splitting $51,200 USDT across 3 intermediary mule addresses in under 4 minutes.
  - **Hop 2:** Layering hops.
  - **Hop 3:** Syndicate consolidation hub (`TM3kP...`).
  - **Hop 4:** Direct deposit into **Binance Deposit Address** (`TZ8nC1m8...`), swept into the Binance Hot Wallet!

**Voiceover / Action:**
1. *"Watch the graph build itself in real time. ChainShield’s best-first algorithm follows the highest-value outflows, bypassing intermediary layering mules in seconds."*
2. *"On the left panel, the forensic pipeline tracks every stage: Ingestion → Chain Detection → Clustering → VASP Attribution in 6.2 seconds."*
3. Click the **"Follow The Money"** button:
   - An electric cyan glowing animated path traces directly from the victim root to the Binance deposit account.
4. Click the green **Binance Node**:
   - The right-hand **Node Inspector** opens showing balance ($48,210 USDT), Risk Attribution Dial, and FIU-IND compliance metadata.
5. The celebratory **Attribution Banner** displays at the top:
   *`EXCHANGE IDENTIFIED: BINANCE · HOP 4 · $48,210 USDT · 94% CONFIDENCE`*

---

## 🎬 Scene 5: Section 106 BNSS Freeze Notice & Court PDF (2:55 – 3:35)
**Visual:**
- Click **"Issue Section 106 Freeze Notice"** in the banner.

**Voiceover / Action:**
1. *"Under the new criminal law reforms in India, speed is everything. We click 'Issue Section 106 Freeze Notice'."*
2. The **Emergency Freeze Requisition Modal** appears, populated with:
   - Recipient: Binance Compliance & South Asia Nodal Desk
   - Statutory Basis: Section 106 Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 / Section 94 CrPC
   - Tainted Amount: $48,210.00 USDT
   - Formal police requisition notice with digital officer sign-off.
3. Click **"Dispatch Freeze Notice"**:
   - Instant confirmation with animated badge: *"Notice Dispatched to Binance Nodal Desk (SLA 24h)"*.
4. Click **"Court PDF Report"**:
   - Downloads the formal, courtroom-ready forensic intelligence dossier with case particulars, transaction evidence tables, and investigator signature block.

---

## 🎬 Scene 6: Analytics & Recovery Funnel Wrap-Up (3:35 – 4:00)
**Visual:**
- Navigate to `/analytics`. Show the **Asset Recovery Funnel**.

**Voiceover / Action:**
1. *"In our analytics suite, LEA supervisors can inspect the asset recovery funnel — from ₹318 Crore reported to over ₹109 Crore successfully secured across Indian cyber cells."*
2. *"ChainShield bridges the critical gap between victim reporting and exchange action. From complaint to freeze in seconds."*
3. End on the clean, cinematic Command Center overview.
