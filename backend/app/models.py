from sqlalchemy import Boolean, Column, Integer, String, DateTime
from sqlalchemy.sql import func
from .database import Base


class Keyboard(Base):
    __tablename__ = "keyboards"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    price = Column(Integer, nullable=True)
    link = Column(String(500), nullable=False)
    image_path = Column(String(500), nullable=False)
    key_count_range = Column(String(50), nullable=False)
    is_wireless = Column(Boolean, default=False)
    has_ortholinear = Column(Boolean, default=False)
    has_tenting = Column(Boolean, default=False)
    has_cursor_control = Column(Boolean, default=False)
    has_display = Column(Boolean, default=False)
    has_column_stagger = Column(Boolean, default=False)
    has_splay = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
