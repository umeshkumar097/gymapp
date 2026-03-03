from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from typing import List

from app.db.database import get_db
from app.models import User, Booking, Gym, Review, SupportTicket, CommunicationLog
from app.api.auth import get_current_user

router = APIRouter()

def get_godeye_admin(current_user: User = Depends(get_current_user)):
    """GodEye strict authorization"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="GodEye Security Clearance Required.")
    return current_user

@router.get("/live-feed")
def get_live_operations_feed(db: Session = Depends(get_db), admin: User = Depends(get_godeye_admin)):
    """
    Returns live marketplace operations data:
    Active passes, OTP failures, NO-SHOWs, and daily gross revenue.
    """
    today = datetime.utcnow().date()
    
    active_passes = db.query(Booking).filter(
        func.date(Booking.start_date) == today,
        Booking.payment_status == 'Completed',
        Booking.is_cancelled == False
    ).count()

    verified_passes = db.query(Booking).filter(
        func.date(Booking.start_date) == today,
        Booking.status == 'Used'
    ).count()

    no_shows = db.query(Booking).filter(
        func.date(Booking.end_date) < datetime.utcnow(),
        Booking.status == 'Active'
    ).count()

    revenue_query = db.query(func.sum(Booking.final_amount)).filter(
        func.date(Booking.created_at) == today,
        Booking.payment_status == 'Completed'
    ).scalar()
    gross_revenue = float(revenue_query or 0.0)

    recent_bookings = db.query(Booking).order_by(Booking.created_at.desc()).limit(20).all()

    return {
        "metrics": {
            "active_passes": active_passes,
            "verified_passes": verified_passes,
            "no_shows": no_shows,
            "gross_revenue": gross_revenue,
            "failed_otps_today": 0
        },
        "live_feed": [
            {
                "id": b.id,
                "user_name": b.user.name if b.user else "Unknown",
                "gym_name": b.gym.name if b.gym else "Unknown",
                "status": b.status,
                "is_cancelled": b.is_cancelled,
                "amount": float(b.final_amount) if b.final_amount else 0.0,
                "created_at": b.created_at.isoformat()
            } for b in recent_bookings
        ]
    }

@router.get("/tickets")
def get_all_support_tickets(db: Session = Depends(get_db), admin: User = Depends(get_godeye_admin)):
    """Fetch all support tickets globally for the Super Admin."""
    tickets = db.query(SupportTicket).order_by(SupportTicket.created_at.desc()).all()
    return [
        {
            "id": t.id,
            "user_id": t.user_id,
            "user_name": t.user.name if t.user else "Unknown",
            "gym_id": t.gym_id,
            "gym_name": t.gym.name if t.gym else None,
            "booking_id": t.booking_id,
            "issue_type": t.issue_type,
            "description": t.description,
            "status": t.status,
            "resolution_notes": t.resolution_notes,
            "created_at": t.created_at.isoformat(),
            "updated_at": t.updated_at.isoformat() if t.updated_at else None
        } for t in tickets
    ]

from pydantic import BaseModel

class TicketResolveRequest(BaseModel):
    resolution_notes: str
    action: str  # e.g., "refund", "grant_fitcoins", "none"
    fitcoins_amount: int = 0

@router.post("/tickets/{ticket_id}/resolve")
def resolve_support_ticket(
    ticket_id: int, 
    req: TicketResolveRequest, 
    db: Session = Depends(get_db), 
    admin: User = Depends(get_godeye_admin)
):
    """Resolve a ticket, optionally granting FitCoins as compensation."""
    ticket = db.query(SupportTicket).filter(SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
        
    if ticket.status == "Resolved":
        raise HTTPException(status_code=400, detail="Ticket is already resolved.")

    ticket.status = "Resolved"
    ticket.resolution_notes = req.resolution_notes
    ticket.updated_at = datetime.utcnow()

    action_msg = "Ticket resolved."

    if req.action == "grant_fitcoins" and req.fitcoins_amount > 0 and ticket.user:
        ticket.user.fitcoins += req.fitcoins_amount
        action_msg = f"Ticket resolved. {req.fitcoins_amount} FitCoins credited to user."
    elif req.action == "refund" and ticket.booking:
        ticket.booking.payment_status = "Refunded"
        action_msg = "Ticket resolved. Booking marked as Refunded (Mock)."

    db.commit()
    return {"message": action_msg}

