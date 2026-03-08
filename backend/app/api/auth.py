from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app import models, schemas
from app.api import deps
from app.core import security
from app.core.config import settings
from app.utils.email import send_welcome_email

import random
import time
import json
import os
from typing import Dict

router = APIRouter()

OTP_FILE = "otps.json"

def get_otp_store() -> Dict[str, dict]:
    try:
        if not os.path.exists(OTP_FILE): return {}
        with open(OTP_FILE, "r") as f: return json.load(f)
    except:
        return {}

def save_otp_store(store: Dict[str, dict]):
    try:
        with open(OTP_FILE, "w") as f: json.dump(store, f)
    except:
        pass

def generate_otp() -> str:
    return str(random.randint(1000, 9999))

@router.post("/request-otp")
def request_login_otp(
    payload: schemas.LoginOTPRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db)
) -> Any:
    number = payload.whatsapp_number
    scenario = payload.scenario

    # Basic validation
    if len(number) < 10:
        raise HTTPException(status_code=400, detail="Invalid WhatsApp number")
    
    user = db.query(models.User).filter(models.User.whatsapp_number == number).first()
    
    # 1. Check if user exists. If not, auto-create them IF scenario is login.
    if not user and scenario == "login":
        # Check by email fallback (mock email for now)
        mock_email = f"{number}@passfit.in"
        user = models.User(
            email=mock_email,
            hashed_password=security.get_password_hash("auto_pass_" + number),
            role="Customer",
            whatsapp_number=number,
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        # Send Welcome WhatsApp asynchronously
        from app.utils.whatsapp import send_welcome_whatsapp
        background_tasks.add_task(send_welcome_whatsapp, number, "Guest")
        
    # 2. Generate and store OTP (valid for 5 mins)
    code = generate_otp()
    
    store = get_otp_store()
    store[number] = {
        "otp": code,
        "expires": time.time() + 300 
    }
    save_otp_store(store)
    
    # 3. Send REAL OTP via Meta Cloud WhatsApp API
    from app.utils.whatsapp import send_otp_whatsapp
    background_tasks.add_task(send_otp_whatsapp, number, code)
    
    return {"message": "OTP sent successfully to WhatsApp."}

@router.post("/verify-otp", response_model=schemas.Token)
def verify_login_otp(
    payload: schemas.LoginOTPVerify,
    db: Session = Depends(deps.get_db)
) -> Any:
    number = payload.whatsapp_number
    code = payload.otp
    
    store = get_otp_store()
    stored = store.get(number)
    
    if not stored:
        raise HTTPException(status_code=400, detail="OTP not requested or expired")
    
    if time.time() > stored["expires"]:
        del store[number]
        save_otp_store(store)
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new one.")
        
    if stored["otp"] != code:
        raise HTTPException(status_code=400, detail="Incorrect OTP")
        
    # Success! Find user and issue JWT token
    user = db.query(models.User).filter(models.User.whatsapp_number == number).first()
    if not user:
         raise HTTPException(status_code=400, detail="User mapping failed")
         
    # Cleanup OTP
    del store[number]
    save_otp_store(store)
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/login", response_model=schemas.Token)
def login_access_token(
    db: Session = Depends(deps.get_db), form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/signup", response_model=schemas.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
    otp: str,
    background_tasks: BackgroundTasks
) -> Any:
    """
    Create new user with Email/Password and Mandatory WhatsApp Verification.
    """
    # 1. Verify WhatsApp OTP first
    number = user_in.whatsapp_number
    
    store = get_otp_store()
    stored = store.get(number)
    
    if not stored:
        raise HTTPException(status_code=400, detail="Please request a WhatsApp OTP first")
    if time.time() > stored["expires"]:
        del store[number]
        save_otp_store(store)
        raise HTTPException(status_code=400, detail="OTP expired. Please request a new one.")
    if stored["otp"] != otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP")
        
    # Valid OTP, cleanup
    del store[number]
    save_otp_store(store)

    # 2. Check for existing users
    user_by_email = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user_by_email:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user_by_phone = db.query(models.User).filter(models.User.whatsapp_number == number).first()
    if user_by_phone:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    user = models.User(
        email=user_in.email,
        hashed_password=security.get_password_hash(user_in.password),
        role=user_in.role,
        whatsapp_number=user_in.whatsapp_number,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Send Welcome Email & WhatsApp asynchronously
    background_tasks.add_task(send_welcome_email, user.email)
    if user.whatsapp_number:
        from app.utils.whatsapp import send_welcome_whatsapp
        background_tasks.add_task(send_welcome_whatsapp, user.whatsapp_number, user.email.split('@')[0])
    
    return user

@router.get("/me", response_model=schemas.User)
def read_users_me(
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user
