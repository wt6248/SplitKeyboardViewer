import os
import uuid
from fastapi import UploadFile, HTTPException
from typing import List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Allowed file extensions
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

# Maximum file size (5MB)
MAX_FILE_SIZE = 5 * 1024 * 1024

# Upload directory - use environment variable or default to "uploads"
# In production, this should be set to an absolute path like /var/lib/split-keyboard/uploads
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")


def validate_image_file(file: UploadFile) -> None:
    """Validate that the uploaded file is an allowed image type."""
    # Check file extension
    file_ext = os.path.splitext(file.filename)[1].lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
        )


def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent security issues."""
    # Get file extension
    file_ext = os.path.splitext(filename)[1].lower()

    # Generate unique filename with UUID
    unique_filename = f"{uuid.uuid4()}{file_ext}"

    return unique_filename


async def save_upload_file(file: UploadFile) -> str:
    """
    Save an uploaded file and return the file path.

    Args:
        file: The uploaded file

    Returns:
        The relative path to the saved file

    Raises:
        HTTPException: If file validation fails or file is too large
    """
    # Validate file type
    validate_image_file(file)

    # Read file content
    content = await file.read()

    # Check file size
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {MAX_FILE_SIZE / (1024 * 1024)}MB"
        )

    # Generate safe filename
    safe_filename = sanitize_filename(file.filename)

    # Create upload directory if it doesn't exist
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Save file
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    with open(file_path, "wb") as f:
        f.write(content)

    # Return relative path
    return safe_filename


def delete_upload_file(filename: str) -> None:
    """Delete an uploaded file."""
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
