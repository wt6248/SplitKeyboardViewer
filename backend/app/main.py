from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

from .database import engine, Base
from .routers import keyboards, admin
from .utils.file_upload import UPLOAD_DIR

# Create database tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Split Keyboard API",
    description="API for split keyboard comparison website",
    version="3.1.0"
)

# CORS configuration
# In production, replace with your actual frontend domain
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files directory for uploads
# UPLOAD_DIR is configured via environment variable (default: "uploads")
# In production, use absolute path like /var/lib/split-keyboard/uploads
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR, exist_ok=True)

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(keyboards.router)
app.include_router(admin.router)


@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Split Keyboard API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
