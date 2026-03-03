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

@router.get("/growth/metrics")
def get_growth_metrics(db: Session = Depends(get_db), admin: User = Depends(get_godeye_admin)):
    """Fetch total platform liability for FitCoins and Flexi-Credits."""
    total_fitcoins = db.query(func.sum(User.fitcoins)).scalar() or 0
    total_flexi_credits = db.query(func.sum(User.flexi_credits)).scalar() or 0
    total_corporate_wallet = db.query(func.sum(User.corporate_wallet_balance)).scalar() or 0.0

    top_fitcoin_users = db.query(User).filter(User.fitcoins > 0).order_by(User.fitcoins.desc()).limit(10).all()

    return {
        "liability": {
            "total_fitcoins": int(total_fitcoins),
            "total_flexi_credits": int(total_flexi_credits),
            "total_corporate_wallet": float(total_corporate_wallet)
        },
        "top_users": [
            {
                "id": u.id,
                "name": u.name if hasattr(u, "name") else u.email,
                "email": u.email,
                "fitcoins": u.fitcoins
            } for u in top_fitcoin_users
        ]
    }

@router.get("/growth/b2b")
def get_b2b_accounts(db: Session = Depends(get_db), admin: User = Depends(get_godeye_admin)):
    """Fetch all users who are marked as Corporate HR/B2B (have a company_name)."""
    b2b_users = db.query(User).filter(User.company_name.isnot(None), User.company_name != "").all()
    return [
        {
            "id": u.id,
            "name": u.name if hasattr(u, "name") else u.email,
            "email": u.email,
            "company_name": u.company_name,
            "corporate_wallet_balance": u.corporate_wallet_balance,
            "flexi_credits": u.flexi_credits
        } for u in b2b_users
    ]

class FundB2BRequest(BaseModel):
    user_email: str
    company_name: str
    flexi_credits_to_add: int

@router.post("/growth/b2b/fund")
def fund_b2b_account(req: FundB2BRequest, db: Session = Depends(get_db), admin: User = Depends(get_godeye_admin)):
    """Convert a user into a B2B partner and fund them with bulk Flexi-Credits."""
    user = db.query(User).filter(User.email == req.user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found with this email.")
    
    user.company_name = req.company_name
    user.flexi_credits += req.flexi_credits_to_add
    db.commit()
    
    return {
        "message": f"Successfully funded {req.company_name} account ({user.email}) with {req.flexi_credits_to_add} Flexi-Credits."
    }


