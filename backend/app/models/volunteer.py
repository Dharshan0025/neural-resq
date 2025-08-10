from sqlalchemy import Column, String, Boolean, DateTime, JSON
from sqlalchemy.sql import func
from app.core.database import Base

class Volunteer(Base):
    __tablename__ = "volunteers"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, index=True)
    is_active = Column(Boolean, default=True)
    qualifications = Column(JSON, default=[])
    availability = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    @classmethod
    async def get_by_user(cls, db, user_id: str):
        result = await db.execute(
            select(cls).where(cls.user_id == user_id)
        )
        return result.scalars().first()
    
    async def save(self, db):
        db.add(self)
        await db.commit()
        await db.refresh(self)
        return self