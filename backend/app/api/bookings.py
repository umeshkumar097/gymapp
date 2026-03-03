from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from pydantic import BaseModel

from app import models, schemas
from app.api import deps

router = APIRouter()

# Schema for creating a booking
class BookingCreate(BaseModel):
    gym_id: int
    membership_id: int
    start_date: datetime
    end_date: datetime
    promo_code: Optional[str] = None
    final_amount: Optional[float] = None
    
    # Phase 20: Guest Bookings and Flexi-Credit Payment
    guest_name: Optional[str] = None
    guest_phone: Optional[str] = None
    use_flexi_credits: Optional[bool] = False

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
    
    payment_status = models.PaymentStatus.Completed
    
    # Phase 20: Pay With Universal Credits
    if booking_in.use_flexi_credits:
        if current_user.flexi_credits < 1:
            raise HTTPException(status_code=400, detail="Insufficient Flexi-Credits. Please top up your Universal Wallet.")
        current_user.flexi_credits -= 1
        db.add(current_user)
        # We consider a credit consumption as a completed payment immediately
    
    booking = models.Booking(
        user_id=current_user.id,
        gym_id=gym.id,
        membership_id=membership.id,
        start_date=booking_in.start_date,
        end_date=booking_in.end_date,
        payment_status=payment_status,
        otp=f"{random.randint(1000, 9999)}",
        promo_code=booking_in.promo_code,
        final_amount=booking_in.final_amount if not booking_in.use_flexi_credits else 0.0,
        guest_name=booking_in.guest_name,
        guest_phone=booking_in.guest_phone
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

    # 3. +1 Guest Buddy Invite
    if booking.guest_name and booking.guest_phone:
        # Note: True email/WA payload would customize the text specifically for a "Buddy" joining them today
        if current_user.whatsapp_number:
            mock_pdf_url = f"https://passfit.in/vouchers/{booking.id}.pdf"
            background_tasks.add_task(send_booking_confirmation_whatsapp, booking.guest_phone, gym_name, booking.otp, f"Buddy Pass with {user_name}", mock_pdf_url)

    return {
        "status": "success", 
        "booking_id": booking.id, 
        "payment_status": booking.payment_status,
        "used_credit": booking_in.use_flexi_credits
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

class RescheduleRequest(BaseModel):
    new_start_date: datetime
    new_end_date: datetime

@router.post("/{booking_id}/reschedule")
def reschedule_booking(
    booking_id: int,
    reschedule_in: RescheduleRequest,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Phase 20: Allow users to reschedule an active booking before its end_date.
    Users can only reschedule a maximum of 2 times.
    """
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking or booking.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found or unauthorized")
        
    if booking.payment_status != models.PaymentStatus.Completed:
        raise HTTPException(status_code=400, detail="Cannot reschedule a pending or failed booking")
        
    if booking.is_cancelled:
        raise HTTPException(status_code=400, detail="Cannot reschedule a cancelled booking")
        
    now = datetime.now(timezone.utc)
    # Convert naive Booking datetime to aware for comparison if needed
    b_end = booking.end_date if booking.end_date.tzinfo else booking.end_date.replace(tzinfo=timezone.utc)
    if b_end < now:
        raise HTTPException(status_code=400, detail="Booking has already expired. Cannot reschedule.")
        
    if booking.reschedule_count >= 2:
        raise HTTPException(status_code=400, detail="Maximum reschedule limit (2) reached.")
        
    booking.start_date = reschedule_in.new_start_date
    booking.end_date = reschedule_in.new_end_date
    booking.reschedule_count += 1
    db.commit()
    db.refresh(booking)
    
    return {
        "status": "success",
        "message": f"Successfully rescheduled. (Rescheduled {booking.reschedule_count}/2 times)",
        "new_start_date": booking.start_date,
        "new_end_date": booking.end_date
    }

@router.post("/{booking_id}/cancel")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Phase 20: Allow users to self-cancel an active booking.
    Refunds/Credits logic would be handled by a BackgroundTask interacting with PG/Wallet.
    """
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking or booking.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Booking not found or unauthorized")
        
    if booking.is_cancelled:
        raise HTTPException(status_code=400, detail="Booking is already cancelled.")
        
    now = datetime.now(timezone.utc)
    b_start = booking.start_date if booking.start_date.tzinfo else booking.start_date.replace(tzinfo=timezone.utc)
    
    # Simple logic: can auto-cancel if it hasn't technically started yet + 1 hr buffer.
    if now > (b_start + timedelta(hours=1)):
        raise HTTPException(status_code=400, detail="Too late to self-cancel. Please contact support.")
        
    booking.is_cancelled = True
    db.commit()
    
    # In a real app, you would add `current_user.corporate_wallet_balance += booking.final_amount` or trigger Razorpay Refunds here.
    
    return {
        "status": "success",
        "message": "Booking has been cancelled successfully."
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

