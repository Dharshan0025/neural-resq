from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import List, Optional

from app.core.security import get_current_user
from app.core.notifications import notification_service
from app.core.database import get_db
from app.schemas.notification import NotificationCreate, NotificationResponse
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.post("/notification/send", response_model=NotificationResponse)
async def send_notification(
    notification: NotificationCreate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        success = False
        if notification.notification_type == "sms":
            success = await notification_service.send_sms(
                notification.recipient,
                notification.message
            )
        elif notification.notification_type == "push":
            success = await notification_service.send_push_notification(
                [notification.recipient],
                notification.title or "Emergency Alert",
                notification.message
            )
        else:
            raise HTTPException(
                status_code=400,
                detail="Invalid notification type"
            )
            
        return {
            "success": success,
            "notification_type": notification.notification_type
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error sending notification: {str(e)}"
        )