from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Wallet(Base):
    __tablename__ = "wallets"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    balance = Column(Float, default=0.0)
    currency = Column(String, default="USD")
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

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), index=True)
    amount = Column(Float)
    currency = Column(String, default="USD")
    payment_method = Column(String)
    status = Column(String)  # "pending", "completed", "failed"
    transaction_type = Column(String)  # "deposit", "withdrawal", "payment"
    reference = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    async def save(self, db):
        db.add(self)
        await db.commit()
        await db.refresh(self)
        return self