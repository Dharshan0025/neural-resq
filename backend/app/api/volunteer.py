from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import List, Optional
from datetime import datetime

from app.core.security import get_current_user
from app.core.database import get_db
from app.schemas.volunteer import VolunteerCreate, VolunteerResponse, NearbyVolunteers
from app.models.volunteer import Volunteer
from app.models.user import UserLocation
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
import math

router = APIRouter()

@router.post("/volunteer/register", response_model=VolunteerResponse)
async def register_volunteer(
    volunteer_data: VolunteerCreate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Check if already registered
        existing = await Volunteer.get_by_user(db, current_user.id)
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Already registered as volunteer"
            )
            
        # Create volunteer record
        volunteer = Volunteer(
            user_id=current_user.id,
            is_active=volunteer_data.is_active,
            qualifications=volunteer_data.qualifications,
            availability=volunteer_data.availability
        )
        await volunteer.save(db)
        
        return {
            "success": True,
            "volunteer_id": str(volunteer.id)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error registering volunteer: {str(e)}"
        )

@router.get("/volunteer/nearby", response_model=NearbyVolunteers)
async def get_nearby_volunteers(
    latitude: float,
    longitude: float,
    radius_km: float = 5.0,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Get all active volunteers with their locations
        stmt = select(
            Volunteer,
            UserLocation
        ).join(
            UserLocation,
            Volunteer.user_id == UserLocation.user_id
        ).where(
            Volunteer.is_active == True
        )
        
        result = await db.execute(stmt)
        volunteers = result.all()
        
        # Filter by distance
        nearby = []
        for volunteer, location in volunteers:
            distance = haversine(
                latitude, longitude,
                location.latitude, location.longitude
            )
            if distance <= radius_km:
                nearby.append({
                    "user_id": volunteer.user_id,
                    "distance_km": distance,
                    "qualifications": volunteer.qualifications,
                    "last_updated": location.timestamp
                })
                
        return {
            "count": len(nearby),
            "volunteers": nearby,
            "center_lat": latitude,
            "center_lng": longitude,
            "radius_km": radius_km
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error finding nearby volunteers: {str(e)}"
        )

def haversine(lat1, lon1, lat2, lon2):
    # Calculate distance between two points on Earth in kilometers
    R = 6371.0  # Earth radius in km
    
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    dlon = lon2_rad - lon1_rad
    dlat = lat2_rad - lat1_rad
    
    a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    return R * c