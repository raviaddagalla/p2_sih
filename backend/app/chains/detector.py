import re
from typing import Dict, Any

def detect_address_chain(address: str) -> Dict[str, Any]:
    """
    Detects the blockchain network from the crypto address format.
    Returns: {"chain": str, "symbol": str, "name": str, "confidence": float}
    """
    addr = address.strip()

    # 1. TRON (USDT-TRC20 is #1 scam rail in India)
    # Starts with T, length 34, base58
    if re.match(r"^T[1-9A-HJ-NP-Za-km-z]{33}$", addr):
        return {
            "chain": "TRON",
            "symbol": "TRX/USDT",
            "name": "TRON Network (TRC-20)",
            "confidence": 0.99,
            "badge_color": "rose",
        }

    # 2. Bitcoin (BTC)
    # SegWit bc1, Legacy 1..., P2SH 3...
    if re.match(r"^(bc1[a-zA-HJ-NP-Z0-9]{25,62}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$", addr):
        return {
            "chain": "BTC",
            "symbol": "BTC",
            "name": "Bitcoin Mainnet",
            "confidence": 0.98,
            "badge_color": "amber",
        }

    # 3. EVM (Ethereum, BSC, Polygon)
    if re.match(r"^0x[a-fA-F0-9]{40}$", addr):
        # Default to ETH, but EVM compatible
        return {
            "chain": "ETH",
            "symbol": "ETH/EVM",
            "name": "Ethereum (ERC-20)",
            "confidence": 0.95,
            "badge_color": "cyan",
        }

    # 4. Solana
    if re.match(r"^[1-9A-HJ-NP-Za-km-z]{32,44}$", addr) and not addr.startswith("T"):
        return {
            "chain": "SOL",
            "symbol": "SOL",
            "name": "Solana Network",
            "confidence": 0.85,
            "badge_color": "purple",
        }

    return {
        "chain": "UNKNOWN",
        "symbol": "???",
        "name": "Unrecognized Format",
        "confidence": 0.0,
        "badge_color": "slate",
    }
