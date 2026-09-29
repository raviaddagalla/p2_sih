from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.models.models import User
from app.schemas.schemas import UserLogin, UserVerifyOTP, Token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login")
async def login(credentials: UserLogin, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == credentials.email.lower())
    res = await db.execute(query)
    user = res.scalars().first()

    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    # In our LEA security protocol, simulated MFA OTP is required
    return {
        "mfa_required": True,
        "email": user.email,
        "message": "MFA OTP sent to official mobile/token. (Demo mode: Enter 123456)"
    }

@router.post("/verify-otp", response_model=Token)
async def verify_otp(otp_data: UserVerifyOTP, db: AsyncSession = Depends(get_db)):
    # Demo accepts 123456 or any 6-digit code
    if otp_data.otp not in ["123456", "999999", "000000"] and len(otp_data.otp) != 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid MFA OTP. Please enter 123456 in demo mode."
        )

    query = select(User).where(User.email == otp_data.email.lower())
    res = await db.execute(query)
    user = res.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.last_login = datetime.now(timezone.utc)
    await db.commit()

    token_payload = {
        "sub": user.id,
        "email": user.email,
        "role": user.role,
        "name": user.name,
        "badge_no": user.badge_no
    }
    access_token = create_access_token(token_payload)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "badge_no": user.badge_no,
            "agency_id": user.agency_id
        }
    }

@router.get("/me")
async def get_current_user(email: str = "io@demo.gov.in", db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == email.lower())
    res = await db.execute(query)
    user = res.scalars().first()

    if not user:
        return {
            "id": "demo-user-id",
            "name": "IO Rajan Sharma",
            "email": "io@demo.gov.in",
            "role": "IO",
            "badge_no": "MH-CY-2024-8841",
            "agency_id": "agency-mh-01"
        }

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "badge_no": user.badge_no,
        "agency_id": user.agency_id
    }
