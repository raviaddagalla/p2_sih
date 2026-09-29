from typing import Dict, Any, List, Optional

def generate_investigator_recommendations(
    attribution: Optional[Dict[str, Any]],
    findings: List[Dict[str, Any]],
    root_address: str,
    chain: str
) -> List[Dict[str, Any]]:
    """
    Produces automated standard operating procedure (SOP) next steps for LEA officers.
    """
    recs = []

    if attribution:
        vasp_name = attribution["vasp_name"]
        deposit_addr = attribution["deposit_address"]
        amount = attribution["amount_usd"]
        email = attribution["compliance_email"]
        sla = attribution.get("freeze_sla_hours", 24)

        recs.append({
            "step": 1,
            "action": f"Issue Formal Freeze Notice to {vasp_name}",
            "priority": "IMMEDIATE (P0)",
            "details": f"Dispatch Section 106 BNSS / Section 94 CrPC emergency freeze notice to {email} for address {deposit_addr} (estimated balance: ${amount:,.2f}). Expected SLA: {sla}h.",
            "is_actionable": True,
            "action_type": "CREATE_FREEZE_REQUEST"
        })

        recs.append({
            "step": 2,
            "action": f"Requisition KYC & Linked Fiat Accounts from {vasp_name}",
            "priority": "HIGH (P1)",
            "details": f"Order VASP compliance team to furnish complete KYC profile, registered mobile, email, linked Indian bank/UPI details, and recent IP login access logs.",
            "is_actionable": False,
            "action_type": "LEGAL_SUBPOENA"
        })

    # Mixer checks
    mixer_findings = [f for f in findings if f.get("type") == "MIXER"]
    if mixer_findings:
        recs.append({
            "step": len(recs) + 1,
            "action": "Escalate Mixer Exit Correlation to I4C Forensic Cell",
            "priority": "CRITICAL (P0)",
            "details": "Sanctioned privacy mixer touch confirmed. Engage high-confidence temporal and gas-price correlation to identify secondary offramps.",
            "is_actionable": False,
            "action_type": "I4C_ESCALATION"
        })

    # Watchlist recommendation
    recs.append({
        "step": len(recs) + 1,
        "action": "Place Suspect Addresses on Active Watchlist",
        "priority": "MEDIUM (P2)",
        "details": f"Add {root_address[:10]}... and all identified intermediary mule nodes to the 24/7 mempool alerting monitor.",
        "is_actionable": True,
        "action_type": "ADD_WATCHLIST"
    })

    # Law Enforcement Bulletin
    recs.append({
        "step": len(recs) + 1,
        "action": "File Inter-Agency Alert on NCRP / SAHYOG",
        "priority": "MEDIUM (P2)",
        "details": "Broadcast syndication hashes to all State Cyber Crime Cells to correlate concurrent FIRs across India.",
        "is_actionable": False,
        "action_type": "AGENCY_BROADCAST"
    })

    return recs
