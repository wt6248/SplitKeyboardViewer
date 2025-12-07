# Phase 6: 기능 개선 및 UX 향상 작업 계획

## 목표
fixlist.md의 개선 사항을 구현하여 사용자 경험 향상 및 기능 확장

---

## Phase 5 완료 요약 ✅

Phase 5 (배포 및 최적화)는 2025-12-05에 완료되었습니다:
- 프론트엔드 프로덕션 빌드 설정 완료
- Google Analytics 연동 완료
- 이미지 최적화 및 Lazy Loading 구현
- Nginx 설정 완료
- 배포 스크립트 작성 완료
- 프로덕션 환경 API 경로 문제 해결 (2025-12-06)

---

## Phase 6 작업 계획

## 작업 항목 (fixlist.md 기반)

### 우선순위 1: 긴급 수정 사항 ✅ 완료

#### 1-1. 홈페이지 제목 변경 ✅
**상태**: 완료 (2025-12-07)
- [x] MainPage 제목 확인
- [x] index.html의 title을 "스플릿 키보드 모아보기"로 변경
- [x] MainPage.tsx의 h1 텍스트를 "스플릿 키보드 모아보기"로 변경

**파일**:
- `frontend/index.html:7`
- `frontend/src/pages/MainPage.tsx:62-64`

#### 1-2. 대소문자 구분 없는 이름 정렬 ✅
**상태**: 완료 (2025-12-07)
- [x] SQLAlchemy collate 사용하여 대소문자 구분 없이 정렬
- [x] keyboards.py에서 `func.lower(Keyboard.name)` 사용

**파일**:
- `backend/app/routers/keyboards.py`

**적용된 코드**:
```python
from sqlalchemy import func
# name_asc
query = query.order_by(func.lower(Keyboard.name).asc())
# name_desc
query = query.order_by(func.lower(Keyboard.name).desc())
```

### 우선순위 2: UI/UX 개선 ✅ 완료

#### 2-1. 페이지네이션 UI 추가 ✅
**상태**: 완료 (2025-12-07)
- [x] API 레벨 페이지네이션 구현 완료
- [x] useKeyboards 훅에 page 상태 관리 완료
- [x] 페이지네이션 컴포넌트 생성 (`frontend/src/components/common/Pagination.tsx`)
- [x] MainPage에 페이지 버튼 UI 추가
- [x] 페이지 이동 시 스크롤 상단으로 이동

**구현된 기능**:
- ✅ 1, 2, 3, ... 페이지 번호 버튼 (ellipsis 지원)
- ✅ 이전/다음 버튼
- ✅ 현재 페이지 하이라이트
- ✅ 총 페이지 수 표시

#### 2-2. 스크롤 시 필터 패널 고정 ✅
**상태**: 완료 (2025-12-07)
- [x] 헤더 sticky 처리 완료
- [x] FilterPanel을 sticky로 변경
- [x] 적절한 z-index 및 top 위치 설정
- [x] 모바일 반응형 고려

**파일**:
- `frontend/src/pages/MainPage.tsx:77`

**적용된 코드**:
```tsx
<div className="sticky top-24 self-start">
  <FilterPanel ... />
</div>
```

### 우선순위 3: 데이터 모델 재구조화 (Breaking Change) ✅ 완료

#### 3-1. 키보드 종류 필드 추가 및 태그 재구조화 ✅
**상태**: 완료 (2025-12-07)

**단계별 작업**:

**Step 1: 백엔드 모델 변경** ✅
- [x] models.py에 `keyboard_type` Enum 필드 추가
  - 값: `typewriter`, `alice`, `ortholinear`, `column_stagger`, `splay`, `none`
- [x] has_ortholinear, has_column_stagger, has_splay 필드 deprecated
- [x] has_tenting, has_display 필드 deprecated (무선, 커서조작만 남김)

**Step 2: 스키마 및 API 변경** ✅
- [x] schemas.py에 KeyboardType enum 추가
- [x] KeyboardBase, KeyboardCreate에 keyboard_type 필드 추가
- [x] keyboards.py API에 keyboard_type 필터 추가
- [x] 태그 필터를 is_wireless, has_cursor_control만 남김

**Step 3: 데이터 마이그레이션 스크립트** ✅
- [x] 기존 데이터의 태그 값을 keyboard_type으로 변환
- [x] has_ortholinear=True → keyboard_type='ortholinear'
- [x] has_column_stagger=True → keyboard_type='column_stagger'
- [x] has_splay=True → keyboard_type='splay'
- [x] 로컬 환경 11개 키보드 마이그레이션 완료

**Step 4: 프론트엔드 변경** ✅
- [x] types/keyboard.ts에 KeyboardType 타입 추가
- [x] FilterPanel에 키보드 종류 드롭다운 추가 (327줄 → 213줄 단순화)
- [x] 오소리니어, 칼럼스태거, 스플레이 태그 필터 제거
- [x] 틸팅, 디스플레이 태그 필터 제거
- [x] KeyboardCard에서 keyboard_type 표시
- [x] useKeyboards hook 업데이트

**테스트** ✅
- [x] Frontend 빌드 성공
- [x] 통합 테스트 통과 (keyboard_type 필터, 태그 구조 검증)

**변경된 파일**:
- `backend/app/models.py`
- `backend/app/schemas.py`
- `backend/app/routers/keyboards.py`
- `backend/app/routers/admin.py`
- `backend/migrate_keyboard_type.py` (신규)
- `frontend/src/types/keyboard.ts`
- `frontend/src/hooks/useFilters.ts`
- `frontend/src/hooks/useKeyboards.ts`
- `frontend/src/components/keyboard/FilterPanel.tsx`
- `frontend/src/components/keyboard/KeyboardCard.tsx`
- `frontend/src/pages/MainPage.tsx`

### 우선순위 4: 권한 관리 시스템

#### 4-1. 계정 권한 등급 추가 ⏳
**상태**: 미구현 (DB 스키마 및 인증 로직 변경)

**단계별 작업**:

**Step 1: 백엔드 모델 변경**
- [ ] models.py Admin 모델에 `role` Enum 필드 추가
  - 값: `admin` (모든 권한), `editor` (키보드 추가만)
- [ ] 기본값: `editor`

**Step 2: 인증 및 권한 체크**
- [ ] auth.py에 역할 기반 권한 체크 함수 추가
  - `require_admin()` - admin 역할만 허용
  - `require_editor_or_admin()` - editor, admin 모두 허용
- [ ] admin.py에서 엔드포인트별 권한 체크 적용
  - POST /keyboards: editor 이상
  - PUT /keyboards: editor 이상
  - DELETE /keyboards: admin만
  - 계정 관리: admin만

**Step 3: 프론트엔드 변경**
- [ ] AuthContext에 role 정보 추가
- [ ] 관리자 페이지에서 role에 따라 UI 조건부 표시
- [ ] 계정 생성 시 role 선택 가능

**파일**:
- `backend/app/models.py`
- `backend/app/schemas.py`
- `backend/app/auth.py`
- `backend/app/routers/admin.py`
- `frontend/src/context/AuthContext.tsx`
- `frontend/src/pages/admin/`

## 작업 진행 상황

### 2025-12-07

#### Phase 6 작업 완료 ✅
**fixlist.md 9개 항목 중 8개 구현 완료 (89%)**

**완료된 작업**:
1. ✅ **긴급 수정**
   - 홈페이지 제목 변경 (index.html, MainPage.tsx)
   - 대소문자 구분 없는 정렬 (func.lower() 사용)

2. ✅ **UI/UX 개선**
   - 페이지네이션 UI 추가 (Pagination 컴포넌트)
   - Sticky 필터 패널 구현

3. ✅ **데이터 모델 재구조화 (Breaking Change)**
   - 백엔드: KeyboardType enum, keyboard_type 필드 추가
   - 백엔드: 태그 단순화 (무선, 커서조작만)
   - 백엔드: API 엔드포인트 업데이트
   - 프론트엔드: 전체 컴포넌트 업데이트
   - 데이터 마이그레이션: 로컬 환경 완료 (11개 키보드)
   - 테스트: 빌드 성공, 통합 테스트 통과

**남은 작업**:
4. ⏳ **권한 시스템** (선택사항) - Admin role 필드 추가

### 2025-12-06

#### 프로덕션 환경 API 경로 문제 해결 ✅
- VITE_API_BASE_URL을 빈 문자열로 설정하여 /api/api 중복 문제 해결
- 방어적 코딩 추가 (optional chaining)
- 프론트엔드 빌드 완료
- 상세 내용: status.md 참조

### 2025-12-05 (Phase 5 완료)

#### 배포 및 최적화 작업 완료 ✅
- 프론트엔드 프로덕션 빌드 설정
- Google Analytics 연동
- 이미지 Lazy Loading
- Nginx 설정 및 배포 스크립트
- 통합 테스트 구성

## 참고사항

### fixlist.md 구현 우선순위 권장사항

**즉시 구현 가능 (1-2일)**:
1. 홈페이지 제목 변경
2. 대소문자 구분 없는 정렬
3. 페이지네이션 UI

**단기 구현 (3-5일)**:
4. 스크롤 시 필터 고정

**중기 구현 (1-2주, Breaking Change)**:
5. 키보드 종류 필드 추가 및 태그 재구조화
   - 기존 데이터 마이그레이션 필요
   - 프론트엔드 전체 테스트 필요

**장기 구현 (2-3주)**:
6. 계정 권한 시스템
   - 인증 로직 재설계 필요
   - 관리자 페이지 UI 변경 필요

---

## Oracle Cloud 서버 세팅 방법

### 사전 준비
- Oracle Cloud 계정 생성
- VM 인스턴스 생성 (Ubuntu 20.04 이상)
- 도메인 네임 준비 및 DNS 설정
- SSH 키 생성 및 등록

### 1단계: 서버 접속 및 초기 설정

#### SSH 접속
```bash
ssh ubuntu@your-server-ip
```

#### 시스템 업데이트
```bash
sudo apt update && sudo apt upgrade -y
```

#### 필수 패키지 설치
```bash
sudo apt install -y git python3-pip python3-venv nginx
```

### 2단계: 프로젝트 배포

#### 자동 설정 스크립트 사용 (권장)
```bash
# 프로젝트 클론
cd /home/ubuntu
git clone https://github.com/your-username/split-keyboard.git
cd split-keyboard

# 초기 설정 스크립트 실행
chmod +x deployment/setup-server.sh
./deployment/setup-server.sh
```

#### 수동 설정 (스크립트가 실패할 경우)

**1. Node.js 설치**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**2. Python 가상환경 설정**
```bash
cd /home/ubuntu/split-keyboard/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**3. 프론트엔드 빌드**
```bash
cd /home/ubuntu/split-keyboard/frontend
npm install
npm run build
```

**4. 디렉토리 생성 및 권한 설정**
```bash
sudo mkdir -p /var/lib/split-keyboard/uploads
sudo mkdir -p /var/www/frontend
sudo cp -r /home/ubuntu/split-keyboard/frontend/dist/* /var/www/frontend/
sudo chown -R ubuntu:ubuntu /var/lib/split-keyboard
sudo chmod -R 755 /var/lib/split-keyboard
```

### 3단계: 환경 변수 설정

#### SECRET_KEY 생성
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

#### 백엔드 환경 변수 (.env)
```bash
cd /home/ubuntu/split-keyboard/backend
nano .env
```

내용:
```env
SECRET_KEY=생성된_시크릿_키_여기에_입력
```

#### 프론트엔드 환경 변수 (.env.production)
```bash
cd /home/ubuntu/split-keyboard/frontend
nano .env.production
```

내용:
```env
VITE_API_BASE_URL=/api
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4단계: 관리자 계정 생성

```bash
cd /home/ubuntu/split-keyboard/backend
source venv/bin/activate
python create_admin.py admin your_secure_password
```

### 5단계: Systemd 서비스 설정

#### 백엔드 서비스 파일 생성
```bash
sudo nano /etc/systemd/system/split-keyboard-backend.service
```

내용:
```ini
[Unit]
Description=Split Keyboard Backend API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/split-keyboard/backend
Environment="PATH=/home/ubuntu/split-keyboard/backend/venv/bin"
ExecStart=/home/ubuntu/split-keyboard/backend/venv/bin/python run.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

#### 서비스 활성화 및 시작
```bash
sudo systemctl daemon-reload
sudo systemctl enable split-keyboard-backend
sudo systemctl start split-keyboard-backend
sudo systemctl status split-keyboard-backend
```

### 6단계: Nginx 설정

#### Nginx 설정 파일 복사
```bash
sudo cp /home/ubuntu/split-keyboard/deployment/nginx.conf /etc/nginx/sites-available/split-keyboard
```

#### 도메인 이름 수정
```bash
sudo nano /etc/nginx/sites-available/split-keyboard
# server_name을 실제 도메인으로 변경
```

#### 심볼릭 링크 생성 및 기본 사이트 비활성화
```bash
sudo ln -s /etc/nginx/sites-available/split-keyboard /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
```

#### Nginx 설정 테스트 및 재시작
```bash
sudo nginx -t
sudo systemctl restart nginx
```

### 7단계: SSL 인증서 설정 (Let's Encrypt)

#### Certbot 설치
```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### SSL 인증서 발급
```bash
sudo certbot --nginx -d your-domain.com
```

프롬프트에서:
- 이메일 입력
- 약관 동의
- HTTPS 리다이렉트 선택 (권장: Yes)

#### 자동 갱신 설정 확인
```bash
sudo systemctl status certbot.timer
```

### 8단계: 방화벽 설정

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
```

### 9단계: 배포 확인

#### 서비스 상태 확인
```bash
# 백엔드 상태
sudo systemctl status split-keyboard-backend

# Nginx 상태
sudo systemctl status nginx

# 포트 확인
sudo netstat -tlnp | grep 8000
```

#### API 테스트
```bash
curl http://localhost:8000/api/keyboards
```

#### 웹 브라우저에서 확인
```
https://your-domain.com
```

### 10단계: 모니터링 및 로그

#### 로그 확인
```bash
# 백엔드 로그
sudo journalctl -u split-keyboard-backend -f

# Nginx 에러 로그
sudo tail -f /var/log/nginx/split-keyboard-error.log

# Nginx 액세스 로그
sudo tail -f /var/log/nginx/split-keyboard-access.log
```

### 업데이트 배포

코드 변경 후 배포:
```bash
cd /home/ubuntu/split-keyboard
./deployment/deploy.sh
```

### 백업 설정

#### 수동 백업
```bash
# 데이터베이스 백업
cp /var/lib/split-keyboard/database.db ~/backups/database-$(date +%Y%m%d).db

# 업로드 파일 백업
tar -czf ~/backups/uploads-$(date +%Y%m%d).tar.gz /var/lib/split-keyboard/uploads
```

#### 자동 백업 (crontab)
```bash
crontab -e
```

추가:
```cron
# 매일 새벽 3시 백업
0 3 * * * cp /var/lib/split-keyboard/database.db ~/backups/database-$(date +\%Y\%m\%d).db
0 3 * * * tar -czf ~/backups/uploads-$(date +\%Y\%m\%d).tar.gz /var/lib/split-keyboard/uploads

# 30일 이전 백업 삭제
0 4 * * * find ~/backups -name "database-*.db" -mtime +30 -delete
0 4 * * * find ~/backups -name "uploads-*.tar.gz" -mtime +30 -delete
```

### 트러블슈팅

#### 백엔드가 시작되지 않을 때
```bash
# 로그 확인
sudo journalctl -u split-keyboard-backend -n 100

# 수동 실행으로 오류 확인
cd /home/ubuntu/split-keyboard/backend
source venv/bin/activate
python run.py
```

#### Nginx 502 Bad Gateway
```bash
# 백엔드 서비스 상태 확인
sudo systemctl status split-keyboard-backend

# 포트 확인
sudo netstat -tlnp | grep 8000

# 백엔드 재시작
sudo systemctl restart split-keyboard-backend
```

#### 권한 문제
```bash
sudo chown -R ubuntu:ubuntu /var/lib/split-keyboard
sudo chmod -R 755 /var/lib/split-keyboard
```

### 보안 강화 (선택사항)

#### Fail2Ban 설치
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

#### SSH 보안 강화
```bash
sudo nano /etc/ssh/sshd_config
```

권장 설정:
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

재시작:
```bash
sudo systemctl restart sshd
```

---

## 참고 자료

- 상세 배포 가이드: [deployment/DEPLOYMENT.md](deployment/DEPLOYMENT.md)
- Nginx 설정: [deployment/nginx.conf](deployment/nginx.conf)
- 자동 배포 스크립트: [deployment/deploy.sh](deployment/deploy.sh)
- Oracle Cloud 문서: https://docs.oracle.com/cloud/
