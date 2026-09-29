from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "ChainShield"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = "chainshield-super-secret-key-for-indian-leas-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    DATABASE_URL: str = "sqlite+aiosqlite:///./chainshield.db"
    DEMO_MODE: bool = True
    USE_REAL_PROVIDERS: bool = False
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:8000"]
    SIMULATED_HOP_DELAY_MS: int = 500  # for realistic recording pace

    class Config:
        case_sensitive = True
        extra = "allow"

settings = Settings()
