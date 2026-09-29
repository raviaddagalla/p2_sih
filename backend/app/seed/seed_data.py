import asyncio
import random
from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from app.core.database import AsyncSessionLocal, init_db
from app.core.security import get_password_hash
from app.models.models import (
    User, Agency, Case, Victim, ReportedWallet, Wallet, Transaction,
    Cluster, VASP, VASPAddress, TraceJob, TraceEdge, Finding, Alert,
    FreezeRequest, AuditLog, Watchlist, IntegrationEvent
)
from app.chains.simulated import SHOWCASE_SCENARIOS

INDIAN_STATES = [
    ("Maharashtra", "Mumbai"), ("Karnataka", "Bengaluru"), ("Telangana", "Hyderabad"),
    ("Delhi", "New Delhi"), ("Tamil Nadu", "Chennai"), ("Gujarat", "Ahmedabad"),
    ("Uttar Pradesh", "Lucknow"), ("Haryana", "Gurugram"), ("West Bengal", "Kolkata"),
    ("Rajasthan", "Jaipur"), ("Kerala", "Kochi"), ("Punjab", "Chandigarh"),
    ("Madhya Pradesh", "Indore"), ("Bihar", "Patna"), ("Odisha", "Bhubaneswar")
]

FRAUD_TYPES = ["TASK_SCAM", "INVESTMENT", "PHISHING", "RANSOMWARE", "SEXTORTION"]

FIRST_NAMES = ["Rajesh", "Amit", "Pooja", "Vikram", "Sunita", "Deepak", "Neha", "Rahul", "Ananya", "Rohan", "Sanjay", "Kavita", "Aditya", "Meera", "Manoj"]
LAST_INITIALS = ["S.", "K.", "P.", "M.", "G.", "R.", "B.", "V.", "T.", "J."]

VASPS_DATA = [
    {
        "id": "vasp-binance-001",
        "name": "Binance",
        "type": "Global Centralized Exchange",
        "country": "Global",
        "jurisdiction": "Global / FIU-IND",
        "compliance_email": "law-enforcement@binance.com",
        "nodal_officer_contact": "Ashwin Sharma (Nodal Officer - South Asia)",
        "india_registered": True,
        "freeze_response_sla_hours": 24,
        "supported_chains": ["TRON", "ETH", "BTC", "BSC", "SOL"],
        "logo_url": "/logos/binance.png"
    },
    {
        "id": "vasp-coindcx-002",
        "name": "CoinDCX",
        "type": "Indian FIU-IND Registered VASP",
        "country": "India (Mumbai)",
        "jurisdiction": "India",
        "compliance_email": "compliance-lea@coindcx.com",
        "nodal_officer_contact": "Vivek Gupta (VP Legal & Law Enforcement Liaison)",
        "india_registered": True,
        "freeze_response_sla_hours": 12,
        "supported_chains": ["BTC", "ETH", "TRON", "POLYGON"],
        "logo_url": "/logos/coindcx.png"
    },
    {
        "id": "vasp-wazirx-003",
        "name": "WazirX",
        "type": "Indian Exchange (Zanmai Labs)",
        "country": "India (Mumbai)",
        "jurisdiction": "India",
        "compliance_email": "nodal@wazirx.com",
        "nodal_officer_contact": "Kavita Rao (Senior Legal Counsel)",
        "india_registered": True,
        "freeze_response_sla_hours": 18,
        "supported_chains": ["BTC", "ETH", "TRON"],
        "logo_url": "/logos/wazirx.png"
    },
    {
        "id": "vasp-zebpay-004",
        "name": "ZebPay",
        "type": "Indian FIU-IND Registered VASP",
        "country": "India (Ahmedabad)",
        "jurisdiction": "India",
        "compliance_email": "legal@zebpay.com",
        "nodal_officer_contact": "Pooja Mehta (Compliance Officer)",
        "india_registered": True,
        "freeze_response_sla_hours": 24,
        "supported_chains": ["BTC", "ETH", "TRON", "POLYGON"],
        "logo_url": "/logos/zebpay.png"
    },
    {
        "id": "vasp-bybit-005",
        "name": "Bybit",
        "type": "International Exchange",
        "country": "UAE / Dubai",
        "jurisdiction": "International",
        "compliance_email": "compliance@bybit.com",
        "nodal_officer_contact": "Daniel Lee (Global LEA Desk)",
        "india_registered": True,
        "freeze_response_sla_hours": 24,
        "supported_chains": ["TRON", "ETH", "BTC", "BSC"],
        "logo_url": "/logos/bybit.png"
    },
    {
        "id": "vasp-kucoin-006",
        "name": "KuCoin",
        "type": "Centralized Exchange",
        "country": "Seychelles",
        "jurisdiction": "Global / FIU-IND",
        "compliance_email": "support-lea@kucoin.com",
        "nodal_officer_contact": "LEA Response Desk",
        "india_registered": True,
        "freeze_response_sla_hours": 48,
        "supported_chains": ["TRON", "ETH", "BTC", "BSC"],
        "logo_url": "/logos/kucoin.png"
    },
    {
        "id": "vasp-coinswitch-007",
        "name": "CoinSwitch",
        "type": "Indian FIU-IND Registered VASP",
        "country": "India (Bengaluru)",
        "jurisdiction": "India",
        "compliance_email": "lea-compliance@coinswitch.co",
        "nodal_officer_contact": "Rohan Deshmukh (Head Compliance)",
        "india_registered": True,
        "freeze_response_sla_hours": 12,
        "supported_chains": ["BTC", "ETH", "TRON", "MATIC"],
        "logo_url": "/logos/coinswitch.png"
    },
    {
        "id": "vasp-mudrex-008",
        "name": "Mudrex",
        "type": "Indian FIU-IND Registered VASP",
        "country": "India (Bengaluru)",
        "jurisdiction": "India",
        "compliance_email": "compliance@mudrex.com",
        "nodal_officer_contact": "Ankit Agarwal",
        "india_registered": True,
        "freeze_response_sla_hours": 18,
        "supported_chains": ["BTC", "ETH", "USDT"],
        "logo_url": "/logos/mudrex.png"
    }
]

AGENCIES_DATA = [
    {"id": "agency-mh-01", "name": "Maharashtra Cyber Security Cell", "state": "Maharashtra", "type": "State Cyber Cell"},
    {"id": "agency-i4c-02", "name": "Indian Cybercrime Coordination Centre (I4C)", "state": "Delhi", "type": "National Agency (MHA)"},
    {"id": "agency-tg-03", "name": "Telangana Cyber Security Bureau (TGCSB)", "state": "Telangana", "type": "State Cyber Cell"},
    {"id": "agency-ka-04", "name": "Karnataka CID Cyber Crime Division", "state": "Karnataka", "type": "State Cyber Cell"},
    {"id": "agency-dl-05", "name": "Delhi Police IFSO (Special Cell)", "state": "Delhi", "type": "State Cyber Cell"},
    {"id": "agency-cbi-06", "name": "CBI Cyber Crime Division", "state": "Delhi", "type": "Central Investigative Agency"},
    {"id": "agency-ed-07", "name": "Enforcement Directorate (FIU Coordination)", "state": "Delhi", "type": "Financial Intelligence / Enforcement"}
]

USERS_DATA = [
    {
        "name": "IO Rajan Sharma",
        "email": "io@demo.gov.in",
        "password": "Demo@1234",
        "role": "IO",
        "agency_id": "agency-mh-01",
        "badge_no": "MH-CY-2024-8841"
    },
    {
        "name": "SP Meenakshi Sundaram",
        "email": "supervisor@demo.gov.in",
        "password": "Demo@1234",
        "role": "SUPERVISOR",
        "agency_id": "agency-mh-01",
        "badge_no": "IPS-MH-2016-092"
    },
    {
        "name": "Nodal Officer Hemant Varma",
        "email": "nodal@demo.gov.in",
        "password": "Demo@1234",
        "role": "NODAL",
        "agency_id": "agency-i4c-02",
        "badge_no": "MHA-I4C-ND-104"
    },
    {
        "name": "System Administrator",
        "email": "admin@demo.gov.in",
        "password": "Demo@1234",
        "role": "ADMIN",
        "agency_id": "agency-i4c-02",
        "badge_no": "ADMIN-001"
    },
    {
        "name": "Senior Analyst Vikram Roy",
        "email": "analyst@demo.gov.in",
        "password": "Demo@1234",
        "role": "ANALYST",
        "agency_id": "agency-tg-03",
        "badge_no": "TGCSB-AN-441"
    }
]

async def seed_database():
    print("Initializing Database Schema...")
    await init_db()

    async with AsyncSessionLocal() as session:
        # Check if already seeded
        res = await session.execute(select(User).limit(1))
        if res.scalars().first():
            print("Database already contains records. Skipping seed.")
            return

        print("Seeding Agencies...")
        for ag in AGENCIES_DATA:
            agency = Agency(id=ag["id"], name=ag["name"], state=ag["state"], type=ag["type"])
            session.add(agency)

        print("Seeding Users...")
        for u in USERS_DATA:
            user = User(
                name=u["name"],
                email=u["email"],
                password_hash=get_password_hash(u["password"]),
                role=u["role"],
                agency_id=u["agency_id"],
                badge_no=u["badge_no"],
                is_active=True,
                mfa_enabled=True,
                last_login=datetime.now(timezone.utc) - timedelta(minutes=random.randint(5, 120))
            )
            session.add(user)

        print("Seeding VASPs...")
        for v in VASPS_DATA:
            vasp = VASP(
                id=v["id"],
                name=v["name"],
                type=v["type"],
                country=v["country"],
                jurisdiction=v["jurisdiction"],
                compliance_email=v["compliance_email"],
                nodal_officer_contact=v["nodal_officer_contact"],
                india_registered=v["india_registered"],
                freeze_response_sla_hours=v["freeze_response_sla_hours"],
                supported_chains=v["supported_chains"],
                logo_url=v["logo_url"]
            )
            session.add(vasp)

        # Seed the 6 showcase scenarios as active cases
        print("Seeding Showcase Scenarios...")
        for root_addr, scen in SHOWCASE_SCENARIOS.items():
            case_no = f"2024-NCRP-MH-08492{scen['id']}"
            c = Case(
                case_no=case_no,
                source="NCRP",
                complaint_ref=f"NCRP/2024/{random.randint(100000, 999999)}",
                fraud_type=scen["fraud_type"],
                victim_loss_inr=scen["victim_loss_inr"],
                status="TRACED" if scen.get("vasp_target") else "UNDER_INVESTIGATION",
                priority="CRITICAL" if scen["fraud_type"] in ["RANSOMWARE", "TASK_SCAM"] else "HIGH",
                agency_id="agency-mh-01",
                created_at=datetime.now(timezone.utc) - timedelta(days=scen["id"], hours=3)
            )
            session.add(c)
            await session.flush()

            # Victim
            victim = Victim(
                case_id=c.id,
                masked_name=f"{scen['victim_name'].split()[0]} {scen['victim_name'].split()[1][0]}***",
                state="Maharashtra" if scen["id"] == 1 else "Karnataka",
                city="Pune" if scen["id"] == 1 else "Bengaluru",
                age_bracket="28-35",
                loss_inr=scen["victim_loss_inr"]
            )
            session.add(victim)

            # Reported Wallet
            rep_wallet = ReportedWallet(
                case_id=c.id,
                address=root_addr,
                chain=scen["chain"],
                reported_amount=scen["victim_loss_usd"],
                status="TRACED"
            )
            session.add(rep_wallet)

            # Pre-seed trace job for the showcase
            job = TraceJob(
                case_id=c.id,
                root_address=root_addr,
                chain=scen["chain"],
                depth=len(scen["nodes"]),
                status="COMPLETED",
                progress=100,
                stats_json={
                    "total_nodes": len(scen["nodes"]),
                    "total_edges": len(scen["edges"]),
                    "total_value_usd": scen["victim_loss_usd"],
                    "hops_traversed": max(n.get("hop", 0) for n in scen["nodes"]),
                    "vasp_identified": scen["vasp_target"]["name"] if scen.get("vasp_target") else "None"
                }
            )
            session.add(job)
            await session.flush()

            for edge in scen["edges"]:
                te = TraceEdge(
                    job_id=job.id,
                    from_addr=edge["from_addr"],
                    to_addr=edge["to_addr"],
                    chain=edge["chain"],
                    total_value_usd=edge["total_value_usd"],
                    tx_count=edge.get("tx_count", 1),
                    hop_no=edge.get("hop_no", 1),
                    pattern_tag=edge.get("pattern_tag")
                )
                session.add(te)

            for f in scen.get("findings", []):
                finding = Finding(
                    job_id=job.id,
                    type=f["type"],
                    severity=f["severity"],
                    title=f["title"],
                    description=f["description"],
                    evidence_json=f.get("evidence", {}),
                    confidence=f.get("confidence", 0.90)
                )
                session.add(finding)

            # Pre-seed freeze request for Scenario 1 (Headline)
            if scen["id"] == 1 and scen.get("vasp_target"):
                target = scen["vasp_target"]
                fr = FreezeRequest(
                    case_id=c.id,
                    vasp_id=target["vasp_id"],
                    addresses=[target["deposit_address"]],
                    amount_usd=target["amount_usd"],
                    status="SENT",
                    sent_at=datetime.now(timezone.utc) - timedelta(hours=4),
                    legal_provision="Section 106 Bharatiya Nagarik Suraksha Sanhita (BNSS) 2023 / Section 94 CrPC",
                    notes="Urgent freeze requisition in FIR No. 142/2024 regarding Telegram task investment fraud. Deposit sweep confirmed.",
                    draft_content=(
                        f"FORMAL POLICE FREEZE REQUISITION UNDER SECTION 106 BNSS 2023\n\n"
                        f"To: Nodal Officer / Compliance Desk, {target['name']}\n"
                        f"Subject: Immediate Freezing of Account/Wallet Address: {target['deposit_address']}\n"
                        f"Ref: FIR No. 142/2024, Maharashtra Cyber Crime Cell\n\n"
                        f"It is hereby directed that immediate debit-freeze be placed upon deposit wallet {target['deposit_address']} "
                        f"and linked internal user ID credited with ${target['amount_usd']:,.2f} USDT originating from victim funds. "
                        f"Preserve complete KYC, device logs, and bank off-ramp trails."
                    )
                )
                session.add(fr)

        # Seed 240+ realistic historical cases across 15 states for the analytics dashboards
        print("Seeding 240+ Historical Cases across 15 Indian States...")
        for i in range(1, 245):
            state, city = random.choice(INDIAN_STATES)
            fraud = random.choice(FRAUD_TYPES)
            loss_inr = round(random.uniform(75000, 25000000), -3)
            status = random.choices(["TRACED", "FROZEN", "UNDER_INVESTIGATION", "CLOSED"], weights=[0.45, 0.25, 0.20, 0.10])[0]
            days_ago = random.randint(1, 90)

            c = Case(
                case_no=f"2024-NCRP-{state[:2].upper()}-{100000 + i}",
                source=random.choice(["NCRP", "SAHYOG", "MANUAL"]),
                complaint_ref=f"NCRP/2024/{random.randint(100000, 999999)}",
                fraud_type=fraud,
                victim_loss_inr=loss_inr,
                status=status,
                priority="CRITICAL" if loss_inr > 5000000 else ("HIGH" if loss_inr > 1000000 else "MEDIUM"),
                agency_id="agency-mh-01" if state == "Maharashtra" else "agency-i4c-02",
                created_at=datetime.now(timezone.utc) - timedelta(days=days_ago, hours=random.randint(1, 23))
            )
            session.add(c)
            await session.flush()

            victim = Victim(
                case_id=c.id,
                masked_name=f"{random.choice(FIRST_NAMES)} {random.choice(LAST_INITIALS)}***",
                state=state,
                city=city,
                age_bracket=random.choice(["21-25", "26-35", "36-50", "50+"]),
                loss_inr=loss_inr
            )
            session.add(victim)

            chain = random.choice(["TRON", "TRON", "TRON", "BTC", "ETH", "BSC"])
            addr = f"T{random.randint(100000000000000000000000000000000, 999999999999999999999999999999999)}" if chain == "TRON" else f"0x{random.randint(10**39, 10**40 - 1):x}"
            rep_wallet = ReportedWallet(
                case_id=c.id,
                address=addr,
                chain=chain,
                reported_amount=round(loss_inr / 83.0, 2),
                status=status
            )
            session.add(rep_wallet)

            # Freeze requests for frozen/traced cases
            if status in ["FROZEN", "TRACED"] and random.random() < 0.6:
                vasp = random.choice(VASPS_DATA)
                fr = FreezeRequest(
                    case_id=c.id,
                    vasp_id=vasp["id"],
                    addresses=[addr],
                    amount_usd=round(loss_inr / 83.0 * random.uniform(0.7, 0.95), 2),
                    status="FROZEN" if status == "FROZEN" else random.choice(["DRAFT", "SENT", "ACKNOWLEDGED"]),
                    sent_at=c.created_at + timedelta(hours=random.randint(1, 6)),
                    legal_provision="Section 106 BNSS 2023 / Section 94 CrPC"
                )
                session.add(fr)

        # Seed Watchlist
        print("Seeding Initial Watchlist...")
        watch_addrs = [
            ("TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L", "TRON", "Syndicate Primary Burner (FIR 142/2024)", "IO Rajan Sharma"),
            ("0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b", "ETH", "Tornado Cash Pool (OFAC Listed)", "MHA I4C Nodal Desk"),
            ("bc1qa8m4p7z2x9w3y5v1u8t6s4r2q0p8o6n4m2k0j8", "BTC", "LockBit 3.0 Ransomware Intake", "CBI Cyber Division"),
            ("1BoatSLRHtKNngkdXEeobR76b53LETtpyT", "BTC", "Sextortion Campaign Collector", "IO Rajan Sharma")
        ]
        for w_addr, w_chain, w_reason, w_by in watch_addrs:
            session.add(Watchlist(address=w_addr, chain=w_chain, reason=w_reason, added_by=w_by))

        # Seed Initial Audit Log
        print("Seeding Audit Trail...")
        audit_events = [
            ("IO Rajan Sharma", "LOGIN", "AUTH", None, "User logged in with MFA verification"),
            ("IO Rajan Sharma", "TRACE_INITIATED", "TRACE", "TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L", "Initiated forward trace on TRON USDT suspect wallet"),
            ("IO Rajan Sharma", "VASP_ATTRIBUTED", "VASP", "vasp-binance-001", "Attributed deposit address to Binance at Hop 4 with 94% confidence"),
            ("IO Rajan Sharma", "FREEZE_NOTICE_DRAFTED", "FREEZE_REQUEST", None, "Drafted Section 106 BNSS freeze notice for $48,210 USDT"),
            ("SP Meenakshi Sundaram", "FREEZE_NOTICE_APPROVED", "FREEZE_REQUEST", None, "Supervisory approval granted for Binance freeze dispatch"),
            ("Nodal Officer Hemant Varma", "INTEGRATION_SYNC", "NCRP", None, "Batch ingested 14 incoming complaints from NCRP National Portal")
        ]
        for u_name, action, entity, entity_id, meta in audit_events:
            session.add(AuditLog(
                user_name=u_name,
                action=action,
                entity=entity,
                entity_id=entity_id,
                metadata_json={"details": meta},
                created_at=datetime.now(timezone.utc) - timedelta(minutes=random.randint(15, 300))
            ))

        await session.commit()
        print("Database Seed Completed Successfully!")

if __name__ == "__main__":
    asyncio.run(seed_database())
