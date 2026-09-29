from typing import Dict, Any, List

def calculate_wallet_risk(
    entity_type: str,
    labels: List[str],
    tx_count: int,
    balance_usd: float,
    findings: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Computes a hybrid 0-100 risk score and explainable contributing factors.
    """
    base_score = 15
    factors = []

    # 1. Entity type weights
    if entity_type == "MIXER":
        base_score += 75
        factors.append({
            "factor": "Sanctioned Mixer / Privacy Pool",
            "weight": "+75",
            "impact": "CRITICAL",
            "detail": "Direct contact with non-compliant privacy coin/mixer contract"
        })
    elif entity_type == "BURNER":
        base_score += 45
        factors.append({
            "factor": "Burner Mule Account Profile",
            "weight": "+45",
            "impact": "HIGH",
            "detail": "Short lifecycle, 99%+ outflow ratio, zero persistent balance"
        })
    elif entity_type == "INTERMEDIARY":
        base_score += 30
        factors.append({
            "factor": "Layering Intermediary Mule",
            "weight": "+30",
            "impact": "MEDIUM",
            "detail": "Serves solely as conduit node in layering hops"
        })
    elif entity_type == "EXCHANGE":
        # Exchanges are generally low risk custodians unless rogue
        base_score = min(base_score, 15)
        factors.append({
            "factor": "Regulated Custodian VASP",
            "weight": "-20",
            "impact": "LOW",
            "detail": "Custodial exchange with KYC/FIU compliance obligations"
        })

    # 2. Findings weights
    for f in findings:
        title = f.get("title", "")
        if "Fan-Out" in title:
            base_score += 15
            factors.append({
                "factor": "Fan-Out Structuring",
                "weight": "+15",
                "impact": "HIGH",
                "detail": "Rapid dispersal into multiple sub-wallets to evade AML thresholds"
            })
        elif "Fan-In" in title or "Consolidation" in title:
            base_score += 15
            factors.append({
                "factor": "Syndicate Consolidation Node",
                "weight": "+15",
                "impact": "HIGH",
                "detail": "Pooling multiple victim or mule inflows prior to offramping"
            })
        elif "Peel Chain" in title:
            base_score += 12
            factors.append({
                "factor": "Peel Chain Obfuscation",
                "weight": "+12",
                "impact": "MEDIUM",
                "detail": "Heuristic peel chain pattern typical of professional launderers"
            })
        elif "Bridge" in title:
            base_score += 18
            factors.append({
                "factor": "Cross-Chain Bridge Hopping",
                "weight": "+18",
                "impact": "HIGH",
                "detail": "Inter-ledger hopping to sever single-chain trace audit trails"
            })

    # Clamp 0 - 100
    final_score = min(100, max(5, base_score))

    if final_score >= 85:
        category = "CRITICAL"
        color = "#EF4444"
    elif final_score >= 65:
        category = "HIGH"
        color = "#F97316"
    elif final_score >= 35:
        category = "MEDIUM"
        color = "#F59E0B"
    else:
        category = "LOW"
        color = "#10B981"

    return {
        "risk_score": final_score,
        "risk_category": category,
        "color": color,
        "factors": factors
    }
