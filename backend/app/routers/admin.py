from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from ..models import Admin, Keyboard
from ..schemas import (
    AdminLogin,
    AdminCreate,
    AdminResponse,
    AdminListResponse,
    Token,
    KeyboardResponse,
    KeyboardTags,
    KeyboardType
)
from ..auth import create_access_token, get_current_admin
from ..utils.security import verify_password, get_password_hash
from ..utils.file_upload import save_upload_file, delete_upload_file

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.post("/login", response_model=Token)
def login(credentials: AdminLogin, db: Session = Depends(get_db)):
    """Admin login endpoint."""
    # Find admin by username
    admin = db.query(Admin).filter(Admin.username == credentials.username).first()

    # Verify credentials
    if not admin or not verify_password(credentials.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token = create_access_token(data={"sub": admin.username})

    return Token(access_token=access_token)


@router.post("/keyboards", response_model=KeyboardResponse)
async def create_keyboard(
    name: str = Form(...),
    link: str = Form(...),
    key_count_range: str = Form(...),
    keyboard_type: KeyboardType = Form(KeyboardType.none),
    price: Optional[int] = Form(None),
    is_wireless: bool = Form(False),
    has_cursor_control: bool = Form(False),
    image: UploadFile = File(...),
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new keyboard (admin only)."""
    # Save uploaded image
    image_filename = await save_upload_file(image)

    # Create keyboard
    keyboard = Keyboard(
        name=name,
        price=price,
        link=link,
        image_path=image_filename,
        key_count_range=key_count_range,
        keyboard_type=keyboard_type,
        is_wireless=is_wireless,
        has_cursor_control=has_cursor_control
    )

    db.add(keyboard)
    db.commit()
    db.refresh(keyboard)

    return KeyboardResponse(
        id=keyboard.id,
        name=keyboard.name,
        price=keyboard.price,
        link=keyboard.link,
        image_url=f"/uploads/{keyboard.image_path}",
        key_count_range=keyboard.key_count_range,
        keyboard_type=keyboard.keyboard_type,
        tags=KeyboardTags(
            is_wireless=keyboard.is_wireless,
            has_cursor_control=keyboard.has_cursor_control
        ),
        created_at=keyboard.created_at,
        updated_at=keyboard.updated_at
    )


@router.put("/keyboards/{keyboard_id}", response_model=KeyboardResponse)
async def update_keyboard(
    keyboard_id: int,
    name: str = Form(...),
    link: str = Form(...),
    key_count_range: str = Form(...),
    keyboard_type: KeyboardType = Form(KeyboardType.none),
    price: Optional[int] = Form(None),
    is_wireless: bool = Form(False),
    has_cursor_control: bool = Form(False),
    image: Optional[UploadFile] = File(None),
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update a keyboard (admin only)."""
    # Find keyboard
    keyboard = db.query(Keyboard).filter(Keyboard.id == keyboard_id).first()
    if not keyboard:
        raise HTTPException(status_code=404, detail="Keyboard not found")

    # Update image if provided
    if image:
        # Delete old image
        delete_upload_file(keyboard.image_path)
        # Save new image
        image_filename = await save_upload_file(image)
        keyboard.image_path = image_filename

    # Update keyboard fields
    keyboard.name = name
    keyboard.price = price
    keyboard.link = link
    keyboard.key_count_range = key_count_range
    keyboard.keyboard_type = keyboard_type
    keyboard.is_wireless = is_wireless
    keyboard.has_cursor_control = has_cursor_control

    db.commit()
    db.refresh(keyboard)

    return KeyboardResponse(
        id=keyboard.id,
        name=keyboard.name,
        price=keyboard.price,
        link=keyboard.link,
        image_url=f"/uploads/{keyboard.image_path}",
        key_count_range=keyboard.key_count_range,
        keyboard_type=keyboard.keyboard_type,
        tags=KeyboardTags(
            is_wireless=keyboard.is_wireless,
            has_cursor_control=keyboard.has_cursor_control
        ),
        created_at=keyboard.created_at,
        updated_at=keyboard.updated_at
    )


@router.delete("/keyboards/{keyboard_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_keyboard(
    keyboard_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete a keyboard (admin only)."""
    # Find keyboard
    keyboard = db.query(Keyboard).filter(Keyboard.id == keyboard_id).first()
    if not keyboard:
        raise HTTPException(status_code=404, detail="Keyboard not found")

    # Delete image file
    delete_upload_file(keyboard.image_path)

    # Delete from database
    db.delete(keyboard)
    db.commit()

    return None


@router.post("/accounts", response_model=AdminResponse)
def create_admin_account(
    account: AdminCreate,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Create a new admin account (admin only)."""
    # Check if username already exists
    existing_admin = db.query(Admin).filter(Admin.username == account.username).first()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists"
        )

    # Create new admin
    new_admin = Admin(
        username=account.username,
        password_hash=get_password_hash(account.password)
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return AdminResponse(
        id=new_admin.id,
        username=new_admin.username,
        created_at=new_admin.created_at
    )


@router.get("/accounts", response_model=AdminListResponse)
def get_admin_accounts(
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Get all admin accounts (admin only)."""
    admins = db.query(Admin).all()

    return AdminListResponse(
        accounts=[
            AdminResponse(
                id=admin.id,
                username=admin.username,
                created_at=admin.created_at
            )
            for admin in admins
        ]
    )


@router.delete("/accounts/{account_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin_account(
    account_id: int,
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Delete an admin account (admin only). Cannot delete own account."""
    # Check if trying to delete own account
    if current_admin.id == account_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete your own account"
        )

    # Find admin account
    admin = db.query(Admin).filter(Admin.id == account_id).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin account not found")

    # Delete account
    db.delete(admin)
    db.commit()

    return None
