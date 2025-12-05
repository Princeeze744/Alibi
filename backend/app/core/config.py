"""App Configuration - Loads from .env file"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore"
    )
    
    # App
    app_name: str = "Alibi"
    debug: bool = True
    secret_key: str = "change-me-in-production"
    
    # Database
    database_url: str
    
    # Redis
    redis_url: str = "redis://localhost:6379/0"
    
    # MinIO/S3
    aws_access_key_id: str = "minioadmin"
    aws_secret_access_key: str = "minioadmin"
    s3_endpoint_url: str = "http://localhost:9000"
    s3_bucket_name: str = "alibi-evidence"
    
    # JWT
    access_token_expire_minutes: int = 30


@lru_cache
def get_settings() -> Settings:
    return Settings()