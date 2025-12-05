"""
Storage service using local file system (Railway Volume)
For production, upgrade to Cloudflare R2 or AWS S3
"""

import os
import uuid
import aiofiles
from pathlib import Path
from typing import Optional
from datetime import datetime


class StorageService:
    def __init__(self):
        # Use /app/uploads for Railway, or local uploads folder
        self.upload_dir = Path(os.getenv("UPLOAD_DIR", "/app/uploads"))
        
    async def ensure_bucket_exists(self):
        """Create upload directory if it doesn't exist"""
        try:
            self.upload_dir.mkdir(parents=True, exist_ok=True)
            print(f"✅ Storage ready: {self.upload_dir}")
        except Exception as e:
            print(f"⚠️ Storage warning: {e}")
            # Fallback to temp directory
            self.upload_dir = Path("/tmp/uploads")
            self.upload_dir.mkdir(parents=True, exist_ok=True)
            print(f"✅ Using fallback storage: {self.upload_dir}")
    
    async def upload_file(
        self, 
        file_content: bytes, 
        filename: str,
        content_type: str = "application/octet-stream",
        user_id: Optional[str] = None
    ) -> dict:
        """
        Upload a file to local storage
        Returns dict with file info
        """
        # Generate unique filename
        ext = Path(filename).suffix
        unique_name = f"{uuid.uuid4()}{ext}"
        
        # Create user subdirectory if user_id provided
        if user_id:
            file_dir = self.upload_dir / str(user_id)
        else:
            file_dir = self.upload_dir
            
        file_dir.mkdir(parents=True, exist_ok=True)
        file_path = file_dir / unique_name
        
        # Write file
        async with aiofiles.open(file_path, 'wb') as f:
            await f.write(file_content)
        
        # Return file info
        return {
            "filename": unique_name,
            "original_filename": filename,
            "path": str(file_path),
            "size": len(file_content),
            "content_type": content_type,
            "uploaded_at": datetime.utcnow().isoformat()
        }
    
    async def get_file(self, filename: str, user_id: Optional[str] = None) -> Optional[bytes]:
        """Get file content by filename"""
        if user_id:
            file_path = self.upload_dir / str(user_id) / filename
        else:
            file_path = self.upload_dir / filename
            
        if not file_path.exists():
            # Try without user_id subdirectory
            file_path = self.upload_dir / filename
            
        if file_path.exists():
            async with aiofiles.open(file_path, 'rb') as f:
                return await f.read()
        return None
    
    async def delete_file(self, filename: str, user_id: Optional[str] = None) -> bool:
        """Delete a file"""
        if user_id:
            file_path = self.upload_dir / str(user_id) / filename
        else:
            file_path = self.upload_dir / filename
            
        if file_path.exists():
            file_path.unlink()
            return True
        return False
    
    def get_file_url(self, filename: str, user_id: Optional[str] = None) -> str:
        """Get URL for accessing file (for API endpoint)"""
        if user_id:
            return f"/api/files/{user_id}/{filename}"
        return f"/api/files/{filename}"


# Global instance
storage_service = StorageService()