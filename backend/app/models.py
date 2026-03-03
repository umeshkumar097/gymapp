import enum
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Enum, DateTime, Text, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class UserRole(enum.Enum):
    Admin = "Admin"
    GymOwner = "GymOwner"
    Customer = "Customer"

class OnboardingStatus(enum.Enum):
    NotStarted = "NotStarted"
    PendingFee = "PendingFee"
    FeePaid = "FeePaid"
    InspectionScheduled = "InspectionScheduled"
    Verified = "Verified"

class MembershipType(enum.Enum):
    DayPass = "DayPass"
    Monthly = "Monthly"
    Quarterly = "Quarterly"

class PaymentStatus(enum.Enum):
    Pending = "Pending"
    Completed = "Completed"
    Failed = "Failed"

class VerificationStatus(enum.Enum):
    Pending = "Pending"
    Verified = "Verified"
    Rejected = "Rejected"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.Customer, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Omnichannel specific
    whatsapp_number = Column(String, nullable=True) 
    
    # Gym Owner Specific
    onboarding_status = Column(Enum(OnboardingStatus, native_enum=False), default=None, nullable=True)
    
    # Corporate B2B2C Specific
    company_name = Column(String, nullable=True) # If true, indicates a Corporate HR account or employee
    corporate_wallet_balance = Column(Float, default=0.0) # Credits for booking gyms

    # Phase 15: Gamification & Loyalty
    fitcoins = Column(Integer, default=0)
    referral_code = Column(String, unique=True, index=True, nullable=True)
    
    # Phase 20: Universal Pass Flexi-Credits
    flexi_credits = Column(Integer, default=0)
    
    gyms = relationship("Gym", back_populates="owner")
    bookings = relationship("Booking", back_populates="user")
    reviews = relationship("Review", back_populates="user")

class Gym(Base):
    __tablename__ = "gyms"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, index=True, nullable=False)
    location = Column(String, nullable=False) # e.g., Address
    latitude = Column(Float, nullable=True) # for geolocation search
    longitude = Column(Float, nullable=True) # for geolocation search
    amenities = Column(Text, nullable=True) # comma separated or JSON string
    photos = Column(Text, nullable=True) # comma separated URLs
    
    # Anti-Leakage Phase 17 Fields
    contact_phone = Column(String, nullable=True)
    manager_name = Column(String, nullable=True)
    maps_url = Column(String, nullable=True)
    
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.Pending)
    trial_start_date = Column(DateTime(timezone=True), nullable=True)
    trial_end_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    owner = relationship("User", back_populates="gyms")
    memberships = relationship("Membership", back_populates="gym")
    bookings = relationship("Booking", back_populates="gym")
    reviews = relationship("Review", back_populates="gym")

class Membership(Base):
    __tablename__ = "memberships"

    id = Column(Integer, primary_key=True, index=True)
    gym_id = Column(Integer, ForeignKey("gyms.id"))
    type = Column(Enum(MembershipType), nullable=False)
    price = Column(Float, nullable=False)
    description = Column(String, nullable=True)
    
    gym = relationship("Gym", back_populates="memberships")
    bookings = relationship("Booking", back_populates="membership")

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    gym_id = Column(Integer, ForeignKey("gyms.id"))
    membership_id = Column(Integer, ForeignKey("memberships.id"))
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.Pending)
    otp = Column(String(4), nullable=True) # 4-digit secure PIN for verification
    reminder_sent = Column(Boolean, default=False) # For tracking Abandoned Carts
    
    # Pricing & Discounts (Phase 19)
    promo_code = Column(String, nullable=True)
    final_amount = Column(Float, nullable=True) # Cash amount after discounts and GST
    
    # Phase 20: Retention & Flexibility
    guest_name = Column(String, nullable=True)
    guest_phone = Column(String, nullable=True)
    reschedule_count = Column(Integer, default=0)
    is_cancelled = Column(Boolean, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="bookings")
    gym = relationship("Gym", back_populates="bookings")
    membership = relationship("Membership", back_populates="bookings")

class PromoCode(Base):
    __tablename__ = "promo_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    discount_percentage = Column(Float, nullable=False) # e.g., 10 for 10%
    max_uses = Column(Integer, nullable=True) # Null means infinite uses
    current_uses = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    gym_id = Column(Integer, ForeignKey("gyms.id"))
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="reviews")
    gym = relationship("Gym", back_populates="reviews")
    booking = relationship("Booking")

# ---------------------------------------------------------------------------
# PHASE 21: GODEYE SUPER ADMIN DASHBOARD MODELS
# ---------------------------------------------------------------------------

class TicketStatus(enum.Enum):
    Open = "Open"
    InProgress = "InProgress"
    Resolved = "Resolved"
    Closed = "Closed"

class SupportTicket(Base):
    """Tracks customer disputes (e.g., gym denied entry) for admin resolution."""
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True) # Optional link to specific pass
    subject = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    status = Column(Enum(TicketStatus), default=TicketStatus.Open, nullable=False)
    admin_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    user = relationship("User")
    booking = relationship("Booking")

class CommunicationLog(Base):
    """Records delivery success of omnichannel messages (WhatsApp/Email) per booking."""
    __tablename__ = "communication_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    channel = Column(String, nullable=False) # e.g., "WhatsApp", "Email", "SMS"
    message_type = Column(String, nullable=False) # e.g., "Welcome", "Booking Confirmation", "Review Request"
    status = Column(String, nullable=False) # e.g., "Delivered", "Failed", "Pending"
    error_message = Column(Text, nullable=True)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User")
    booking = relationship("Booking")

class PlatformConfig(Base):
    """Global platform settings managed by Super Admin (e.g., Surge Pricing Multipliers)"""
    __tablename__ = "platform_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, index=True, nullable=False) # e.g., "GLOBAL_SURGE_MULTIPLIER"
    value = Column(String, nullable=False) # Stored as string, casted dynamically
    description = Column(String, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
