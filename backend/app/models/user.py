"""User Model - Using FastAPI-Users"""

from fastapi_users.db import SQLAlchemyBaseUserTableUUID
from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class User(SQLAlchemyBaseUserTableUUID, Base):
    """User account - extends FastAPI-Users base"""
    
    __tablename__ = "users"
    
    # Extra fields beyond what FastAPI-Users provides
    full_name: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )
    
    subscription_tier: Mapped[str] = mapped_column(
        String(50),
        default="free"
    )
    
    storage_used_bytes: Mapped[int] = mapped_column(
        default=0
    )
    
    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False
    )