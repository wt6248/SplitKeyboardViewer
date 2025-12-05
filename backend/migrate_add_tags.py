"""
Migration script to add has_column_stagger and has_splay columns to keyboards table
"""
import sqlite3
import os

# Get the database path
db_path = os.path.join(os.path.dirname(__file__), 'database.db')

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    # Check if columns already exist
    cursor.execute("PRAGMA table_info(keyboards)")
    columns = [column[1] for column in cursor.fetchall()]

    # Add has_column_stagger column if it doesn't exist
    if 'has_column_stagger' not in columns:
        print("Adding has_column_stagger column...")
        cursor.execute("""
            ALTER TABLE keyboards
            ADD COLUMN has_column_stagger BOOLEAN DEFAULT 0
        """)
        print(">> has_column_stagger column added")
    else:
        print("has_column_stagger column already exists")

    # Add has_splay column if it doesn't exist
    if 'has_splay' not in columns:
        print("Adding has_splay column...")
        cursor.execute("""
            ALTER TABLE keyboards
            ADD COLUMN has_splay BOOLEAN DEFAULT 0
        """)
        print(">> has_splay column added")
    else:
        print("has_splay column already exists")

    # Commit the changes
    conn.commit()
    print("\nMigration completed successfully!")

except Exception as e:
    print(f"Error during migration: {e}")
    conn.rollback()
    raise
finally:
    conn.close()
