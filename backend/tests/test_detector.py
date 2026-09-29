import pytest
from app.chains.detector import detect_address_chain

def test_tron_detection():
    addr = "TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L"
    res = detect_address_chain(addr)
    assert res["chain"] == "TRON"
    assert res["confidence"] >= 0.95

def test_btc_bech32_detection():
    addr = "bc1q9v0k4x7p2m8s3t5w6u8y1z2a3b4c5d6e7f8g9"
    res = detect_address_chain(addr)
    assert res["chain"] == "BTC"
    assert res["confidence"] >= 0.95

def test_btc_legacy_detection():
    addr = "1BoatSLRHtKNngkdXEeobR76b53LETtpyT"
    res = detect_address_chain(addr)
    assert res["chain"] == "BTC"

def test_evm_detection():
    addr = "0x71C67E7e9a8f219E2B3a7d4A54F3B8C1D9e0A48F"
    res = detect_address_chain(addr)
    assert res["chain"] == "ETH"
    assert res["confidence"] >= 0.90
