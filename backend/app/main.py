"""Alibi - Main Application"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.core.database import engine, Base
from app.core.auth import fastapi_users, auth_backend
from app.schemas.user import UserRead, UserCreate, UserUpdate
from app.services.storage import storage_service
from app.api.routes import evidence

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown"""
    print("🚀 Starting Alibi...")
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("✅ Database tables created")
    
    await storage_service.ensure_bucket_exists()
    print("✅ Storage bucket ready")
    
    yield
    
    print("👋 Shutting down Alibi...")
    await engine.dispose()


app = FastAPI(
    title="Alibi API",
    description="Your Life, Documented. Your Proof, When You Need It.",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS - Allow specific origins for credentials
origins = [
    "http://localhost:3000",
    "https://localhost:3000",
    "https://zippy-vitality-production-bed7.up.railway.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth routes
app.include_router(
    fastapi_users.get_auth_router(auth_backend),
    prefix="/auth/jwt",
    tags=["Auth"],
)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["Auth"],
)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["Users"],
)

# Evidence routes
app.include_router(evidence.router)


@app.get("/")
async def root():
    return {
        "app": "Alibi",
        "status": "running",
        "message": "Your Life, Documented. Your Proof, When You Need It."
    }