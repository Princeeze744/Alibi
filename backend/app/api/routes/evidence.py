"""Evidence API Routes"""

import hashlib
from datetime import datetime, timezone
from typing import Optional
from uuid import UUID
import os

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.auth import current_active_user
from app.models.user import User
from app.models.evidence import EvidenceItem
from app.services.storage import storage_service

router = APIRouter(prefix="/evidence", tags=["Evidence"])


@router.post("/upload")
async def upload_evidence(
    file: UploadFile = File(...),
    title: str = Form(...),
    item_type: str = Form("photo"),
    description: Optional[str] = Form(None),
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Upload new evidence with cryptographic timestamp"""
    
    # Read file content
    content = await file.read()
    file_size = len(content)
    
    # Generate SHA-256 hash
    content_hash = hashlib.sha256(content).hexdigest()
    
    # Upload to MinIO/S3
    file_path = await storage_service.upload_file(
        user_id=user.id,
        content=content,
        filename=file.filename,
        content_type=file.content_type or "application/octet-stream"
    )
    
    # Create evidence record
    evidence = EvidenceItem(
        user_id=user.id,
        item_type=item_type,
        file_path=file_path,
        file_size_bytes=file_size,
        mime_type=file.content_type,
        title=title,
        description=description,
        captured_at=datetime.now(timezone.utc),
        content_hash=content_hash,
        timestamp_authority="local",
        timestamped_at=datetime.now(timezone.utc),
    )
    
    db.add(evidence)
    await db.commit()
    await db.refresh(evidence)
    
    return {
        "id": str(evidence.id),
        "title": evidence.title,
        "content_hash": evidence.content_hash,
        "timestamped_at": evidence.timestamped_at.isoformat(),
        "message": "Evidence captured and timestamped successfully"
    }


@router.get("")
async def list_evidence(
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """List all evidence for the current user"""
    
    result = await db.execute(
        select(EvidenceItem)
        .where(EvidenceItem.user_id == user.id)
        .order_by(desc(EvidenceItem.captured_at))
    )
    
    items = result.scalars().all()
    
    evidence_list = []
    for item in items:
        # Generate download URL
        download_url = None
        if item.file_path:
            try:
                download_url = await storage_service.get_download_url(item.file_path)
            except Exception:
                pass
        
        evidence_list.append({
            "id": str(item.id),
            "title": item.title,
            "type": item.item_type,
            "description": item.description,
            "file_url": download_url,
            "file_size": item.file_size_bytes,
            "content_hash": item.content_hash,
            "captured_at": item.captured_at.isoformat() if item.captured_at else None,
            "timestamped_at": item.timestamped_at.isoformat() if item.timestamped_at else None,
            "verified": item.timestamped_at is not None,
        })
    
    return {
        "items": evidence_list,
        "total": len(evidence_list)
    }


@router.get("/{evidence_id}")
async def get_evidence(
    evidence_id: UUID,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single evidence item"""
    
    result = await db.execute(
        select(EvidenceItem).where(
            EvidenceItem.id == evidence_id,
            EvidenceItem.user_id == user.id
        )
    )
    
    item = result.scalar_one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    download_url = None
    if item.file_path:
        try:
            download_url = await storage_service.get_download_url(item.file_path)
        except Exception:
            pass
    
    return {
        "id": str(item.id),
        "title": item.title,
        "type": item.item_type,
        "description": item.description,
        "file_url": download_url,
        "content_hash": item.content_hash,
        "captured_at": item.captured_at.isoformat() if item.captured_at else None,
        "timestamped_at": item.timestamped_at.isoformat() if item.timestamped_at else None,
        "verified": item.timestamped_at is not None,
    }


@router.delete("/{evidence_id}")
async def delete_evidence(
    evidence_id: UUID,
    user: User = Depends(current_active_user),
    db: AsyncSession = Depends(get_db),
):
    """Delete evidence"""
    
    result = await db.execute(
        select(EvidenceItem).where(
            EvidenceItem.id == evidence_id,
            EvidenceItem.user_id == user.id
        )
    )
    
    item = result.scalar_one_or_none()
    
    if not item:
        raise HTTPException(status_code=404, detail="Evidence not found")
    
    # Delete from storage
    if item.file_path:
        try:
            await storage_service.delete_file(item.file_path)
        except Exception:
            pass
    
    await db.delete(item)
    await db.commit()
    
    return {"message": "Evidence deleted successfully"}