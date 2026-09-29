from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import init_db
from app.api import auth, cases, ingest, trace, wallets, vasps, freeze_requests, alerts, analytics, reports, admin

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist
    await init_db()
    yield

app = FastAPI(
    title="ChainShield — Real-Time Crypto Fraud Attribution Platform",
    description="Intelligence and Attribution Platform for Indian Law Enforcement Agencies (LEAs). "
                "From victim complaint to exchange freeze request in seconds.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api
app.include_router(auth.router, prefix="/api")
app.include_router(cases.router, prefix="/api")
app.include_router(ingest.router, prefix="/api")
app.include_router(trace.router, prefix="/api")
app.include_router(wallets.router, prefix="/api")
app.include_router(vasps.router, prefix="/api")
app.include_router(freeze_requests.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(analytics.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(admin.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "platform": "ChainShield",
        "tagline": "From victim complaint to exchange freeze request in seconds.",
        "agency": "Indian Law Enforcement Agencies (LEAs)",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "OPERATIONAL"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
