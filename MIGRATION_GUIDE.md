# 원격 서버 데이터 마이그레이션 가이드 (v0.0.3 → v0.0.4)

## 개요

이 가이드는 v0.0.3에서 v0.0.4로 업그레이드하기 위한 데이터베이스 마이그레이션 절차를 설명합니다.

### 주요 변경사항 (Breaking Changes)
- **keyboard_type 필드 추가**: 키보드 종류를 Enum으로 관리 (typewriter, alice, ortholinear, column_stagger, splay, none)
- **태그 단순화**: 7개 → 2개 (무선, 커서조작만 남김)
- **deprecated 필드**: has_ortholinear, has_column_stagger, has_splay, has_tenting, has_display

---

## 사전 준비

### 1. 백업 생성 (필수!)

```bash
# SSH로 서버 접속
ssh ubuntu@your-server-ip

# 백업 디렉토리 생성
mkdir -p ~/backups/v0.0.3

# 데이터베이스 백업
sudo cp /var/lib/split-keyboard/database.db ~/backups/v0.0.3/database-$(date +%Y%m%d-%H%M%S).db

# 업로드 파일 백업
sudo tar -czf ~/backups/v0.0.3/uploads-$(date +%Y%m%d-%H%M%S).tar.gz /var/lib/split-keyboard/uploads

# 백업 확인
ls -lh ~/backups/v0.0.3/
```

### 2. 현재 상태 확인

```bash
# 백엔드 서비스 상태 확인
sudo systemctl status split-keyboard-backend

# 데이터베이스 위치 확인
ls -lh /var/lib/split-keyboard/database.db

# 현재 키보드 개수 확인
cd /home/ubuntu/split-keyboard/backend
source venv/bin/activate
python -c "
from sqlalchemy import create_engine, text
engine = create_engine('sqlite:////var/lib/split-keyboard/database.db')
with engine.connect() as conn:
    result = conn.execute(text('SELECT COUNT(*) FROM keyboards'))
    print(f'Total keyboards: {result.scalar()}')
"
```

---

## 마이그레이션 절차

### Step 1: 코드 업데이트

```bash
cd /home/ubuntu/split-keyboard

# 최신 코드 가져오기
git fetch origin
git checkout main
git pull origin main

# 변경사항 확인
git log -3 --oneline
```

### Step 2: 백엔드 서비스 중지

```bash
# 서비스 중지
sudo systemctl stop split-keyboard-backend

# 중지 확인
sudo systemctl status split-keyboard-backend
```

### Step 3: 의존성 업데이트

```bash
cd /home/ubuntu/split-keyboard/backend
source venv/bin/activate

# 의존성 재설치
pip install -r requirements.txt
```

### Step 4: 데이터베이스 마이그레이션 실행

```bash
# 마이그레이션 스크립트 실행
python migrate_keyboard_type.py
```

**예상 출력**:
```
[INFO] Starting keyboard type migration...
[INFO] Database path: /var/lib/split-keyboard/database.db

[CHECK] Checking if keyboard_type column exists...
[INFO] keyboard_type column found

[INFO] Starting migration for XX keyboards...

[MIGRATE] Keyboard 'XXX' (ID: X):
  Old tags: has_ortholinear=True, has_column_stagger=False, has_splay=False
  New type: ortholinear
  [OK] Updated

[MIGRATE] Keyboard 'YYY' (ID: Y):
  Old tags: has_ortholinear=False, has_column_stagger=True, has_splay=False
  New type: column_stagger
  [OK] Updated

...

[SUCCESS] Migration completed!
  - Total keyboards: XX
  - Updated: YY
  - Already correct: ZZ

[INFO] Type distribution:
  - ortholinear: X
  - column_stagger: Y
  - splay: Z
  - none: W
```

**마이그레이션 실패 시**:
```bash
# 백업 복원
sudo systemctl stop split-keyboard-backend
sudo cp ~/backups/v0.0.3/database-*.db /var/lib/split-keyboard/database.db
sudo systemctl start split-keyboard-backend
```

### Step 5: 마이그레이션 검증

```bash
# 데이터 확인 스크립트 실행
python -c "
from sqlalchemy import create_engine, text
import json

engine = create_engine('sqlite:////var/lib/split-keyboard/database.db')
with engine.connect() as conn:
    # keyboard_type 분포 확인
    result = conn.execute(text('''
        SELECT keyboard_type, COUNT(*) as count
        FROM keyboards
        GROUP BY keyboard_type
    '''))
    print('Keyboard type distribution:')
    for row in result:
        print(f'  - {row[0]}: {row[1]}')

    # 샘플 데이터 확인
    print('\\nSample keyboards:')
    result = conn.execute(text('''
        SELECT id, name, keyboard_type, is_wireless, has_cursor_control
        FROM keyboards
        LIMIT 5
    '''))
    for row in result:
        print(f'  {row[1]}: type={row[2]}, wireless={row[3]}, cursor={row[4]}')
"
```

### Step 6: 프론트엔드 빌드 및 배포

```bash
cd /home/ubuntu/split-keyboard/frontend

# 의존성 설치
npm install

# 프로덕션 빌드
npm run build

# 빌드 파일 배포
sudo rm -rf /var/www/split-keyboard/frontend/*
sudo cp -r dist/* /var/www/split-keyboard/frontend/

# 권한 설정
sudo chown -R www-data:www-data /var/www/frontend
```

### Step 7: 백엔드 서비스 재시작

```bash
# 서비스 시작
sudo systemctl start split-keyboard-backend

# 상태 확인
sudo systemctl status split-keyboard-backend

# 로그 확인
sudo journalctl -u split-keyboard-backend -n 50 --no-pager
```

### Step 8: API 테스트

```bash
# 기본 엔드포인트 테스트
curl http://localhost:8000/api/keyboards | jq '.total'

# keyboard_type 필터 테스트
curl 'http://localhost:8000/api/keyboards?keyboard_type=ortholinear' | jq '.total'
curl 'http://localhost:8000/api/keyboards?keyboard_type=column_stagger' | jq '.total'
curl 'http://localhost:8000/api/keyboards?keyboard_type=splay' | jq '.total'

# 태그 구조 확인
curl http://localhost:8000/api/keyboards | jq '.keyboards[0].tags'
# 예상 출력: {"is_wireless": false, "has_cursor_control": false}
```

### Step 9: 웹 브라우저 테스트

1. 브라우저에서 `https://your-domain.com` 접속
2. 캐시 초기화 (Ctrl+Shift+R / Cmd+Shift+R)
3. 확인 사항:
   - ✅ 키보드 목록이 정상적으로 표시되는지
   - ✅ 필터 패널에 "키보드 종류" 드롭다운이 있는지
   - ✅ 키보드 종류 필터가 작동하는지 (오소리니어, 칼럼스태거, 스플레이 등)
   - ✅ 태그가 2개만 표시되는지 (무선, 커서조작)
   - ✅ 페이지네이션이 작동하는지
   - ✅ 필터 패널이 스크롤 시 고정되는지

---

## 롤백 절차 (문제 발생 시)

### 1. 서비스 중지

```bash
sudo systemctl stop split-keyboard-backend
```

### 2. 백업 복원

```bash
# 데이터베이스 복원
sudo cp ~/backups/v0.0.3/database-*.db /var/lib/split-keyboard/database.db

# 업로드 파일 복원 (필요시)
cd /var/lib/split-keyboard
sudo tar -xzf ~/backups/v0.0.3/uploads-*.tar.gz -C /
```

### 3. 이전 버전으로 롤백

```bash
cd /home/ubuntu/split-keyboard

# v0.0.3 태그로 체크아웃 (태그가 있다면)
git checkout v0.0.3

# 또는 특정 커밋으로 롤백
git checkout <commit-hash>

# 의존성 재설치
cd backend
source venv/bin/activate
pip install -r requirements.txt

# 프론트엔드 재빌드
cd ../frontend
npm install
npm run build
sudo rm -rf /var/www/frontend/*
sudo cp -r dist/* /var/www/frontend/
```

### 4. 서비스 재시작

```bash
sudo systemctl start split-keyboard-backend
sudo systemctl status split-keyboard-backend
```

---

## 트러블슈팅

### 문제 1: "keyboard_type column not found" 에러

**원인**: 데이터베이스에 keyboard_type 컬럼이 없음

**해결**:
```bash
cd /home/ubuntu/split-keyboard/backend
source venv/bin/activate

python -c "
from sqlalchemy import create_engine, text
engine = create_engine('sqlite:////var/lib/split-keyboard/database.db')
with engine.connect() as conn:
    conn.execute(text('''
        ALTER TABLE keyboards
        ADD COLUMN keyboard_type VARCHAR(50) DEFAULT 'none' NOT NULL
    '''))
    conn.commit()
    print('[OK] keyboard_type column added')
"

# 다시 마이그레이션 실행
python migrate_keyboard_type.py
```

### 문제 2: 프론트엔드에서 키보드가 안 보임

**원인**: API 응답 형식 변경으로 인한 문제

**해결**:
```bash
# 브라우저 캐시 완전 삭제
# Chrome: Settings → Privacy → Clear browsing data → Cached images and files

# API 응답 확인
curl http://localhost:8000/api/keyboards | jq '.keyboards[0]'

# 백엔드 로그 확인
sudo journalctl -u split-keyboard-backend -f
```

### 문제 3: Nginx 502 Bad Gateway

**원인**: 백엔드 서비스가 시작되지 않음

**해결**:
```bash
# 백엔드 상태 확인
sudo systemctl status split-keyboard-backend

# 로그 확인
sudo journalctl -u split-keyboard-backend -n 100

# 수동 실행으로 에러 확인
cd /home/ubuntu/split-keyboard/backend
source venv/bin/activate
python run.py

# 포트 확인
sudo netstat -tlnp | grep 8000
```

### 문제 4: 권한 오류

**해결**:
```bash
# 데이터베이스 권한 설정
sudo chown ubuntu:ubuntu /var/lib/split-keyboard/database.db
sudo chmod 644 /var/lib/split-keyboard/database.db

# uploads 디렉토리 권한
sudo chown -R ubuntu:ubuntu /var/lib/split-keyboard/uploads
sudo chmod -R 755 /var/lib/split-keyboard/uploads

# 프론트엔드 권한
sudo chown -R www-data:www-data /var/www/frontend
```

---

## 마이그레이션 체크리스트

사용하기 편하도록 체크리스트를 제공합니다:

- [ ] 1. 백업 생성 완료
- [ ] 2. 현재 상태 확인 완료
- [ ] 3. 최신 코드 가져오기 완료
- [ ] 4. 백엔드 서비스 중지 완료
- [ ] 5. 의존성 업데이트 완료
- [ ] 6. 데이터베이스 마이그레이션 실행 완료
- [ ] 7. 마이그레이션 검증 완료
- [ ] 8. 프론트엔드 빌드 및 배포 완료
- [ ] 9. 백엔드 서비스 재시작 완료
- [ ] 10. API 테스트 완료
- [ ] 11. 웹 브라우저 테스트 완료

---

## 참고 자료

### 관련 파일
- `backend/migrate_keyboard_type.py` - 마이그레이션 스크립트
- `backend/app/models.py` - 데이터베이스 모델
- `backend/app/schemas.py` - API 스키마
- `status.md` - 프로젝트 진행 상황
- `plan.md` - 작업 계획

### 변경된 엔드포인트
- `GET /api/keyboards?keyboard_type={type}` - 새로운 필터 추가
- 응답 형식: `tags` 객체가 2개 필드만 포함 (is_wireless, has_cursor_control)

### 데이터 마이그레이션 규칙
```
has_ortholinear=True    → keyboard_type='ortholinear'
has_column_stagger=True → keyboard_type='column_stagger'
has_splay=True          → keyboard_type='splay'
기타                     → keyboard_type='none'
```

우선순위: ortholinear > column_stagger > splay

---

## 마이그레이션 완료 후

### 1. 모니터링

```bash
# 백엔드 로그 모니터링
sudo journalctl -u split-keyboard-backend -f

# Nginx 에러 로그
sudo tail -f /var/log/nginx/split-keyboard-error.log

# 시스템 리소스
htop
```

### 2. 성능 확인

```bash
# API 응답 시간 확인
time curl http://localhost:8000/api/keyboards

# 데이터베이스 크기
ls -lh /var/lib/split-keyboard/database.db
```

### 3. 정기 백업 설정

마이그레이션 후에도 정기 백업을 유지하세요:

```bash
# crontab 확인
crontab -l

# 백업 스크립트가 없다면 추가
crontab -e

# 매일 새벽 3시 백업
0 3 * * * cp /var/lib/split-keyboard/database.db ~/backups/database-$(date +\%Y\%m\%d).db
```

---

## 문의 및 지원

마이그레이션 중 문제가 발생하면:
1. 로그 확인: `sudo journalctl -u split-keyboard-backend -n 100`
2. 백업 복원: 위의 "롤백 절차" 참조
3. GitHub Issues: 문제 보고

**중요**: 마이그레이션 전 반드시 백업을 생성하세요!
