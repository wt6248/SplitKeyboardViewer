"""
Script to create an initial admin account.
Usage: python create_admin.py <username> <password>
"""
import sys
import os
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app.models import Admin
from app.utils.security import get_password_hash

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Create tables if they don't exist
Base.metadata.create_all(bind=engine)


def create_admin(username: str, password: str):
    """Create an admin account."""
    db: Session = SessionLocal()

    try:
        # Check if admin already exists
        existing_admin = db.query(Admin).filter(Admin.username == username).first()
        if existing_admin:
            print(f"Error: Admin '{username}' already exists!")
            return

        # Create new admin
        admin = Admin(
            username=username,
            password_hash=get_password_hash(password)
        )

        db.add(admin)
        db.commit()
        db.refresh(admin)

        print(f"[SUCCESS] Admin account created successfully!")
        print(f"  Username: {admin.username}")
        print(f"  ID: {admin.id}")

    except Exception as e:
        print(f"Error creating admin: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python create_admin.py <username> <password>")
        sys.exit(1)

    username = sys.argv[1]
    password = sys.argv[2]

    create_admin(username, password)
