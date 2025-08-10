from sqlalchemy import Column, String, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Emergency(Base):
    __tablename__ = "emergencies"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    detection_type = Column(String)  # "audio", "manual", etc.
    detection_data = Column(JSON)    # Raw detection data
    is_confirmed = Column(Boolean, default=False)
    location_lat = Column(String)
    location_lng = Column(String)
    additional_info = Column(String)
    resolved_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    @classmethod
    async def get_by_user(cls, db, user_id: str, since=None):
        stmt = select(cls).where(cls.user_id == user_id)
        if since:
            stmt = stmt.where(cls.created_at >= since)
        result = await db.execute(stmt.order_by(cls.created_at.desc()))
        return result.scalars().all()
    
    async def save(self, db):
        db.add(self)
        await db.commit()
        await db.refresh(self)
        return self