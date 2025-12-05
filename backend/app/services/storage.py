"""Storage Service - Upload files to MinIO/S3"""

import hashlib
from uuid import UUID

import boto3
from botocore.config import Config

from app.core.config import get_settings

settings = get_settings()


class StorageService:
    """Handle file uploads to S3/MinIO"""
    
    def __init__(self):
        self.client = boto3.client(
            "s3",
            endpoint_url=settings.s3_endpoint_url,
            aws_access_key_id=settings.aws_access_key_id,
            aws_secret_access_key=settings.aws_secret_access_key,
            config=Config(signature_version="s3v4")
        )
        self.bucket = settings.s3_bucket_name
    
    async def ensure_bucket_exists(self):
        """Create bucket if it doesn't exist"""
        try:
            self.client.head_bucket(Bucket=self.bucket)
        except Exception:
            self.client.create_bucket(Bucket=self.bucket)
            print(f"Created bucket: {self.bucket}")
    
    def generate_hash(self, content: bytes) -> str:
        """Generate SHA-256 hash of content"""
        return hashlib.sha256(content).hexdigest()
    
    async def upload_file(
        self,
        user_id: UUID,
        content: bytes,
        filename: str,
        content_type: str
    ) -> str:
        """Upload file and return the path"""
        content_hash = self.generate_hash(content)
        key = f"evidence/{user_id}/{content_hash}_{filename}"
        
        self.client.put_object(
            Bucket=self.bucket,
            Key=key,
            Body=content,
            ContentType=content_type
        )
        
        return key
    
    async def get_download_url(self, key: str, expires_in: int = 3600) -> str:
        """Get a temporary download URL"""
        return self.client.generate_presigned_url(
            "get_object",
            Params={"Bucket": self.bucket, "Key": key},
            ExpiresIn=expires_in
        )
    
    async def delete_file(self, key: str):
        """Delete a file"""
        self.client.delete_object(Bucket=self.bucket, Key=key)


# Singleton
storage_service = StorageService()