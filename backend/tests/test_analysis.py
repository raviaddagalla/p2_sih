import asyncio
from app.analysis.tracer import run_trace_job
from app.analysis.attribution import identify_nearest_vasp
from app.analysis.patterns import detect_patterns_in_subgraph
from app.analysis.risk import calculate_wallet_risk

def test_headline_scenario_trace():
    root_addr = "TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L"
    res = asyncio.run(run_trace_job(root_addr, "TRON"))

    assert res["status"] == "COMPLETED"
    assert res["progress"] == 100
    assert len(res["nodes"]) >= 5
    assert len(res["edges"]) >= 5
    
    # Verify VASP attribution
    attr = res["attribution"]
    assert attr is not None
    assert "Binance" in attr["vasp_name"]
    assert attr["hop"] == 4
    assert attr["amount_usd"] >= 45000.0
    assert attr["confidence"] >= 0.90
    assert attr["fiu_registered"] is True

def test_pattern_detection():
    mock_nodes = [
        {"address": "A", "entity_type": "BURNER"},
        {"address": "B", "entity_type": "INTERMEDIARY"},
        {"address": "C", "entity_type": "INTERMEDIARY"},
        {"address": "D", "entity_type": "INTERMEDIARY"},
    ]
    mock_edges = [
        {"from_addr": "A", "to_addr": "B", "total_value_usd": 1000.0},
        {"from_addr": "A", "to_addr": "C", "total_value_usd": 1000.0},
        {"from_addr": "A", "to_addr": "D", "total_value_usd": 1000.0},
    ]

    findings = detect_patterns_in_subgraph(mock_nodes, mock_edges)
    assert any("Fan-Out" in f["title"] for f in findings)

def test_risk_scoring():
    res = calculate_wallet_risk("BURNER", ["Mule"], 5, 200.0, [])
    assert res["risk_score"] == 60
    assert res["risk_category"] == "MEDIUM"

    mixer_res = calculate_wallet_risk("MIXER", ["Tornado Cash"], 10, 5000.0, [])
    assert mixer_res["risk_score"] >= 85
    assert mixer_res["risk_category"] == "CRITICAL"
