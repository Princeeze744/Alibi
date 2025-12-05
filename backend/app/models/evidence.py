"""Evidence Model - The heart of Alibi"""

from datetime import datetime
from typing import Optional
import uuid

from sqlalchemy import String, Text, DateTime, Numeric, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class EvidenceItem(Base):
    """
    Core evidence item - photos, documents, notes
    Each item has cryptographic timestamp proof
    """
    
    __tablename__ = "evidence_items"
    
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4
    )
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )
    
    # Type: photo, document, note, receipt, location
    item_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )
    
    # File info
    file_path: Mapped[Optional[str]] = mapped_column(
        String(500),
        nullable=True
    )
    
    file_size_bytes: Mapped[Optional[int]] = mapped_column(
        nullable=True
    )
    
    mime_type: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True
    )
    
    # Metadata
    title: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )
    
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    tags: Mapped[Optional[list[str]]] = mapped_column(
        ARRAY(String),
        nullable=True
    )
    
    # Location
    latitude: Mapped[Optional[float]] = mapped_column(
        Numeric(10, 8),
        nullable=True
    )
    
    longitude: Mapped[Optional[float]] = mapped_column(
        Numeric(11, 8),
        nullable=True
    )
    
    location_name: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )
    
    # Timestamps
    captured_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )
    
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    
    # CRYPTOGRAPHIC PROOF - The magic!
    content_hash: Mapped[str] = mapped_column(
        String(64),
        nullable=False,
        index=True
    )
    
    timestamp_token: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True
    )
    
    timestamp_authority: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True
    )
    
    timestamped_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )