from pydantic import BaseModel
from typing import Optional

class NotificationCreate(BaseModel):
    notification_type: str  # "sms", "push", "email"
    recipient: str
    message: str
    title: Optional[str] = None

class NotificationResponse(BaseModel):
    success: bool
    notification_type: str