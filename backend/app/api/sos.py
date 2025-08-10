from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional

from app.core.security import get_current_user
from app.core.notifications import notification_service
from app.core.database import get_db
from app.schemas.sos import SOSCreate, SOSResponse
from app.models.emergency import Emergency
from app.models.user import User
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.post("/sos/trigger", response_model=SOSResponse)
async def trigger_sos(
    sos_data: SOSCreate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        # Create emergency record
        emergency = Emergency(
            user_id=current_user.id,
            detection_type="manual",
            is_confirmed=True,
            location_lat=sos_data.location_lat,
            location_lng=sos_data.location_lng,
            additional_info=sos_data.additional_info
        )
        await emergency.save(db)
        
        # Get user's emergency contacts
        user = await User.get(db, current_user.id)
        contacts = user.emergency_contacts if user.emergency_contacts else []
        
        # Send notifications
        messages_sent = 0
        for contact in contacts:
            if contact.get("phone"):
                message = f"EMERGENCY: {user.full_name} has triggered an SOS. Location: {sos_data.location_lat},{sos_data.location_lng}. Additional info: {sos_data.additional_info}"
                if await notification_service.send_sms(contact["phone"], message):
                    messages_sent += 1
        
        # TODO: Notify nearby responders via push notification
        
        return {
            "success": True,
            "emergency_id": str(emergency.id),
            "notifications_sent": messages_sent
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error triggering SOS: {str(e)}"
        )