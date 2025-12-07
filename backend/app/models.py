from sqlalchemy import Boolean, Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from .database import Base
import enum


class KeyboardType(str, enum.Enum):
    """키보드 종류"""
    typewriter = "typewriter"  # 타자기
    alice = "alice"  # 앨리스
    ortholinear = "ortholinear"  # 오소리니어
    column_stagger = "column_stagger"  # 칼럼스태거
    splay = "splay"  # 스플레이
    dactyl = "dactyl"  # 댁틸
    none = "none"  # 없음


class Keyboard(Base):
    __tablename__ = "keyboards"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    price = Column(Integer, nullable=True)
    link = Column(String(500), nullable=False)
    image_path = Column(String(500), nullable=False)
    key_count_range = Column(String(50), nullable=False)

    # 키보드 종류 (새로 추가)
    keyboard_type = Column(Enum(KeyboardType), default=KeyboardType.none, nullable=False)

    # 태그 (무선, 커서조작만 남김)
    is_wireless = Column(Boolean, default=False)
    has_cursor_control = Column(Boolean, default=False)

    # Deprecated fields (마이그레이션 후 제거 예정)
    has_ortholinear = Column(Boolean, default=False)  # → keyboard_type으로 이동
    has_column_stagger = Column(Boolean, default=False)  # → keyboard_type으로 이동
    has_splay = Column(Boolean, default=False)  # → keyboard_type으로 이동
    has_tenting = Column(Boolean, default=False)  # 제거 예정
    has_display = Column(Boolean, default=False)  # 제거 예정

    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
