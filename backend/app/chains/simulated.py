import hashlib
import random
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List, Optional
from app.chains.base import ChainProvider

# Curated Showcase Scenarios
SHOWCASE_SCENARIOS = {
    # 1. Headline Demo: Task-Scam USDT-TRC20 -> Exchange
    "TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L": {
        "id": 1,
        "name": "Task-Scam USDT-TRC20 → Exchange",
        "chain": "TRON",
        "symbol": "USDT",
        "fraud_type": "TASK_SCAM",
        "victim_loss_inr": 4250000.0,
        "victim_loss_usd": 51200.0,
        "victim_name": "Ramesh S. (Pune, Maharashtra)",
        "vasp_target": {
            "name": "Binance",
            "vasp_id": "vasp-binance-001",
            "deposit_address": "TZ8nC1m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
            "hot_wallet": "TNa2vQ9m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
            "hop": 4,
            "amount_usd": 48210.0,
            "confidence": 0.94,
            "tx_hash": "a4c28f09d8e7b6a51423c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5",
        },
        "nodes": [
            {
                "address": "TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L",
                "chain": "TRON",
                "entity_type": "BURNER",
                "risk_score": 94,
                "risk_category": "CRITICAL",
                "balance_usd": 120.0,
                "is_root": True,
                "hop": 0,
                "labels": ["Reported Victim Deposit", "Burner Mule Wallet", "High Velocity Outflow"]
            },
            # Hop 1 (Fan-out)
            {
                "address": "TT5xQa7K3wE8m9Lp4R6tY1uV2cZ3bX4aN5",
                "chain": "TRON",
                "entity_type": "INTERMEDIARY",
                "risk_score": 88,
                "risk_category": "HIGH",
                "balance_usd": 250.0,
                "hop": 1,
                "labels": ["Mule Layer 1", "Rapid Pass-through"]
            },
            {
                "address": "TK8wP2m9Lp4R6tY1uV2cZ3bX4aN5TT5xQa",
                "chain": "TRON",
                "entity_type": "INTERMEDIARY",
                "risk_score": 85,
                "risk_category": "HIGH",
                "balance_usd": 310.0,
                "hop": 1,
                "labels": ["Mule Layer 1", "Structured Split"]
            },
            {
                "address": "TR4mLa7K3wE8m9Lp4R6tY1uV2cZ3bX4aN5",
                "chain": "TRON",
                "entity_type": "INTERMEDIARY",
                "risk_score": 82,
                "risk_category": "HIGH",
                "balance_usd": 150.0,
                "hop": 1,
                "labels": ["Mule Layer 1", "Micro-peel"]
            },
            # Hop 2 (Layering)
            {
                "address": "TL9bK1m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
                "chain": "TRON",
                "entity_type": "INTERMEDIARY",
                "risk_score": 79,
                "risk_category": "HIGH",
                "balance_usd": 420.0,
                "hop": 2,
                "labels": ["Layering Hop 2"]
            },
            {
                "address": "TV2cZ3bX4aN5TT5xQa7K3wE8m9Lp4R6tY1",
                "chain": "TRON",
                "entity_type": "INTERMEDIARY",
                "risk_score": 76,
                "risk_category": "HIGH",
                "balance_usd": 180.0,
                "hop": 2,
                "labels": ["Layering Hop 2"]
            },
            # Hop 3 (Consolidation / Fan-in)
            {
                "address": "TM3kP9m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
                "chain": "TRON",
                "entity_type": "INTERMEDIARY",
                "risk_score": 91,
                "risk_category": "CRITICAL",
                "balance_usd": 1290.0,
                "hop": 3,
                "labels": ["Consolidation Hub", "Syndicate Transit Wallet", "Many-to-One Sweep"]
            },
            # Hop 4 (VASP Deposit & Hot Wallet)
            {
                "address": "TZ8nC1m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
                "chain": "TRON",
                "entity_type": "EXCHANGE",
                "risk_score": 15,
                "risk_category": "LOW",
                "balance_usd": 48210.0,
                "is_vasp": True,
                "vasp_name": "Binance",
                "hop": 4,
                "labels": ["VASP Deposit Address", "Binance User ID #8921849", "FIU-IND Entity"]
            },
            {
                "address": "TNa2vQ9m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
                "chain": "TRON",
                "entity_type": "EXCHANGE",
                "risk_score": 10,
                "risk_category": "LOW",
                "balance_usd": 12500000.0,
                "is_vasp": True,
                "vasp_name": "Binance Hot Wallet #14",
                "hop": 5,
                "labels": ["Binance Main Hot Wallet", "Exchange Custody"]
            }
        ],
        "edges": [
            # Hop 0 -> 1 (Fan-out)
            {
                "from_addr": "TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L",
                "to_addr": "TT5xQa7K3wE8m9Lp4R6tY1uV2cZ3bX4aN5",
                "chain": "TRON",
                "total_value_usd": 24000.0,
                "tx_count": 1,
                "hop_no": 1,
                "pattern_tag": "FAN_OUT"
            },
            {
                "from_addr": "TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L",
                "to_addr": "TK8wP2m9Lp4R6tY1uV2cZ3bX4aN5TT5xQa",
                "chain": "TRON",
                "total_value_usd": 18200.0,
                "tx_count": 1,
                "hop_no": 1,
                "pattern_tag": "FAN_OUT"
            },
            {
                "from_addr": "TJb1xV9uK4sQm8y2wP4nZ7A3cE6gH8jK9L",
                "to_addr": "TR4mLa7K3wE8m9Lp4R6tY1uV2cZ3bX4aN5",
                "chain": "TRON",
                "total_value_usd": 9000.0,
                "tx_count": 1,
                "hop_no": 1,
                "pattern_tag": "FAN_OUT"
            },
            # Hop 1 -> 2 (Layering)
            {
                "from_addr": "TT5xQa7K3wE8m9Lp4R6tY1uV2cZ3bX4aN5",
                "to_addr": "TL9bK1m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
                "chain": "TRON",
                "total_value_usd": 23750.0,
                "tx_count": 1,
                "hop_no": 2,
                "pattern_tag": "RAPID_PASSTHROUGH"
            },
            {
                "from_addr": "TK8wP2m9Lp4R6tY1uV2cZ3bX4aN5TT5xQa",
                "to_addr": "TV2cZ3bX4aN5TT5xQa7K3wE8m9Lp4R6tY1",
                "chain": "TRON",
                "total_value_usd": 17900.0,
                "tx_count": 1,
                "hop_no": 2,
                "pattern_tag": "LAYERING"
            },
            # Hop 2 -> 3 (Consolidation into transit wallet)
            {
                "from_addr": "TL9bK1m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
                "to_addr": "TM3kP9m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
                "chain": "TRON",
                "total_value_usd": 23500.0,
                "tx_count": 1,
                "hop_no": 3,
                "pattern_tag": "FAN_IN"
            },
            {
                "from_addr": "TV2cZ3bX4aN5TT5xQa7K3wE8m9Lp4R6tY1",
                "to_addr": "TM3kP9m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
                "chain": "TRON",
                "total_value_usd": 17600.0,
                "tx_count": 1,
                "hop_no": 3,
                "pattern_tag": "FAN_IN"
            },
            {
                "from_addr": "TR4mLa7K3wE8m9Lp4R6tY1uV2cZ3bX4aN5",
                "to_addr": "TM3kP9m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
                "chain": "TRON",
                "total_value_usd": 8800.0,
                "tx_count": 1,
                "hop_no": 3,
                "pattern_tag": "FAN_IN"
            },
            # Hop 3 -> 4 (VASP Direct Deposit)
            {
                "from_addr": "TM3kP9m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
                "to_addr": "TZ8nC1m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
                "chain": "TRON",
                "total_value_usd": 48210.0,
                "tx_count": 1,
                "hop_no": 4,
                "pattern_tag": "VASP_DEPOSIT"
            },
            # Hop 4 -> 5 (Internal Exchange Sweep)
            {
                "from_addr": "TZ8nC1m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
                "to_addr": "TNa2vQ9m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
                "chain": "TRON",
                "total_value_usd": 48210.0,
                "tx_count": 1,
                "hop_no": 5,
                "pattern_tag": "EXCHANGE_SWEEP"
            }
        ],
        "findings": [
            {
                "type": "VASP_HIT",
                "severity": "CRITICAL",
                "title": "Exchange Attribution: Binance Deposit Account Identified",
                "description": "Funds totaling $48,210 USDT were deposited into Binance deposit address TZ8nC... at Hop 4 with 94% attribution confidence. Internal sweep transaction confirmed to Binance Hot Wallet.",
                "evidence": {
                    "vasp": "Binance",
                    "deposit_address": "TZ8nC1m8X7y2wP4nZ7A3cE6gH8jK9LTT5x",
                    "amount_usd": 48210.0,
                    "confidence": 0.94,
                    "hop": 4
                },
                "confidence": 0.94
            },
            {
                "type": "PATTERN",
                "severity": "HIGH",
                "title": "Layering & Fan-Out/Fan-In Flow Topology",
                "description": "Suspect executed an immediate 3-way split within 3.5 minutes of victim deposit, followed by re-consolidation into transit hub TM3kP... before exchange deposit.",
                "evidence": {"dwell_time_mins": 3.5, "fan_out_degree": 3, "fan_in_degree": 3},
                "confidence": 0.92
            },
            {
                "type": "PATTERN",
                "severity": "MEDIUM",
                "title": "Rapid Dwell Velocity (Dwell Time < 4 mins)",
                "description": "Zero balance retained in intermediary mule wallets. Characteristics match organized criminal syndicates operating Telegram task scams.",
                "evidence": {"avg_dwell_mins": 3.8, "pass_through_ratio": 0.98},
                "confidence": 0.89
            }
        ]
    },

    # 2. Scenario 2: Investment Scam BTC Peel Chain
    "bc1q9v0k4x7p2m8s3t5w6u8y1z2a3b4c5d6e7f8g9": {
        "id": 2,
        "name": "Investment Scam BTC Peel Chain",
        "chain": "BTC",
        "symbol": "BTC",
        "fraud_type": "INVESTMENT",
        "victim_loss_inr": 18000000.0,
        "victim_loss_usd": 145000.0,
        "victim_name": "Ananya P. (Bengaluru, Karnataka)",
        "vasp_target": {
            "name": "CoinDCX",
            "vasp_id": "vasp-coindcx-002",
            "deposit_address": "bc1qdcx8892kmv72s892x0k1l2m3n4p5q6r7s8t9",
            "hop": 5,
            "amount_usd": 86400.0,
            "confidence": 0.91,
            "tx_hash": "c8e9b0a1d2f3e4c5b6a7890123456789abcdef0123456789abcdef0123456789",
        },
        "nodes": [
            {
                "address": "bc1q9v0k4x7p2m8s3t5w6u8y1z2a3b4c5d6e7f8g9",
                "chain": "BTC",
                "entity_type": "BURNER",
                "risk_score": 90,
                "risk_category": "CRITICAL",
                "balance_usd": 500.0,
                "is_root": True,
                "hop": 0,
                "labels": ["Reported High-Yield Scam Address", "Primary Intake"]
            },
            {
                "address": "bc1qpeel1x82kmv72s892x0k1l2m3n4p5q6r7s8t1",
                "chain": "BTC",
                "entity_type": "INTERMEDIARY",
                "risk_score": 84,
                "risk_category": "HIGH",
                "balance_usd": 1200.0,
                "hop": 1,
                "labels": ["Peel Chain Hop 1"]
            },
            {
                "address": "bc1qpeel2x82kmv72s892x0k1l2m3n4p5q6r7s8t2",
                "chain": "BTC",
                "entity_type": "INTERMEDIARY",
                "risk_score": 81,
                "risk_category": "HIGH",
                "balance_usd": 900.0,
                "hop": 2,
                "labels": ["Peel Chain Hop 2"]
            },
            {
                "address": "bc1qpeel3x82kmv72s892x0k1l2m3n4p5q6r7s8t3",
                "chain": "BTC",
                "entity_type": "INTERMEDIARY",
                "risk_score": 78,
                "risk_category": "HIGH",
                "balance_usd": 1500.0,
                "hop": 3,
                "labels": ["Peel Chain Hop 3"]
            },
            {
                "address": "bc1qzebpay992kmv72s892x0k1l2m3n4p5q6r7s8",
                "chain": "BTC",
                "entity_type": "EXCHANGE",
                "risk_score": 12,
                "risk_category": "LOW",
                "balance_usd": 42000.0,
                "is_vasp": True,
                "vasp_name": "ZebPay",
                "hop": 4,
                "labels": ["ZebPay Deposit Address", "FIU-IND Registered"]
            },
            {
                "address": "bc1qdcx8892kmv72s892x0k1l2m3n4p5q6r7s8t9",
                "chain": "BTC",
                "entity_type": "EXCHANGE",
                "risk_score": 14,
                "risk_category": "LOW",
                "balance_usd": 86400.0,
                "is_vasp": True,
                "vasp_name": "CoinDCX",
                "hop": 5,
                "labels": ["CoinDCX Verified Deposit", "FIU-IND Registered"]
            }
        ],
        "edges": [
            {
                "from_addr": "bc1q9v0k4x7p2m8s3t5w6u8y1z2a3b4c5d6e7f8g9",
                "to_addr": "bc1qpeel1x82kmv72s892x0k1l2m3n4p5q6r7s8t1",
                "chain": "BTC",
                "total_value_usd": 142000.0,
                "tx_count": 1,
                "hop_no": 1,
                "pattern_tag": "PEEL_CHAIN"
            },
            {
                "from_addr": "bc1qpeel1x82kmv72s892x0k1l2m3n4p5q6r7s8t1",
                "to_addr": "bc1qpeel2x82kmv72s892x0k1l2m3n4p5q6r7s8t2",
                "chain": "BTC",
                "total_value_usd": 138000.0,
                "tx_count": 1,
                "hop_no": 2,
                "pattern_tag": "PEEL_CHAIN"
            },
            {
                "from_addr": "bc1qpeel2x82kmv72s892x0k1l2m3n4p5q6r7s8t2",
                "to_addr": "bc1qpeel3x82kmv72s892x0k1l2m3n4p5q6r7s8t3",
                "chain": "BTC",
                "total_value_usd": 132000.0,
                "tx_count": 1,
                "hop_no": 3,
                "pattern_tag": "PEEL_CHAIN"
            },
            {
                "from_addr": "bc1qpeel2x82kmv72s892x0k1l2m3n4p5q6r7s8t2",
                "to_addr": "bc1qzebpay992kmv72s892x0k1l2m3n4p5q6r7s8",
                "chain": "BTC",
                "total_value_usd": 42000.0,
                "tx_count": 1,
                "hop_no": 4,
                "pattern_tag": "VASP_DEPOSIT"
            },
            {
                "from_addr": "bc1qpeel3x82kmv72s892x0k1l2m3n4p5q6r7s8t3",
                "to_addr": "bc1qdcx8892kmv72s892x0k1l2m3n4p5q6r7s8t9",
                "chain": "BTC",
                "total_value_usd": 86400.0,
                "tx_count": 1,
                "hop_no": 5,
                "pattern_tag": "VASP_DEPOSIT"
            }
        ],
        "findings": [
            {
                "type": "VASP_HIT",
                "severity": "CRITICAL",
                "title": "Two FIU-IND Exchanges Attributed: CoinDCX & ZebPay",
                "description": "Suspect systematically peeled off BTC payments and deposited $86,400 into CoinDCX and $42,000 into ZebPay. Both exchanges are FIU-IND registered.",
                "evidence": {"coindcx_amount": 86400.0, "zebpay_amount": 42000.0},
                "confidence": 0.91
            },
            {
                "type": "PATTERN",
                "severity": "HIGH",
                "title": "Bitcoin Peel Chain Decomposition Detected",
                "description": "5 consecutive transactions exhibit asymptotic peel chain structure with 1-in-2-out UTXO patterns.",
                "evidence": {"peel_hops": 4, "r_squared": 0.96},
                "confidence": 0.95
            }
        ]
    },

    # 3. Scenario 3: Cross-Chain Launder (ETH -> BSC -> TRON -> Exchange)
    "0x71C67E7e9a8f219E2B3a7d4A54F3B8C1D9e0A48F": {
        "id": 3,
        "name": "Cross-Chain Launder (ETH → BSC → TRON → Bybit)",
        "chain": "ETH",
        "symbol": "ETH",
        "fraud_type": "PHISHING",
        "victim_loss_inr": 6500000.0,
        "victim_loss_usd": 78000.0,
        "victim_name": "Vikram M. (Hyderabad, Telangana)",
        "vasp_target": {
            "name": "Bybit",
            "vasp_id": "vasp-bybit-003",
            "deposit_address": "0xbybit8912389abcdef0123456789abcdef012345",
            "hop": 5,
            "amount_usd": 74500.0,
            "confidence": 0.88,
            "tx_hash": "0xfa12938481928374619283746192837461928374619283746192837461928374",
        },
        "nodes": [
            {
                "address": "0x71C67E7e9a8f219E2B3a7d4A54F3B8C1D9e0A48F",
                "chain": "ETH",
                "entity_type": "BURNER",
                "risk_score": 92,
                "risk_category": "CRITICAL",
                "balance_usd": 40.0,
                "is_root": True,
                "hop": 0,
                "labels": ["Phishing Drainer Contract", "ERC-20 Permit Exploit"]
            },
            {
                "address": "0xStargateBridgeRouterAddress0123456789abc",
                "chain": "ETH",
                "entity_type": "BRIDGE",
                "risk_score": 45,
                "risk_category": "MEDIUM",
                "balance_usd": 95000000.0,
                "hop": 1,
                "labels": ["Stargate Finance Bridge Router", "Cross-Chain Bridge"]
            },
            {
                "address": "0x9923BSCIntermediaryMuleAddress0123456789",
                "chain": "BSC",
                "entity_type": "INTERMEDIARY",
                "risk_score": 86,
                "risk_category": "HIGH",
                "balance_usd": 120.0,
                "hop": 2,
                "labels": ["BNB Chain Mule Wallet"]
            },
            {
                "address": "0xPancakeSwapDEXRouter0123456789abcdef0123",
                "chain": "BSC",
                "entity_type": "DEFI",
                "risk_score": 30,
                "risk_category": "LOW",
                "balance_usd": 18000000.0,
                "hop": 3,
                "labels": ["PancakeSwap V3 Pool", "DEX Swap ETH->USDT"]
            },
            {
                "address": "0xbybit8912389abcdef0123456789abcdef012345",
                "chain": "BSC",
                "entity_type": "EXCHANGE",
                "risk_score": 15,
                "risk_category": "LOW",
                "balance_usd": 74500.0,
                "is_vasp": True,
                "vasp_name": "Bybit",
                "hop": 4,
                "labels": ["Bybit BSC Deposit Account"]
            }
        ],
        "edges": [
            {
                "from_addr": "0x71C67E7e9a8f219E2B3a7d4A54F3B8C1D9e0A48F",
                "to_addr": "0xStargateBridgeRouterAddress0123456789abc",
                "chain": "ETH",
                "total_value_usd": 77800.0,
                "tx_count": 1,
                "hop_no": 1,
                "pattern_tag": "CROSS_CHAIN_BRIDGE"
            },
            {
                "from_addr": "0xStargateBridgeRouterAddress0123456789abc",
                "to_addr": "0x9923BSCIntermediaryMuleAddress0123456789",
                "chain": "BSC",
                "total_value_usd": 77100.0,
                "tx_count": 1,
                "hop_no": 2,
                "pattern_tag": "BRIDGE_EXIT"
            },
            {
                "from_addr": "0x9923BSCIntermediaryMuleAddress0123456789",
                "to_addr": "0xPancakeSwapDEXRouter0123456789abcdef0123",
                "chain": "BSC",
                "total_value_usd": 76500.0,
                "tx_count": 1,
                "hop_no": 3,
                "pattern_tag": "DEX_SWAP"
            },
            {
                "from_addr": "0xPancakeSwapDEXRouter0123456789abcdef0123",
                "to_addr": "0xbybit8912389abcdef0123456789abcdef012345",
                "chain": "BSC",
                "total_value_usd": 74500.0,
                "tx_count": 1,
                "hop_no": 4,
                "pattern_tag": "VASP_DEPOSIT"
            }
        ],
        "findings": [
            {
                "type": "BRIDGE",
                "severity": "HIGH",
                "title": "Chain-Hopping via Stargate Bridge (ETH → BNB Chain)",
                "description": "Suspect transferred $77,800 from Ethereum to BNB Chain via Stargate router to break single-chain forensic tracing.",
                "evidence": {"source_chain": "ETH", "dest_chain": "BSC", "bridge": "Stargate"},
                "confidence": 0.95
            },
            {
                "type": "VASP_HIT",
                "severity": "CRITICAL",
                "title": "Attribution: Bybit BSC Deposit Account Identified",
                "description": "Following DEX swap on PancakeSwap, $74,500 was deposited into Bybit deposit address.",
                "evidence": {"vasp": "Bybit", "amount_usd": 74500.0},
                "confidence": 0.88
            }
        ]
    },

    # 4. Scenario 4: Mixer Exposure (Tornado Cash)
    "0x3a4F91d8A3b7C2E4F5D6B7890123456789aBcDeF": {
        "id": 4,
        "name": "Mixer Exposure (Tornado Cash)",
        "chain": "ETH",
        "symbol": "ETH",
        "fraud_type": "RANSOMWARE",
        "victim_loss_inr": 3500000.0,
        "victim_loss_usd": 42000.0,
        "victim_name": "TechSol Pvt Ltd (Gurugram, Haryana)",
        "vasp_target": None,
        "nodes": [
            {
                "address": "0x3a4F91d8A3b7C2E4F5D6B7890123456789aBcDeF",
                "chain": "ETH",
                "entity_type": "BURNER",
                "risk_score": 96,
                "risk_category": "CRITICAL",
                "balance_usd": 150.0,
                "is_root": True,
                "hop": 0,
                "labels": ["Ransomware Extortion Address", "OFAC Sanction Proximity"]
            },
            {
                "address": "0x892IntermediaryMuleWallet0123456789abcdef",
                "chain": "ETH",
                "entity_type": "INTERMEDIARY",
                "risk_score": 92,
                "risk_category": "CRITICAL",
                "balance_usd": 300.0,
                "hop": 1,
                "labels": ["Transit Mule"]
            },
            {
                "address": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
                "chain": "ETH",
                "entity_type": "MIXER",
                "risk_score": 99,
                "risk_category": "CRITICAL",
                "balance_usd": 45000000.0,
                "hop": 2,
                "labels": ["Tornado.Cash 10 ETH Pool", "Sanctioned Entity (OFAC/UN)"]
            },
            {
                "address": "0x772TemporalCorrelationExitCandidate01234",
                "chain": "ETH",
                "entity_type": "UNKNOWN",
                "risk_score": 85,
                "risk_category": "HIGH",
                "balance_usd": 28000.0,
                "hop": 3,
                "labels": ["Probable Mixer Exit Candidate (Time Correlation: 88%)"]
            }
        ],
        "edges": [
            {
                "from_addr": "0x3a4F91d8A3b7C2E4F5D6B7890123456789aBcDeF",
                "to_addr": "0x892IntermediaryMuleWallet0123456789abcdef",
                "chain": "ETH",
                "total_value_usd": 41800.0,
                "tx_count": 1,
                "hop_no": 1,
                "pattern_tag": "RAPID_PASSTHROUGH"
            },
            {
                "from_addr": "0x892IntermediaryMuleWallet0123456789abcdef",
                "to_addr": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
                "chain": "ETH",
                "total_value_usd": 41500.0,
                "tx_count": 1,
                "hop_no": 2,
                "pattern_tag": "MIXER_DEPOSIT"
            },
            {
                "from_addr": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b",
                "to_addr": "0x772TemporalCorrelationExitCandidate01234",
                "chain": "ETH",
                "total_value_usd": 28000.0,
                "tx_count": 1,
                "hop_no": 3,
                "pattern_tag": "TEMPORAL_HEURISTIC"
            }
        ],
        "findings": [
            {
                "type": "MIXER",
                "severity": "CRITICAL",
                "title": "Direct Interaction with Sanctioned Mixer (Tornado Cash)",
                "description": "Funds entered Tornado.Cash 10 ETH Pool contract at Hop 2. Direct blockchain tracing interrupted; statistical heuristic engaged for exit identification.",
                "evidence": {"contract": "0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b", "pool_size": "10 ETH"},
                "confidence": 0.99
            },
            {
                "type": "PATTERN",
                "severity": "HIGH",
                "title": "Mixer Exit Correlation Candidate Found",
                "description": "Identified withdrawal of 10 ETH exactly 142 minutes post-deposit matching volume structure with 88% temporal correlation.",
                "evidence": {"candidate": "0x772Temporal...", "correlation": 0.88},
                "confidence": 0.88
            }
        ]
    },

    # 5. Scenario 5: Sextortion Small-Ticket Consolidation into Cold Wallet
    "1BoatSLRHtKNngkdXEeobR76b53LETtpyT": {
        "id": 5,
        "name": "Sextortion Small-Ticket Cluster",
        "chain": "BTC",
        "symbol": "BTC",
        "fraud_type": "SEXTORTION",
        "victim_loss_inr": 1850000.0,
        "victim_loss_usd": 22400.0,
        "victim_name": "Saurabh K. (Lucknow, Uttar Pradesh)",
        "vasp_target": None,
        "nodes": [
            {
                "address": "1BoatSLRHtKNngkdXEeobR76b53LETtpyT",
                "chain": "BTC",
                "entity_type": "BURNER",
                "risk_score": 87,
                "risk_category": "HIGH",
                "balance_usd": 0.0,
                "is_root": True,
                "hop": 0,
                "labels": ["Sextortion Email Campaign Wallet", "Vanity Address"]
            },
            {
                "address": "bc1qVictimClusterCollector88192837461928",
                "chain": "BTC",
                "entity_type": "INTERMEDIARY",
                "risk_score": 93,
                "risk_category": "CRITICAL",
                "balance_usd": 150.0,
                "hop": 1,
                "labels": ["45-Victim Consolidation Node", "Syndicate Collector"]
            },
            {
                "address": "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
                "chain": "BTC",
                "entity_type": "INTERMEDIARY",
                "risk_score": 75,
                "risk_category": "HIGH",
                "balance_usd": 22250.0,
                "hop": 2,
                "labels": ["Unhosted Hardware Wallet (Trezor/Ledger)", "Cold Storage Target"]
            }
        ],
        "edges": [
            {
                "from_addr": "1BoatSLRHtKNngkdXEeobR76b53LETtpyT",
                "to_addr": "bc1qVictimClusterCollector88192837461928",
                "chain": "BTC",
                "total_value_usd": 1200.0,
                "tx_count": 1,
                "hop_no": 1,
                "pattern_tag": "FAN_IN"
            },
            {
                "from_addr": "bc1qVictimClusterCollector88192837461928",
                "to_addr": "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy",
                "chain": "BTC",
                "total_value_usd": 22250.0,
                "tx_count": 1,
                "hop_no": 2,
                "pattern_tag": "COLD_STORAGE_SWEEP"
            }
        ],
        "findings": [
            {
                "type": "PATTERN",
                "severity": "HIGH",
                "title": "Many-to-One Micro-Payment Consolidation (45 Victims)",
                "description": "Suspect aggregated small extortion payments (0.01 - 0.05 BTC each) into a central collection node.",
                "evidence": {"contributing_victims_count": 45, "total_btc": 0.32},
                "confidence": 0.94
            },
            {
                "type": "PATTERN",
                "severity": "INFO",
                "title": "Unhosted Cold Wallet Destination",
                "description": "Funds parked in unhosted P2SH address with zero outward movement. No exchange hit; recommend watchlist surveillance.",
                "evidence": {"destination_type": "NON_CUSTODIAL_COLD"},
                "confidence": 0.92
            }
        ]
    },

    # 6. Scenario 6: Ransomware BTC Darknet Market
    "bc1qa8m4p7z2x9w3y5v1u8t6s4r2q0p8o6n4m2k0j8": {
        "id": 6,
        "name": "Ransomware BTC Critical Threat",
        "chain": "BTC",
        "symbol": "BTC",
        "fraud_type": "RANSOMWARE",
        "victim_loss_inr": 52000000.0,
        "victim_loss_usd": 625000.0,
        "victim_name": "Apollo Super Specialty Hospital (New Delhi)",
        "vasp_target": None,
        "nodes": [
            {
                "address": "bc1qa8m4p7z2x9w3y5v1u8t6s4r2q0p8o6n4m2k0j8",
                "chain": "BTC",
                "entity_type": "BURNER",
                "risk_score": 98,
                "risk_category": "CRITICAL",
                "balance_usd": 200.0,
                "is_root": True,
                "hop": 0,
                "labels": ["LockBit 3.0 Extortion Target", "Hospital Ransom Payment"]
            },
            {
                "address": "bc1qDarknetHydraMarketplaceClusteredAddress",
                "chain": "BTC",
                "entity_type": "MIXER",
                "risk_score": 99,
                "risk_category": "CRITICAL",
                "balance_usd": 8500000.0,
                "hop": 1,
                "labels": ["Sanctioned Darknet Market Cluster", "Illicit Narcotics/C2 Rail"]
            }
        ],
        "edges": [
            {
                "from_addr": "bc1qa8m4p7z2x9w3y5v1u8t6s4r2q0p8o6n4m2k0j8",
                "to_addr": "bc1qDarknetHydraMarketplaceClusteredAddress",
                "chain": "BTC",
                "total_value_usd": 624500.0,
                "tx_count": 1,
                "hop_no": 1,
                "pattern_tag": "DARKNET_PAYMENT"
            }
        ],
        "findings": [
            {
                "type": "PATTERN",
                "severity": "CRITICAL",
                "title": "Immediate Transfer to Sanctioned Darknet Entity",
                "description": "Full ransom of 8.5 BTC transferred directly into known darknet marketplace liquidity pool.",
                "evidence": {"cluster": "Darknet Market", "risk_score": 99},
                "confidence": 0.98
            }
        ]
    }
}


class SimulatedChainProvider(ChainProvider):
    """
    Deterministic Simulated Blockchain Provider.
    Handles the 6 showcase scenarios with precision, plus deterministic random walks
    for any novel user-entered address.
    """

    def __init__(self):
        self.scenarios = SHOWCASE_SCENARIOS

    def get_scenario_by_address(self, address: str) -> Optional[Dict[str, Any]]:
        addr_clean = address.strip()
        for root_addr, scen in self.scenarios.items():
            if root_addr.lower() == addr_clean.lower():
                return scen
        return None

    async def get_address_info(self, address: str, chain: str) -> Dict[str, Any]:
        scen = self.get_scenario_by_address(address)
        if scen:
            # Check if this address is in the scenario nodes
            for node in scen["nodes"]:
                if node["address"].lower() == address.strip().lower():
                    return {
                        "address": node["address"],
                        "chain": node["chain"],
                        "entity_type": node["entity_type"],
                        "balance_usd": node["balance_usd"],
                        "balance_native": node["balance_usd"] / (65000.0 if chain == "BTC" else (3400.0 if chain == "ETH" else 1.0)),
                        "tx_count": random.randint(4, 38),
                        "first_seen": datetime.now(timezone.utc) - timedelta(days=random.randint(10, 45)),
                        "last_seen": datetime.now(timezone.utc) - timedelta(hours=random.randint(1, 12)),
                        "risk_score": node["risk_score"],
                        "risk_category": node["risk_category"],
                        "labels": node.get("labels", []),
                        "is_vasp": node.get("is_vasp", False),
                        "vasp_name": node.get("vasp_name")
                    }

        # Deterministic fallback for arbitrary addresses
        seed_val = int(hashlib.sha256(address.encode()).hexdigest()[:8], 16)
        rng = random.Random(seed_val)
        risk = rng.randint(45, 92)
        cat = "CRITICAL" if risk >= 85 else ("HIGH" if risk >= 70 else "MEDIUM")
        bal = rng.uniform(100.0, 25000.0)

        return {
            "address": address,
            "chain": chain,
            "entity_type": "INTERMEDIARY",
            "balance_usd": round(bal, 2),
            "balance_native": round(bal / (65000.0 if chain == "BTC" else 1.0), 4),
            "tx_count": rng.randint(5, 50),
            "first_seen": datetime.now(timezone.utc) - timedelta(days=rng.randint(5, 30)),
            "last_seen": datetime.now(timezone.utc) - timedelta(hours=rng.randint(2, 24)),
            "risk_score": risk,
            "risk_category": cat,
            "labels": ["Dynamic Simulated Node", "Mule Account Candidate"],
            "is_vasp": False,
            "vasp_name": None
        }

    async def get_outflow_transactions(
        self, address: str, chain: str, limit: int = 20
    ) -> List[Dict[str, Any]]:
        scen = self.get_scenario_by_address(address)
        if scen:
            outflows = []
            for edge in scen["edges"]:
                if edge["from_addr"].lower() == address.strip().lower():
                    outflows.append({
                        "hash": hashlib.sha256(f"{edge['from_addr']}{edge['to_addr']}".encode()).hexdigest(),
                        "chain": edge["chain"],
                        "from_addr": edge["from_addr"],
                        "to_addr": edge["to_addr"],
                        "value_usd": edge["total_value_usd"],
                        "value_native": edge["total_value_usd"] / (65000.0 if edge["chain"] == "BTC" else 1.0),
                        "timestamp": datetime.now(timezone.utc) - timedelta(hours=edge["hop_no"] * 2),
                        "hop_no": edge["hop_no"],
                        "pattern_tag": edge.get("pattern_tag")
                    })
            return outflows

        # Fallback deterministic dynamic walk (3-4 hops to an exchange)
        seed_val = int(hashlib.sha256(address.encode()).hexdigest()[:8], 16)
        rng = random.Random(seed_val)
        num_outs = rng.randint(1, 3)
        outflows = []

        for i in range(num_outs):
            next_addr = f"T{hashlib.sha256(f'{address}_{i}'.encode()).hexdigest()[:33]}" if chain == "TRON" else f"0x{hashlib.sha256(f'{address}_{i}'.encode()).hexdigest()[:40]}"
            val = rng.uniform(500.0, 15000.0)
            outflows.append({
                "hash": hashlib.sha256(f"{address}{next_addr}".encode()).hexdigest(),
                "chain": chain,
                "from_addr": address,
                "to_addr": next_addr,
                "value_usd": round(val, 2),
                "value_native": round(val, 2),
                "timestamp": datetime.now(timezone.utc) - timedelta(hours=rng.randint(1, 6)),
                "hop_no": 1,
                "pattern_tag": "INTERMEDIARY_HOP"
            })
        return outflows

    async def get_transaction(self, tx_hash: str, chain: str) -> Optional[Dict[str, Any]]:
        return {
            "hash": tx_hash,
            "chain": chain,
            "block": random.randint(18000000, 19500000),
            "timestamp": datetime.now(timezone.utc) - timedelta(hours=2),
            "fee": 1.25,
            "is_confirmed": True
        }

simulated_provider = SimulatedChainProvider()
