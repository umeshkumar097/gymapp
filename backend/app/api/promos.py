from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import models, schemas
from app.api import deps
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class PromoCodeVerifyRequest(BaseModel):
    code: str

class PromoCodeVerifyResponse(BaseModel):
    is_valid: bool
    discount_percentage: float
    message: str

@router.post("/verify", response_model=PromoCodeVerifyResponse)
def verify_promo(
    verify_in: PromoCodeVerifyRequest,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Verify a promo code and get its discount percentage.
    """
    # Force uppercase for matching
    code_str = verify_in.code.strip().upper()
    
    promo = db.query(models.PromoCode).filter(models.PromoCode.code == code_str).first()
    
    if not promo:
        return {"is_valid": False, "discount_percentage": 0, "message": "Invalid promo code"}
        
    if not promo.is_active:
        return {"is_valid": False, "discount_percentage": 0, "message": "Promo code is inactive or expired"}
        
    if promo.max_uses is not None and promo.current_uses >= promo.max_uses:
        return {"is_valid": False, "discount_percentage": 0, "message": "Promo code usage limit reached"}
        
    return {
        "is_valid": True,
        "discount_percentage": promo.discount_percentage,
        "message": "Promo code applied successfully"
    }

# Admin Routes for Promos
class PromoCodeCreate(BaseModel):
    code: str
    discount_percentage: float
    max_uses: Optional[int] = None

class PromoCodeResponse(PromoCodeCreate):
    id: int
    current_uses: int
    is_active: bool

    class Config:
        from_attributes = True

@router.get("/admin", response_model=List[PromoCodeResponse])
def get_all_promos(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get all promo codes (Admin only)
    """
    if current_user.role != models.UserRole.Admin:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    promos = db.query(models.PromoCode).order_by(models.PromoCode.id.desc()).all()
    return promos

@router.post("/admin", response_model=PromoCodeResponse)
def create_promo(
    promo_in: PromoCodeCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Create a new promo code (Admin only)
    """
    if current_user.role != models.UserRole.Admin:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    code_str = promo_in.code.strip().upper()
    existing = db.query(models.PromoCode).filter(models.PromoCode.code == code_str).first()
    if existing:
        raise HTTPException(status_code=400, detail="Promo code already exists")
        
    promo = models.PromoCode(
        code=code_str,
        discount_percentage=promo_in.discount_percentage,
        max_uses=promo_in.max_uses,
        is_active=True
    )
    db.add(promo)
    db.commit()
    db.refresh(promo)
    return promo

@router.patch("/admin/{promo_id}/toggle", response_model=PromoCodeResponse)
def toggle_promo(
    promo_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Enable/disable promo code
    """
    if current_user.role != models.UserRole.Admin:
        raise HTTPException(status_code=403, detail="Not authorized")
        
    promo = db.query(models.PromoCode).filter(models.PromoCode.id == promo_id).first()
    if not promo:
        raise HTTPException(status_code=404, detail="Promo code not found")
        
    promo.is_active = not promo.is_active
    db.commit()
    db.refresh(promo)
    return promo
