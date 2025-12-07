"""
데이터베이스 마이그레이션 스크립트: 키보드 종류 필드 추가 및 데이터 변환

기존 태그 필드에서 keyboard_type으로 데이터 이동:
- has_ortholinear=True → keyboard_type='ortholinear'
- has_column_stagger=True → keyboard_type='column_stagger'
- has_splay=True → keyboard_type='splay'

우선순위: ortholinear > column_stagger > splay
(여러 태그가 True일 경우 우선순위가 높은 것으로 설정)
"""

import sys
from pathlib import Path

# Add the parent directory to the path
sys.path.append(str(Path(__file__).parent))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.database import SQLALCHEMY_DATABASE_URL
from app.models import Keyboard, KeyboardType

def migrate_keyboard_types():
    """기존 태그 데이터를 keyboard_type으로 마이그레이션"""

    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # 1. 먼저 keyboard_type 컬럼이 있는지 확인
        result = db.execute(text("PRAGMA table_info(keyboards)"))
        columns = [row[1] for row in result]

        if 'keyboard_type' not in columns:
            print("[INFO] keyboard_type column does not exist. Creating...")
            # SQLite에서 Enum은 TEXT로 저장됨
            db.execute(text("ALTER TABLE keyboards ADD COLUMN keyboard_type VARCHAR(50) DEFAULT 'none' NOT NULL"))
            db.commit()
            print("[OK] keyboard_type column created.")
        else:
            print("[OK] keyboard_type column already exists.")
        print()

        # 2. 모든 키보드 조회
        keyboards = db.query(Keyboard).all()
        print(f"Total {len(keyboards)} keyboards to migrate.")
        print()

        migrated_count = 0

        for keyboard in keyboards:
            old_type = keyboard.keyboard_type
            new_type = KeyboardType.none

            # 우선순위에 따라 keyboard_type 결정
            # 우선순위: ortholinear > column_stagger > splay
            if keyboard.has_ortholinear:
                new_type = KeyboardType.ortholinear
            elif keyboard.has_column_stagger:
                new_type = KeyboardType.column_stagger
            elif keyboard.has_splay:
                new_type = KeyboardType.splay

            # keyboard_type이 변경되었거나 none인 경우에만 업데이트
            if old_type != new_type:
                keyboard.keyboard_type = new_type
                migrated_count += 1

                print(f"[{keyboard.id}] {keyboard.name}")
                print(f"  - ortholinear: {keyboard.has_ortholinear}")
                print(f"  - column_stagger: {keyboard.has_column_stagger}")
                print(f"  - splay: {keyboard.has_splay}")
                print(f"  → keyboard_type: {old_type} → {new_type}")
                print()

        # 3. 변경사항 저장
        db.commit()

        print()
        print("=" * 60)
        print(f"[SUCCESS] Migration completed: {migrated_count} keyboards updated.")
        print()

        # 4. 결과 요약
        type_counts = {}
        for keyboard in db.query(Keyboard).all():
            type_name = keyboard.keyboard_type.value if keyboard.keyboard_type else 'none'
            type_counts[type_name] = type_counts.get(type_name, 0) + 1

        print("Keyboard types count:")
        for type_name, count in sorted(type_counts.items()):
            print(f"  - {type_name}: {count}")

        print()
        print("[NEXT STEPS]:")
        print("  1. Update API endpoints (keyboards.py)")
        print("  2. Update frontend types and components")
        print("  3. Test and remove deprecated fields")

    except Exception as e:
        db.rollback()
        print(f"[ERROR] Migration failed: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()


if __name__ == "__main__":
    print("=" * 60)
    print("Keyboard Type Field Migration")
    print("=" * 60)
    print()

    migrate_keyboard_types()
