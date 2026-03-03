from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
import math

from app import models, schemas
from app.api import deps

router = APIRouter()

@router.get("/search", response_model=List[schemas.Gym])
def search_gyms(
    db: Session = Depends(deps.get_db),
    keyword: Optional[str] = Query(None, description="Search by name or location/city"),
    amenities: Optional[str] = Query(None, description="Comma separated amenities like AC,Cardio"),
    min_rating: Optional[float] = Query(None),
    lat: Optional[float] = Query(None, description="User latitude for distance sorting"),
    lng: Optional[float] = Query(None, description="User longitude for distance sorting"),
    limit: int = 20,
) -> Any:
    """
    Search gyms by location, keyword, or amenities.
    """
    query = db.query(models.Gym).filter(models.Gym.verification_status == models.VerificationStatus.Verified)
    
    if keyword:
        search_filter = or_(
            models.Gym.name.ilike(f"%{keyword}%"),
            models.Gym.location.ilike(f"%{keyword}%")
        )
        query = query.filter(search_filter)
        
    if amenities:
        amenity_list = [a.strip() for a in amenities.split(",")]
        # Simple text matching for amenities for the MVP
        for a in amenity_list:
             query = query.filter(models.Gym.amenities.ilike(f"%{a}%"))
             
    # Very basic geo-sorting (Euclidean distance approximation for MVP)
    # In production, use PostGIS ST_Distance.
    if lat is not None and lng is not None:
        # Sort by distance (if gym has coordinates)
        # Note: If coordinates are null, they might be sorted weirdly, but for MVP we assume some have coords or we nulls_last.
        query = query.order_by((models.Gym.latitude.isnot(None)).desc())
        
    gyms = query.limit(limit).all()
    
    # Sort in python if needed because SQLite/basic SQL doesn't have an easy math formula without custom functions
    if lat is not None and lng is not None:
        def get_dist(g):
            if g.latitude is None or g.longitude is None:
                return 999999
            return math.hypot(g.latitude - lat, g.longitude - lng)
        gyms.sort(key=get_dist)
        
    return gyms

@router.get("/{gym_id}", response_model=schemas.Gym)
def get_gym(
    gym_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific gym by ID.
    """
    gym = db.query(models.Gym).filter(models.Gym.id == gym_id).first()
    if not gym:
        raise HTTPException(status_code=404, detail="Gym not found")
    return gym

# Basic schema for returning a gym with its plans
class GymWithMemberships(schemas.Gym):
    memberships: List[Any] = [] # You'd define Membership schema in schemas.py

@router.get("/{gym_id}/memberships", response_model=List[schemas.Membership])
def get_gym_memberships(
    gym_id: int,
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get memberships for a specific gym.
    """
    memberships = db.query(models.Membership).filter(models.Membership.gym_id == gym_id).all()
    return memberships
