from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone

from app import models, schemas
from app.api import deps

router = APIRouter()

# Schema for creating a booking (Since we didn't add it to schemas.py yet)
class BookingCreate(BaseModel):
    gym_id: int
    membership_id: int
    start_date: datetime
    end_date: datetime
    promo_code: Optional[str] = None
    final_amount: Optional[float] = None

@router.post("/")
def create_booking(
    *,
    db: Session = Depends(deps.get_db),
    booking_in: BookingCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
    background_tasks: BackgroundTasks,
) -> Any:
    """
    Create a new booking and Instantly activate (Pay-at-Gym Model).
    """
    # Verify Gym and Membership exist
    gym = db.query(models.Gym).filter(models.Gym.id == booking_in.gym_id).first()
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
        
    membership = db.query(models.Membership).filter(models.Membership.id == booking_in.membership_id).first()
    if not membership or membership.gym_id != gym.id:
        raise HTTPException(status_code=400, detail="Invalid membership for this gym")
        
    import random
    
    booking = models.Booking(
        user_id=current_user.id,
        gym_id=gym.id,
        membership_id=membership.id,
        start_date=booking_in.start_date,
        end_date=booking_in.end_date,
        payment_status=models.PaymentStatus.Completed, # Instant activation for Pay-At-Gym Cash Model
        otp=f"{random.randint(1000, 9999)}",
        promo_code=booking_in.promo_code,
        final_amount=booking_in.final_amount
    )
    db.add(booking)
    db.commit()
    db.refresh(booking)
    # OMNICHANNEL TRIGGERS (Phase 16 & 17 - Pay At Gym Model)
    from app.utils.email import send_first_booking_email, send_booking_confirmation_email
    from app.utils.whatsapp import send_first_booking_whatsapp, send_booking_confirmation_whatsapp
    
    user_name = current_user.email.split('@')[0]
    gym_name = booking.gym.name
    pass_type = booking.membership.type.value
    date_str = booking.start_date.strftime("%Y-%m-%d %I:%M %p")
    
    # 1. First Booking Magic
    booking_count = db.query(models.Booking).filter(models.Booking.user_id == current_user.id, models.Booking.payment_status == models.PaymentStatus.Completed).count()
    if booking_count == 1:
        background_tasks.add_task(send_first_booking_email, current_user.email, user_name, gym_name)
        if current_user.whatsapp_number:
            background_tasks.add_task(send_first_booking_whatsapp, current_user.whatsapp_number, user_name, gym_name)

    # 2. Transactional Confirmation (Phase 17 Premium PDF Vouchers)
    from app.utils.pdf_generator import generate_premium_voucher
    pdf_bytes = generate_premium_voucher(str(booking.id), user_name, gym_name, pass_type, date_str, booking.otp)
    
    background_tasks.add_task(send_booking_confirmation_email, current_user.email, gym_name, booking.otp, pass_type, date_str, pdf_bytes)
    
    if current_user.whatsapp_number:
        mock_pdf_url = f"https://passfit.in/vouchers/{booking.id}.pdf"
        background_tasks.add_task(send_booking_confirmation_whatsapp, current_user.whatsapp_number, gym_name, booking.otp, pass_type, mock_pdf_url)

    return {
        "status": "success", 
        "booking_id": booking.id, 
        "payment_status": booking.payment_status
    }

class PaymentVerification(BaseModel):
    razorpay_payment_id: str
    razorpay_order_id: str
    razorpay_signature: str

@router.post("/{booking_id}/verify-payment")
def verify_payment(
    booking_id: int,
    payment_info: PaymentVerification,
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Verify payment signature and activate booking.
    """
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking or booking.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found")
        
    # Mock Verification logic 
    if "mock" in payment_info.razorpay_order_id:
        booking.payment_status = models.PaymentStatus.Completed
        db.commit()
        db.refresh(booking)

        # OMNICHANNEL TRIGGERS (Phase 16)
        from app.utils.email import send_first_booking_email, send_booking_confirmation_email
        from app.utils.whatsapp import send_first_booking_whatsapp, send_booking_confirmation_whatsapp
        
        user_name = current_user.email.split('@')[0]
        gym_name = booking.gym.name
        pass_type = booking.membership.type.value
        date_str = booking.start_date.strftime("%Y-%m-%d %I:%M %p")
        
        # 1. First Booking Magic
        booking_count = db.query(models.Booking).filter(models.Booking.user_id == current_user.id, models.Booking.payment_status == models.PaymentStatus.Completed).count()
        if booking_count == 1:
            background_tasks.add_task(send_first_booking_email, current_user.email, user_name, gym_name)
            if current_user.whatsapp_number:
                background_tasks.add_task(send_first_booking_whatsapp, current_user.whatsapp_number, user_name, gym_name)

        # 2. Transactional Confirmation (Phase 17 Premium PDF Vouchers)
        from app.utils.pdf_generator import generate_premium_voucher
        pdf_bytes = generate_premium_voucher(str(booking.id), user_name, gym_name, pass_type, date_str, booking.otp)
        
        background_tasks.add_task(send_booking_confirmation_email, current_user.email, gym_name, booking.otp, pass_type, date_str, pdf_bytes)
        
        if current_user.whatsapp_number:
            mock_pdf_url = f"https://passfit.in/vouchers/{booking.id}.pdf"
            background_tasks.add_task(send_booking_confirmation_whatsapp, current_user.whatsapp_number, gym_name, booking.otp, pass_type, mock_pdf_url)

        return {"status": "success", "booking_id": booking.id, "payment_status": booking.payment_status}
    
    raise HTTPException(status_code=400, detail="Invalid payment signature")

@router.get("/{booking_id}/reveal", response_model=schemas.BookingRevealResponse)
def get_booking_reveal(
    booking_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Securely reveal the Entry OTP and private Gym Contact details ONLY if the user has a completed booking.
    """
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking or booking.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found or unauthorized")
        
    if booking.payment_status != models.PaymentStatus.Completed:
        raise HTTPException(status_code=403, detail="Payment not completed")
        
    gym = booking.gym
    return schemas.BookingRevealResponse(
        booking_id=booking.id,
        gym_name=gym.name,
        pass_type=booking.membership.type.value,
        date_str=booking.start_date.strftime("%Y-%m-%d %I:%M %p"),
        otp=booking.otp,
        contact_phone=gym.contact_phone,
        manager_name=gym.manager_name,
        maps_url=gym.maps_url
    )

@router.post("/cron/abandoned-carts")
def process_abandoned_carts(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    CRON JOB Endpoint: Finds bookings in 'Pending' payment status that are older than 30 minutes
    and sends them a WhatsApp reminder + 5% discount code.
    """
    thirty_mins_ago = datetime.now(timezone.utc) - timedelta(minutes=30)
    
    abandoned_bookings = db.query(models.Booking).filter(
        models.Booking.payment_status == models.PaymentStatus.Pending,
        models.Booking.reminder_sent == False,
        models.Booking.created_at <= thirty_mins_ago
    ).all()
    
    reminders_sent = 0
    for booking in abandoned_bookings:
        # User details needed to send msg
        user = db.query(models.User).filter(models.User.id == booking.user_id).first()
        gym = db.query(models.Gym).filter(models.Gym.id == booking.gym_id).first()
        
        if user and gym:
            # Mock WhatsApp Notification Trigger
            print(f"[WhatsApp MSG Sent to {user.email}]")
            print(f"Hi! You left a pass waiting at {gym.name}. Complete your booking now and get 5% OFF with code: GETFIT5")
            
            # Update DB to prevent duplicate messages
            booking.reminder_sent = True
            reminders_sent += 1
            
    if reminders_sent > 0:
        db.commit()
        
    return {
        "status": "success",
        "abandoned_carts_processed": reminders_sent,
        "message": f"Sent {reminders_sent} reminder(s)."
    }

@router.post("/cron/post-workout")
def process_post_workout_checkins(
    background_tasks: BackgroundTasks,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    CRON JOB Endpoint: Finds bookings that ended ~2 hours ago, and sends a review request.
    Mocking this logic for now by just grabbing any completed booking from today that hasn't been asked yet.
    """
    # Simply grabbing recent bookings to demonstrate flow
    two_hours_ago = datetime.now(timezone.utc) - timedelta(hours=2)
    
    # Assuming we add a `review_requested` column later. For now we will just log it for any booking ending around now.
    completed_bookings = db.query(models.Booking).filter(
        models.Booking.payment_status == models.PaymentStatus.Completed,
        models.Booking.end_date <= two_hours_ago
    ).limit(5).all()
    
    from app.utils.whatsapp import send_post_workout_checkin_whatsapp
    
    messages_sent = 0
    for booking in completed_bookings:
        user = db.query(models.User).filter(models.User.id == booking.user_id).first()
        if user and user.whatsapp_number:
            background_tasks.add_task(send_post_workout_checkin_whatsapp, user.whatsapp_number, booking.gym.name)
            messages_sent += 1
            
    return {
        "status": "success",
        "post_workout_messages_sent": messages_sent
    }

from fastapi.responses import Response

@router.get("/{booking_id}/voucher")
def download_voucher(
    booking_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Generate and stream the premium PDF voucher for a completed booking.
    """
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking or booking.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found or unauthorized")
        
    if booking.payment_status != models.PaymentStatus.Completed:
        raise HTTPException(status_code=403, detail="Payment not completed")
        
    user_name = current_user.email.split('@')[0]
    gym_name = booking.gym.name
    pass_type = booking.membership.type.value
    date_str = booking.start_date.strftime("%Y-%m-%d %I:%M %p")
    
    from app.utils.pdf_generator import generate_premium_voucher
    pdf_bytes = generate_premium_voucher(str(booking.id), user_name, gym_name, pass_type, date_str, booking.otp)
    
    return Response(
        content=pdf_bytes, 
        media_type="application/pdf", 
        headers={"Content-Disposition": f"attachment; filename=PASSFIT-{booking.id}.pdf"}
    )

