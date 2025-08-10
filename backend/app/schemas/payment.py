from pydantic import BaseModel

class PaymentCreate(BaseModel):
    amount: float
    currency: str = "USD"
    payment_method: str  # "credit_card", "paypal", etc.

class PaymentResponse(BaseModel):
    success: bool
    transaction_id: str
    new_balance: float

class WalletBalance(BaseModel):
    balance: float
    currency: str