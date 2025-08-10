from twilio.rest import Client
from app.config import settings
from typing import List, Optional

class NotificationService:
    def __init__(self):
        self.twilio_client = None
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            self.twilio_client = Client(
                settings.TWILIO_ACCOUNT_SID, 
                settings.TWILIO_AUTH_TOKEN
            )
    
    async def send_sms(self, to: str, message: str) -> bool:
        if not self.twilio_client:
            return False
            
        try:
            self.twilio_client.messages.create(
                body=message,
                from_=settings.TWILIO_PHONE_NUMBER,
                to=to
            )
            return True
        except Exception as e:
            print(f"SMS sending failed: {e}")
            return False
    
    async def send_push_notification(self, device_tokens: List[str], title: str, body: str) -> bool:
        # Implement using Firebase Admin SDK or similar
        pass
    
    async def send_email(self, to: str, subject: str, body: str) -> bool:
        # Implement using SendGrid or similar
        pass

notification_service = NotificationService()