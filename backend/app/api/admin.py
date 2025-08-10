from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import List, Optional
from datetime import datetime, timedelta

from app.core.security import get_current_user, get_current_admin_user
from app.core.database import get_db
from app.schemas.admin import AdminAnalytics, EmergencyStats, UserStats
from app.models.emergency import Emergency
from app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_

router = APIRouter()

@router.get("/admin/analytics", response_model=AdminAnalytics)
async def get_admin_analytics(
    days: Optional[int] = 30,
    admin_user=Depends(get_current_admin_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        since_date = datetime.utcnow() - timedelta(days=days)
        
        # Total emergencies
        total_stmt = select(func.count()).where(
            Emergency.created_at >= since_date
        )
        total_result = await db.execute(total_stmt)
        total = total_result.scalar()
        
        # Confirmed emergencies
        confirmed_stmt = select(func.count()).where(
            Emergency.is_confirmed == True,
            Emergency.created_at >= since_date
        )
        confirmed_result = await db.execute(confirmed_stmt)
        confirmed = confirmed_result.scalar()
        
        # By type
        type_stmt = select(
            Emergency.detection_type,
            func.count(Emergency.detection_type)
        ).where(
            Emergency.created_at >= since_date
        ).group_by(Emergency.detection_type)
        
        type_result = await db.execute(type_stmt)
        by_type = {row[0]: row[1] for row in type_result.all()}
        
        # User stats
        user_stmt = select(
            func.count(User.id),
            func.count(distinct(Emergency.user_id))
        ).where(
            User.created_at >= since_date
        )
        user_result = await db.execute(user_stmt)
        user_count, active_users = user_result.first()
        
        return {
            "total_emergencies": total or 0,
            "confirmed_emergencies": confirmed or 0,
            "emergencies_by_type": by_type,
            "total_users": user_count or 0,
            "active_users": active_users or 0,
            "time_period_days": days
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error getting admin analytics: {str(e)}"
        )

async def get_current_admin_user(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    # In a real app, check if user has admin privileges
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="Admin privileges required"
        )
    return current_user