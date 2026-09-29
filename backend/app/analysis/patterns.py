from typing import Dict, Any, List

def detect_patterns_in_subgraph(nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Evaluates graph structure and flows to detect AML / laundering typologies.
    Returns list of findings with evidence and confidence scores.
    """
    findings = []
    
    # 1. Fan-out detection (1 node sending to >=3 nodes in same hop)
    out_degree_map: Dict[str, List[Dict[str, Any]]] = {}
    in_degree_map: Dict[str, List[Dict[str, Any]]] = {}

    for e in edges:
        u, v = e["from_addr"], e["to_addr"]
        out_degree_map.setdefault(u, []).append(e)
        in_degree_map.setdefault(v, []).append(e)

    for addr, out_edges in out_degree_map.items():
        if len(out_edges) >= 3:
            total_val = sum(x["total_value_usd"] for x in out_edges)
            findings.append({
                "type": "PATTERN",
                "severity": "HIGH",
                "title": f"Fan-Out Splitting Pattern ({len(out_edges)} Outflows)",
                "description": f"Address {addr[:8]}...{addr[-6:]} rapidly split ${total_val:,.2f} across {len(out_edges)} recipient mule addresses to evade per-transaction thresholds.",
                "evidence_json": {
                    "source_address": addr,
                    "split_count": len(out_edges),
                    "total_usd": total_val
                },
                "confidence": 0.92
            })

    # 2. Fan-in consolidation detection (>=2 nodes feeding into 1 central node)
    for addr, in_edges in in_degree_map.items():
        if len(in_edges) >= 2:
            total_val = sum(x["total_value_usd"] for x in in_edges)
            findings.append({
                "type": "PATTERN",
                "severity": "HIGH",
                "title": f"Consolidation / Fan-In Hub ({len(in_edges)} Inflows)",
                "description": f"Address {addr[:8]}...{addr[-6:]} consolidated ${total_val:,.2f} from {len(in_edges)} separate intermediary addresses prior to exchange deposit.",
                "evidence_json": {
                    "collector_address": addr,
                    "inflow_count": len(in_edges),
                    "total_usd": total_val
                },
                "confidence": 0.90
            })

    # 3. Peel Chain Detection
    peel_edges = [e for e in edges if e.get("pattern_tag") == "PEEL_CHAIN"]
    if len(peel_edges) >= 2:
        findings.append({
            "type": "PATTERN",
            "severity": "HIGH",
            "title": f"UTXO Peel Chain Detected ({len(peel_edges)} Sequential Peels)",
            "description": "Sequential transactions peel small fractional amounts while continuing the majority balance forward.",
            "evidence_json": {"peel_steps": len(peel_edges)},
            "confidence": 0.95
        })

    # 4. Cross-Chain Bridge Detection
    bridge_edges = [e for e in edges if "BRIDGE" in str(e.get("pattern_tag", "")).upper()]
    if bridge_edges:
        findings.append({
            "type": "BRIDGE",
            "severity": "HIGH",
            "title": "Cross-Chain Liquidity Bridge Hop",
            "description": "Transactions cross blockchain boundaries via decentralized bridge router to interrupt single-ledger tracking.",
            "evidence_json": {"bridge_hops": len(bridge_edges)},
            "confidence": 0.94
        })

    # 5. Mixer Touch Detection
    mixer_nodes = [n for n in nodes if n.get("entity_type") == "MIXER"]
    if mixer_nodes:
        findings.append({
            "type": "MIXER",
            "severity": "CRITICAL",
            "title": "Sanctioned Mixer / Tumbler Touch Identified",
            "description": f"Direct interaction with non-compliant privacy pool ({mixer_nodes[0].get('labels', ['Mixer'])[0]}). Direct ledger tracing broken.",
            "evidence_json": {"mixer_address": mixer_nodes[0]["address"]},
            "confidence": 0.99
        })

    # Deduplicate findings by title
    seen_titles = set()
    unique_findings = []
    for f in findings:
        if f["title"] not in seen_titles:
            seen_titles.add(f["title"])
            unique_findings.append(f)

    return unique_findings
