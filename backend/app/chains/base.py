from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional

class ChainProvider(ABC):
    """
    Abstract interface for blockchain providers (Simulated or Real indexers).
    """

    @abstractmethod
    async def get_address_info(self, address: str, chain: str) -> Dict[str, Any]:
        """Fetch balance, tx count, first/last seen, labels."""
        pass

    @abstractmethod
    async def get_outflow_transactions(
        self, address: str, chain: str, limit: int = 20
    ) -> List[Dict[str, Any]]:
        """Fetch transactions sending funds out of this address."""
        pass

    @abstractmethod
    async def get_transaction(self, tx_hash: str, chain: str) -> Optional[Dict[str, Any]]:
        """Fetch details of a single transaction."""
        pass
