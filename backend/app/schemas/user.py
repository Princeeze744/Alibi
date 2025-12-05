"""User Schemas - Request/Response validation"""

from uuid import UUID
from fastapi_users import schemas


class UserRead(schemas.BaseUser[UUID]):
    """What we return when reading a user"""
    full_name: str | None = None
    subscription_tier: str = "free"
    storage_used_bytes: int = 0


class UserCreate(schemas.BaseUserCreate):
    """What we need to create a user"""
    full_name: str | None = None


class UserUpdate(schemas.BaseUserUpdate):
    """What can be updated"""
    full_name: str | None = None