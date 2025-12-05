import sqlite3

# 데이터베이스 연결
conn = sqlite3.connect('database.db')
cursor = conn.cursor()

# 관리자 계정 조회
print("=== 관리자 계정 목록 ===")
cursor.execute("SELECT id, username, created_at FROM admins")
admins = cursor.fetchall()

if admins:
    for admin in admins:
        print(f"ID: {admin[0]}, Username: {admin[1]}, Created: {admin[2]}")
else:
    print("관리자 계정이 없습니다.")

conn.close()
