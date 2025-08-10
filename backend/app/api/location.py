from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional

from app.core.security import get_current_user
from app.core.database import get_db
from app.schemas.location import LocationUpdate, LocationResponse
from app.models.user import UserLocation
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.post("/location/update", response_model=LocationResponse)
async def update_location(
    location: LocationUpdate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Update or create user location
        user_location = await UserLocation.get_by_user(db, current_user.id)
        if user_location:
            user_location.latitude = location.latitude
            user_location.longitude = location.longitude
            user_location.accuracy = location.accuracy
            user_location.timestamp = location.timestamp
        else:
            user_location = UserLocation(
                user_id=current_user.id,
                latitude=location.latitude,
                longitude=location.longitude,
                accuracy=location.accuracy,
                timestamp=location.timestamp
            )
        
        await user_location.save(db)
        
        return {
            "success": True,
            "latitude": user_location.latitude,
            "longitude": user_location.longitude,
            "timestamp": user_location.timestamp
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error updating location: {str(e)}"
        )

@router.get("/location/user/{user_id}", response_model=LocationResponse)
async def get_user_location(
    user_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        # In a real app, add authorization checks here
        user_location = await UserLocation.get_by_user(db, user_id)
        if not user_location:
            raise HTTPException(
                status_code=404,
                detail="Location not found"
            )
            
        return {
            "success": True,
            "latitude": user_location.latitude,
            "longitude": user_location.longitude,
            "timestamp": user_location.timestamp
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error getting location: {str(e)}"
        )