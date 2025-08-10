from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import List, Optional
from datetime import datetime, timedelta

from app.core.security import get_current_user
from app.core.database import get_db
from app.schemas.history import EmergencyHistory, AnalyticsResponse
from app.models.emergency import Emergency
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

router = APIRouter()

@router.get("/history/emergencies", response_model=List[EmergencyHistory])
async def get_emergency_history(
    days: Optional[int] = 30,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        since_date = datetime.utcnow() - timedelta(days=days)
        emergencies = await Emergency.get_by_user(db, current_user.id, since_date)
        return emergencies
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error getting emergency history: {str(e)}"
        )

@router.get("/history/analytics", response_model=AnalyticsResponse)
async def get_analytics(
    days: Optional[int] = 30,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        since_date = datetime.utcnow() - timedelta(days=days)
        
        # Get total emergencies
        total_stmt = select(func.count()).where(
            Emergency.user_id == current_user.id,
            Emergency.created_at >= since_date
        )
        total_result = await db.execute(total_stmt)
        total = total_result.scalar()
        
        # Get confirmed emergencies
        confirmed_stmt = select(func.count()).where(
            Emergency.user_id == current_user.id,
            Emergency.is_confirmed == True,
            Emergency.created_at >= since_date
        )
        confirmed_result = await db.execute(confirmed_stmt)
        confirmed = confirmed_result.scalar()
        
        # Get by type
        type_stmt = select(
            Emergency.detection_type,
            func.count(Emergency.detection_type)
        ).where(
            Emergency.user_id == current_user.id,
            Emergency.created_at >= since_date
        ).group_by(Emergency.detection_type)
        
        type_result = await db.execute(type_stmt)
        by_type = {row[0]: row[1] for row in type_result.all()}
        
        return {
            "total_emergencies": total or 0,
            "confirmed_emergencies": confirmed or 0,
            "by_type": by_type,
            "time_period_days": days
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error getting analytics: {str(e)}"
        )