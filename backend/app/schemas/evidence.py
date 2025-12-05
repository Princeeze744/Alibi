"""Evidence Schemas - Request/Response validation"""

from datetime import datetime
from typing import Optional
from uuid import UUID
from pydantic import BaseModel, Field


class EvidenceCreate(BaseModel):
    """Create new evidence"""
    item_type: str = Field(..., pattern="^(photo|document|note|receipt|location)$")
    title: Optional[str] = None
    description: Optional[str] = None
    tags: Optional[list[str]] = None
    latitude: Optional[float] = Field(None, ge=-90, le=90)
    longitude: Optional[float] = Field(None, ge=-180, le=180)
    location_name: Optional[str] = None
    captured_at: Optional[datetime] = None


class EvidenceResponse(BaseModel):
    """Evidence item response"""
    id: UUID
    user_id: UUID
    item_type: str
    file_path: Optional[str]
    file_size_bytes: Optional[int]
    title: Optional[str]
    description: Optional[str]
    tags: Optional[list[str]]
    latitude: Optional[float]
    longitude: Optional[float]
    location_name: Optional[str]
    captured_at: datetime
    uploaded_at: datetime
    content_hash: str
    timestamped_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class EvidenceList(BaseModel):
    """List of evidence items"""
    items: list[EvidenceResponse]
    total: int
    page: int
    has_more: bool