"""
Quick API test script
"""
import requests
import json
import sys
import io

# Set UTF-8 encoding for Windows console
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

BASE_URL = "http://localhost:8000"

print("=" * 60)
print("API 테스트 시작")
print("=" * 60)

# 1. Health check
print("\n1. Health Check")
response = requests.get(f"{BASE_URL}/health")
print(f"Status: {response.status_code}")
print(f"Response: {response.json()}\n")

# 2. Admin login
print("2. Admin Login")
response = requests.post(
    f"{BASE_URL}/api/admin/login",
    json={"username": "admin", "password": "admin123"}
)
print(f"Status: {response.status_code}")
data = response.json()
print(f"Token received: {data['access_token'][:50]}...\n")
token = data['access_token']

headers = {"Authorization": f"Bearer {token}"}

# 3. Get all keyboards
print("3. 전체 키보드 목록")
response = requests.get(f"{BASE_URL}/api/keyboards")
print(f"Status: {response.status_code}")
data = response.json()
print(f"총 {data['total']}개의 키보드")
for kb in data['keyboards']:
    print(f"  - {kb['name']} (₩{kb['price']:,})")
print()

# 4. Filter by wireless
print("4. 무선 키보드 필터링")
response = requests.get(f"{BASE_URL}/api/keyboards?is_wireless=true")
data = response.json()
print(f"무선 키보드: {data['total']}개")
for kb in data['keyboards']:
    print(f"  - {kb['name']}")
print()

# 5. Search
print("5. 키보드 검색 (search=Corne)")
response = requests.get(f"{BASE_URL}/api/keyboards?search=Corne")
data = response.json()
print(f"검색 결과: {data['total']}개")
for kb in data['keyboards']:
    print(f"  - {kb['name']}")
print()

# 6. Sort by price
print("6. 가격순 정렬 (내림차순)")
response = requests.get(f"{BASE_URL}/api/keyboards?sort_by=price_desc")
data = response.json()
for kb in data['keyboards']:
    print(f"  - {kb['name']}: ₩{kb['price']:,}")
print()

# 7. Compare keyboards
print("7. 키보드 비교 (ID: 1, 2)")
response = requests.post(
    f"{BASE_URL}/api/keyboards/compare",
    json={"keyboard_ids": [1, 2]}
)
data = response.json()
print("비교 결과:")
for kb in data['keyboards']:
    print(f"  - {kb['name']}")
    print(f"    가격: ₩{kb['price']:,}")
    print(f"    무선: {kb['tags']['is_wireless']}")
    print(f"    틸팅: {kb['tags']['has_tenting']}")
    print(f"    디스플레이: {kb['tags']['has_display']}")
print()

# 8. Get admin accounts
print("8. 관리자 계정 목록")
response = requests.get(f"{BASE_URL}/api/admin/accounts", headers=headers)
print(f"Status: {response.status_code}")
data = response.json()
print(f"관리자 계정: {len(data['accounts'])}개")
for acc in data['accounts']:
    print(f"  - {acc['username']} (ID: {acc['id']})")
print()

# 9. Price range filter
print("9. 가격대 필터 (40,000 ~ 50,000)")
response = requests.get(f"{BASE_URL}/api/keyboards?min_price=40000&max_price=50000")
data = response.json()
print(f"결과: {data['total']}개")
for kb in data['keyboards']:
    print(f"  - {kb['name']}: ₩{kb['price']:,}")
print()

# 10. Multiple filters
print("10. 복합 필터 (무선 + 오소리니어)")
response = requests.get(f"{BASE_URL}/api/keyboards?is_wireless=true&has_ortholinear=true")
data = response.json()
print(f"결과: {data['total']}개")
for kb in data['keyboards']:
    print(f"  - {kb['name']}")
print()

print("=" * 60)
print("모든 테스트 완료!")
print("=" * 60)
