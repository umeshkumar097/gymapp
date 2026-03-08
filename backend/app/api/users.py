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
    
    # Calculate Profile Completion %
    fields_to_check = [current_user.full_name, current_user.email, current_user.whatsapp_number, current_user.gender, current_user.body_weight, current_user.profile_picture_url]
    filled_fields = sum(1 for field in fields_to_check if field is not None and str(field).strip() != "")
    completion_percentage = int((filled_fields / len(fields_to_check)) * 100)
            
    return {
        "user_profile": {
            "name": current_user.full_name or current_user.email.split('@')[0], # Fallback to email prefix
            "full_name": current_user.full_name,
            "email": current_user.email,
            "whatsapp_number": current_user.whatsapp_number,
            "gender": current_user.gender,
            "body_weight": current_user.body_weight,
            "profile_picture_url": current_user.profile_picture_url,
            "completion_percentage": completion_percentage,
            "fitcoins": current_user.fitcoins or 0,
            "flexi_credits": current_user.flexi_credits or 0,
            "referral_code": current_user.referral_code,
            "workout_streak": current_user.workout_streak or 0
        },
        "active_pass": active_booking,
        "history": history
    }

@router.put("/me/profile")
def update_user_profile(
    payload: schemas.UserProfileUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update the current user's profile details
    """
    if payload.full_name is not None: current_user.full_name = payload.full_name
    if payload.gender is not None: current_user.gender = payload.gender
    if payload.body_weight is not None: current_user.body_weight = payload.body_weight
    if payload.profile_picture_url is not None: current_user.profile_picture_url = payload.profile_picture_url
    
    db.commit()
    db.refresh(current_user)
    
    return {"status": "success", "message": "Profile updated successfully"}

@router.post("/tickets")
def create_support_ticket(
    payload: schemas.TicketCreate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create a new support dispute ticket (e.g. Gym Denied Entry)
    """
    ticket = models.SupportTicket(
        user_id=current_user.id,
        booking_id=payload.booking_id,
        subject=payload.subject,
        description=payload.description
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    
    return {"status": "success", "ticket_id": ticket.id}

@router.get("/tickets")
def get_support_tickets(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all support dispute tickets created by the user
    """
    tickets = db.query(models.SupportTicket).filter(models.SupportTicket.user_id == current_user.id).order_by(models.SupportTicket.created_at.desc()).all()
    return tickets

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
