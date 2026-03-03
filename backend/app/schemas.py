from typing import Optional, List
from pydantic import BaseModel, EmailStr
from app.models import UserRole, MembershipType, PaymentStatus, VerificationStatus
from datetime import datetime

# Shared Properties
class UserBase(BaseModel):
    email: EmailStr
    role: UserRole = UserRole.Customer
    is_active: bool = True
    whatsapp_number: Optional[str] = None

class UserCreate(UserBase):
    password: str
    whatsapp_number: str # Mandatory for signup

class UserInDBBase(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class User(UserInDBBase):
    pass

# Gym Schemas
class GymBase(BaseModel):
    name: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    amenities: Optional[str] = None
    photos: Optional[str] = None

class GymCreate(GymBase):
    owner_id: int

class GymInDBBase(GymBase):
    id: int
    owner_id: int
    verification_status: VerificationStatus
    created_at: datetime
    
    class Config:
        from_attributes = True

class Gym(GymInDBBase):
    pass

class GymPrivateDetails(Gym):
    contact_phone: Optional[str] = None
    manager_name: Optional[str] = None
    maps_url: Optional[str] = None
    
# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class BookingRevealResponse(BaseModel):
    booking_id: int
    gym_name: str
    pass_type: str
    date_str: str
    otp: str
    contact_phone: Optional[str] = None
    manager_name: Optional[str] = None
    maps_url: Optional[str] = None

# Membership Schemas
class MembershipBase(BaseModel):
    type: MembershipType
    price: float
    description: Optional[str] = None
    gym_id: int

class Membership(MembershipBase):
    id: int
    
    class Config:
        from_attributes = True
