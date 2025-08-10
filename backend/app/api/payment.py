from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional

from app.core.security import get_current_user
from app.core.database import get_db
from app.schemas.payment import PaymentCreate, PaymentResponse, WalletBalance
from app.models.payment import Wallet, Transaction
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.post("/payment/add-funds", response_model=PaymentResponse)
async def add_funds(
    payment: PaymentCreate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        # In a real app, integrate with payment gateway here
        # For now, we'll just simulate a successful payment
        
        # Get or create wallet
        wallet = await Wallet.get_by_user(db, current_user.id)
        if not wallet:
            wallet = Wallet(user_id=current_user.id, balance=0)
            await wallet.save(db)
        
        # Create transaction
        transaction = Transaction(
            user_id=current_user.id,
            amount=payment.amount,
            currency=payment.currency,
            payment_method=payment.payment_method,
            status="completed",
            transaction_type="deposit"
        )
        await transaction.save(db)
        
        # Update wallet balance
        wallet.balance += payment.amount
        await wallet.save(db)
        
        return {
            "success": True,
            "transaction_id": str(transaction.id),
            "new_balance": wallet.balance
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error processing payment: {str(e)}"
        )

@router.get("/payment/wallet", response_model=WalletBalance)
async def get_wallet_balance(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    try:
        wallet = await Wallet.get_by_user(db, current_user.id)
        if not wallet:
            return {"balance": 0, "currency": "USD"}
            
        return {
            "balance": wallet.balance,
            "currency": "USD"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error getting wallet balance: {str(e)}"
        )