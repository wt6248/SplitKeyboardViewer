from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class KeyRange(str, Enum):
    full = "full"
    tkl = "tkl"
    compact = "compact"
    forty = "40"
    thirty = "30"


class SortOption(str, Enum):
    name_asc = "name_asc"
    name_desc = "name_desc"
    price_asc = "price_asc"
    price_desc = "price_desc"


# Keyboard Schemas
class KeyboardTags(BaseModel):
    is_wireless: bool = False
    has_ortholinear: bool = False
    has_tenting: bool = False
    has_cursor_control: bool = False
    has_display: bool = False
    has_column_stagger: bool = False
    has_splay: bool = False


class KeyboardBase(BaseModel):
    name: str
    price: Optional[int] = None
    link: str
    key_count_range: KeyRange
    is_wireless: bool = False
    has_ortholinear: bool = False
    has_tenting: bool = False
    has_cursor_control: bool = False
    has_display: bool = False
    has_column_stagger: bool = False
    has_splay: bool = False


class KeyboardCreate(KeyboardBase):
    pass


class KeyboardUpdate(KeyboardBase):
    pass


class KeyboardResponse(BaseModel):
    id: int
    name: str
    price: Optional[int]
    link: str
    image_url: str
    key_count_range: str
    tags: KeyboardTags
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class KeyboardListResponse(BaseModel):
    keyboards: List[KeyboardResponse]
    total: int
    page: int
    total_pages: int


class KeyboardCompareRequest(BaseModel):
    keyboard_ids: List[int] = Field(..., min_length=2, max_length=2)


class KeyboardCompareResponse(BaseModel):
    keyboards: List[KeyboardResponse]


# Admin Schemas
class AdminLogin(BaseModel):
    username: str
    password: str


class AdminCreate(BaseModel):
    username: str
    password: str


class AdminResponse(BaseModel):
    id: int
    username: str
    created_at: datetime

    class Config:
        from_attributes = True


class AdminListResponse(BaseModel):
    accounts: List[AdminResponse]


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: Optional[str] = None
