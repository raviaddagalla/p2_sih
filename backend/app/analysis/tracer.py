import asyncio
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Callable
from app.chains.simulated import simulated_provider
from app.chains.detector import detect_address_chain
from app.analysis.patterns import detect_patterns_in_subgraph
from app.analysis.attribution import identify_nearest_vasp
from app.analysis.risk import calculate_wallet_risk
from app.analysis.recommendations import generate_investigator_recommendations

async def run_trace_job(
    root_address: str,
    chain: Optional[str] = None,
    max_depth: int = 6,
    event_callback: Optional[Callable[[Dict[str, Any]], Any]] = None
) -> Dict[str, Any]:
    """
    Executes a forward trace from root_address across the transaction graph.
    Emits real-time progress events for WebSocket clients at each hop.
    """
    addr_clean = root_address.strip()
    
    # Auto-detect chain if not provided
    if not chain or chain == "UNKNOWN":
        detection = detect_address_chain(addr_clean)
        chain = detection["chain"]

    # Notify started
    if event_callback:
        await event_callback({
            "type": "job.started",
            "root_address": addr_clean,
            "chain": chain,
            "timestamp": datetime.now(timezone.utc).isoformat()
        })

    # Check if this address matches one of our curated showcase scenarios
    scenario = simulated_provider.get_scenario_by_address(addr_clean)
    
    if scenario:
        # High fidelity scenario playback with realistic hop streaming
        nodes = []
        edges = []
        findings = []

        total_nodes = scenario["nodes"]
        total_edges = scenario["edges"]
        curated_findings = scenario.get("findings", [])

        # Stream hop by hop
        max_hop = max(n.get("hop", 0) for n in total_nodes)
        
        for h in range(max_hop + 1):
            hop_nodes = [n for n in total_nodes if n.get("hop", 0) == h]
            hop_edges = [e for e in total_edges if e.get("hop_no", 1) == h]
            
            nodes.extend(hop_nodes)
            edges.extend(hop_edges)

            # Artificial delay for cinematic video recording (300ms)
            await asyncio.sleep(0.35)

            if event_callback:
                await event_callback({
                    "type": "hop.completed",
                    "hop": h,
                    "progress": int((h + 1) / (max_hop + 1) * 85),
                    "new_nodes": hop_nodes,
                    "new_edges": hop_edges,
                    "total_nodes_count": len(nodes),
                    "total_edges_count": len(edges)
                })

        # Run AML pattern detection & attribution
        subgraph_findings = detect_patterns_in_subgraph(nodes, edges)
        all_findings = curated_findings + [
            f for f in subgraph_findings if f["title"] not in [cf["title"] for cf in curated_findings]
        ]
        attribution = identify_nearest_vasp(nodes, edges)
        recommendations = generate_investigator_recommendations(attribution, all_findings, addr_clean, chain)

        # Notify findings
        if event_callback:
            if attribution:
                await event_callback({
                    "type": "vasp.identified",
                    "vasp": attribution,
                    "progress": 92
                })
            for f in all_findings:
                await event_callback({
                    "type": "pattern.detected",
                    "finding": f
                })
            await event_callback({
                "type": "recommendations.ready",
                "recommendations": recommendations,
                "progress": 98
            })
            await event_callback({
                "type": "job.completed",
                "progress": 100,
                "attribution": attribution,
                "stats": {
                    "total_nodes": len(nodes),
                    "total_edges": len(edges),
                    "total_value_usd": sum(e["total_value_usd"] for e in edges),
                    "hops_traversed": max_hop,
                    "vasp_identified": attribution["vasp_name"] if attribution else "None"
                }
            })

        return {
            "root_address": addr_clean,
            "chain": chain,
            "status": "COMPLETED",
            "progress": 100,
            "nodes": nodes,
            "edges": edges,
            "findings": all_findings,
            "attribution": attribution,
            "recommendations": recommendations,
            "stats": {
                "total_nodes": len(nodes),
                "total_edges": len(edges),
                "total_value_usd": sum(e["total_value_usd"] for e in edges),
                "hops_traversed": max_hop,
                "vasp_identified": attribution["vasp_name"] if attribution else "None"
            }
        }

    # Fallback dynamic BFS walk for novel addresses
    nodes = []
    edges = []
    visited = set()
    queue = [(addr_clean, 0)]
    visited.add(addr_clean.lower())

    root_info = await simulated_provider.get_address_info(addr_clean, chain)
    root_node = {
        "address": addr_clean,
        "chain": chain,
        "entity_type": root_info.get("entity_type", "BURNER"),
        "risk_score": root_info.get("risk_score", 85),
        "risk_category": root_info.get("risk_category", "HIGH"),
        "balance_usd": root_info.get("balance_usd", 1500.0),
        "is_root": True,
        "hop": 0,
        "labels": root_info.get("labels", ["Suspect Address"])
    }
    nodes.append(root_node)

    curr_hop = 0
    while queue and curr_hop < max_depth:
        curr_addr, depth = queue.pop(0)
        if depth >= max_depth:
            continue

        outflows = await simulated_provider.get_outflow_transactions(curr_addr, chain)
        for out in outflows:
            nxt = out["to_addr"]
            edges.append({
                "from_addr": curr_addr,
                "to_addr": nxt,
                "chain": chain,
                "total_value_usd": out["value_usd"],
                "tx_count": 1,
                "hop_no": depth + 1,
                "pattern_tag": out.get("pattern_tag", "TRANSFER")
            })

            if nxt.lower() not in visited:
                visited.add(nxt.lower())
                nxt_info = await simulated_provider.get_address_info(nxt, chain)
                nodes.append({
                    "address": nxt,
                    "chain": chain,
                    "entity_type": nxt_info.get("entity_type", "INTERMEDIARY"),
                    "risk_score": nxt_info.get("risk_score", 65),
                    "risk_category": nxt_info.get("risk_category", "MEDIUM"),
                    "balance_usd": nxt_info.get("balance_usd", 500.0),
                    "hop": depth + 1,
                    "labels": nxt_info.get("labels", [])
                })
                queue.append((nxt, depth + 1))

        curr_hop = depth + 1
        await asyncio.sleep(0.15)
        if event_callback:
            await event_callback({
                "type": "hop.completed",
                "hop": curr_hop,
                "progress": min(90, int(curr_hop / max_depth * 90)),
                "total_nodes_count": len(nodes),
                "total_edges_count": len(edges)
            })

    findings = detect_patterns_in_subgraph(nodes, edges)
    attribution = identify_nearest_vasp(nodes, edges)
    recommendations = generate_investigator_recommendations(attribution, findings, addr_clean, chain)

    if event_callback:
        if attribution:
            await event_callback({"type": "vasp.identified", "vasp": attribution})
        await event_callback({"type": "job.completed", "progress": 100})

    return {
        "root_address": addr_clean,
        "chain": chain,
        "status": "COMPLETED",
        "progress": 100,
        "nodes": nodes,
        "edges": edges,
        "findings": findings,
        "attribution": attribution,
        "recommendations": recommendations,
        "stats": {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "total_value_usd": sum(e["total_value_usd"] for e in edges),
            "hops_traversed": curr_hop,
            "vasp_identified": attribution["vasp_name"] if attribution else "None"
        }
    }
