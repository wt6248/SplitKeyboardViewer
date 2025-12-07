from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, func
from typing import Optional, List
import math

from ..database import get_db
from ..models import Keyboard
from ..schemas import (
    KeyboardResponse,
    KeyboardListResponse,
    KeyboardCompareRequest,
    KeyboardCompareResponse,
    KeyboardTags,
    KeyboardType,
    SortOption
)

router = APIRouter(prefix="/api/keyboards", tags=["keyboards"])


def keyboard_to_response(keyboard: Keyboard, base_url: str = "") -> KeyboardResponse:
    """Convert a Keyboard model to KeyboardResponse schema."""
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


@router.get("", response_model=KeyboardListResponse)
def get_keyboards(
    min_price: Optional[int] = Query(None, description="Minimum price"),
    max_price: Optional[int] = Query(None, description="Maximum price"),
    include_null_price: bool = Query(True, description="Include keyboards with no price"),
    only_null_price: bool = Query(False, description="Only show keyboards with no price (DIY only)"),
    key_ranges: Optional[str] = Query(None, description="Comma-separated key ranges (e.g., 'tkl,compact')"),
    keyboard_type: Optional[KeyboardType] = Query(None, description="Filter by keyboard type"),
    is_wireless: Optional[bool] = Query(None, description="Filter by wireless"),
    has_cursor_control: Optional[bool] = Query(None, description="Filter by cursor control"),
    search: Optional[str] = Query(None, description="Search by name"),
    sort_by: SortOption = Query(SortOption.name_asc, description="Sort option"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db)
):
    """Get keyboards list with filtering, sorting, and pagination."""
    # Build query
    query = db.query(Keyboard)

    # Price filter
    if only_null_price:
        # Only show keyboards with no price (DIY only)
        query = query.filter(Keyboard.price.is_(None))
    elif min_price is not None or max_price is not None:
        price_conditions = []

        # Add price range condition
        if min_price is not None and max_price is not None:
            price_conditions.append(and_(Keyboard.price >= min_price, Keyboard.price <= max_price))
        elif min_price is not None:
            price_conditions.append(Keyboard.price >= min_price)
        elif max_price is not None:
            price_conditions.append(Keyboard.price <= max_price)

        # Include NULL prices if requested
        if include_null_price:
            price_conditions.append(Keyboard.price.is_(None))

        query = query.filter(or_(*price_conditions))
    elif not include_null_price:
        # Only show keyboards with price (exclude NULL)
        query = query.filter(Keyboard.price.isnot(None))

    # Key ranges filter
    if key_ranges:
        ranges = [r.strip() for r in key_ranges.split(",")]
        query = query.filter(Keyboard.key_count_range.in_(ranges))

    # Keyboard type filter
    if keyboard_type is not None:
        query = query.filter(Keyboard.keyboard_type == keyboard_type)

    # Tag filters (무선, 커서조작만 남김)
    if is_wireless is not None:
        query = query.filter(Keyboard.is_wireless == is_wireless)
    if has_cursor_control is not None:
        query = query.filter(Keyboard.has_cursor_control == has_cursor_control)

    # Search filter
    if search:
        query = query.filter(Keyboard.name.contains(search))

    # Get total count before pagination
    total = query.count()

    # Sorting (case-insensitive for name sorting)
    if sort_by == SortOption.name_asc:
        query = query.order_by(func.lower(Keyboard.name).asc())
    elif sort_by == SortOption.name_desc:
        query = query.order_by(func.lower(Keyboard.name).desc())
    elif sort_by == SortOption.price_asc:
        # NULL prices last
        query = query.order_by(Keyboard.price.asc().nullslast())
    elif sort_by == SortOption.price_desc:
        # NULL prices last
        query = query.order_by(Keyboard.price.desc().nullslast())

    # Pagination
    offset = (page - 1) * limit
    keyboards = query.offset(offset).limit(limit).all()

    # Calculate total pages
    total_pages = math.ceil(total / limit) if total > 0 else 0

    return KeyboardListResponse(
        keyboards=[keyboard_to_response(kb) for kb in keyboards],
        total=total,
        page=page,
        total_pages=total_pages
    )


@router.get("/{keyboard_id}", response_model=KeyboardResponse)
def get_keyboard(keyboard_id: int, db: Session = Depends(get_db)):
    """Get a specific keyboard by ID."""
    keyboard = db.query(Keyboard).filter(Keyboard.id == keyboard_id).first()

    if not keyboard:
        raise HTTPException(status_code=404, detail="Keyboard not found")

    return keyboard_to_response(keyboard)


@router.post("/compare", response_model=KeyboardCompareResponse)
def compare_keyboards(
    request: KeyboardCompareRequest,
    db: Session = Depends(get_db)
):
    """Compare two keyboards."""
    keyboards = db.query(Keyboard).filter(
        Keyboard.id.in_(request.keyboard_ids)
    ).all()

    if len(keyboards) != 2:
        raise HTTPException(
            status_code=404,
            detail="One or both keyboards not found"
        )

    return KeyboardCompareResponse(
        keyboards=[keyboard_to_response(kb) for kb in keyboards]
    )
