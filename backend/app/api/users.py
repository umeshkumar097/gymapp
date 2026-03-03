from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.api import deps

router = APIRouter()

@router.get("/me/bookings")
def read_user_bookings(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user's bookings.
    """
    bookings = db.query(models.Booking).filter(models.Booking.user_id == current_user.id).all()
    # Simple formatting for the UI
    result = []
    for b in bookings:
        gym = db.query(models.Gym).filter(models.Gym.id == b.gym_id).first()
        mem = db.query(models.Membership).filter(models.Membership.id == b.membership_id).first()
        result.append({
            "id": b.id,
            "start_date": b.start_date,
            "end_date": b.end_date,
            "status": b.payment_status,
            "gym_name": gym.name if gym else "Unknown",
            "gym_location": gym.location if gym else "Unknown",
            "membership_type": mem.type.value if mem else "Unknown"
        })
    return result

@router.get("/me/dashboard")
def read_user_dashboard(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get comprehensive dashboard data for Phase 15.
    """
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    
    bookings = db.query(models.Booking).filter(
        models.Booking.user_id == current_user.id,
        models.Booking.payment_status == models.PaymentStatus.Completed
    ).order_by(models.Booking.start_date.desc()).all()
    
    active_booking = None
    history = []
    
    for b in bookings:
        gym = db.query(models.Gym).filter(models.Gym.id == b.gym_id).first()
        mem = db.query(models.Membership).filter(models.Membership.id == b.membership_id).first()
        
        # Check if active (validity ends in the future)
        is_active = b.end_date > now
        status = "Active" if is_active else "Used"
        
        booking_data = {
            "id": b.id,
            "gym_id": gym.id if gym else None,
            "gym_name": gym.name if gym else "Unknown Gym",
            "gym_location": gym.location if gym else "Unknown Location",
            "pass_type": mem.type.value if mem else "Pass",
            "date_str": b.start_date.strftime("%b %d, %Y"),
            "valid_until": b.end_date.strftime("%b %d, %Y - %I:%M %p"),
            "status": "Cancelled" if b.is_cancelled else status,
            "otp": b.otp if (is_active and not b.is_cancelled) else None,
            "is_cancelled": b.is_cancelled,
            "reschedule_count": getattr(b, "reschedule_count", 0)
        }
        
        if is_active and not active_booking:
            active_booking = booking_data
        else:
            history.append(booking_data)
            
    # Auto-generate a referral code if missing
    if not current_user.referral_code:
        import uuid
        current_user.referral_code = f"FIT-{str(uuid.uuid4())[:8].upper()}"
        db.commit()
            
    return {
        "user_profile": {
            "name": current_user.email.split('@')[0],
            "email": current_user.email,
            "whatsapp_number": current_user.whatsapp_number,
            "fitcoins": current_user.fitcoins or 0,
            "flexi_credits": current_user.flexi_credits or 0,
            "referral_code": current_user.referral_code
        },
        "active_pass": active_booking,
        "history": history
    }

@router.post("/buy-flexi-credits")
def buy_flexi_credits(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Mock endpoint to purchase 1 Universal Pass (Flexi-Credit) for demonstration.
    In production, this would integrate with Razorpay/Stripe first.
    """
    current_user.flexi_credits += 1
    db.commit()
    db.refresh(current_user)
    
    return {
        "status": "success",
        "message": "1 Universal Credit added to your wallet!",
        "new_balance": current_user.flexi_credits
    }
