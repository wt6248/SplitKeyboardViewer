# Phase 5: 배포 및 최적화 작업 계획

## 목표
로컬 개발 환경에서 테스트 가능한 배포 준비 및 성능 최적화 작업 수행

## 작업 항목

### 1. 프론트엔드 프로덕션 빌드 설정 ⏳
- [x] Vite 프로덕션 빌드 설정 확인
- [ ] 환경 변수 설정 (.env.production)
- [ ] 빌드 최적화 옵션 설정
- [ ] 번들 사이즈 분석

### 2. Google Analytics 연동 ⏳
- [ ] GA4 추적 코드 통합
- [ ] 주요 이벤트 추적 설정
  - 필터 사용
  - 비교 기능 사용
  - 검색 쿼리
  - 외부 링크 클릭
- [ ] 커스텀 훅으로 GA 추적 기능 구현

### 3. 이미지 최적화 ⏳
- [ ] Lazy loading 구현
- [ ] WebP 포맷 지원
- [ ] 이미지 압축 유틸리티
- [ ] Placeholder 이미지

### 4. 성능 최적화 ⏳
- [ ] React.memo 적용
- [ ] useMemo, useCallback 최적화
- [ ] 코드 스플리팅 (React.lazy)
- [ ] API 응답 캐싱

### 5. Nginx 설정 ⏳
- [ ] 프론트엔드 정적 파일 서빙 설정
- [ ] API 프록시 설정
- [ ] CORS 설정
- [ ] Gzip 압축 설정
- [ ] 캐싱 헤더 설정

### 6. 배포 스크립트 ⏳
- [ ] 백엔드 배포 스크립트
- [ ] 프론트엔드 빌드 및 배포 스크립트
- [ ] 데이터베이스 마이그레이션 스크립트
- [ ] 환경 설정 가이드

### 7. 테스트 ⏳
- [ ] 프로덕션 빌드 테스트
- [ ] 성능 테스트 (Lighthouse)
- [ ] 통합 테스트
- [ ] 브라우저 호환성 테스트

## 작업 진행 상황

### 2025-12-05

#### 초기 설정
- Phase 4 구현 완료 확인
- Phase 5 작업 계획 수립
- plan.md 생성

#### 1. 프론트엔드 프로덕션 빌드 설정 ✅
- Vite 프로덕션 빌드 설정 완료
- 환경 변수 설정 (.env.production)
- 빌드 최적화 옵션 설정 (esbuild minify, 청크 분할)
- 개발 서버 프록시 설정
- 빌드 성공 확인
  - index.html: 0.54 kB (gzip: 0.32 kB)
  - CSS: 17.92 kB (gzip: 4.00 kB)
  - react-vendor.js: 44.53 kB (gzip: 15.98 kB)
  - main bundle: 250.25 kB (gzip: 79.22 kB)

#### 2. Google Analytics 연동 ✅
- GA4 추적 유틸리티 구현 (`src/utils/analytics.ts`)
- 이벤트 추적 함수:
  - 페이지뷰 추적
  - 검색 이벤트
  - 필터 사용 이벤트
  - 비교 기능 이벤트
  - 외부 링크 클릭 이벤트
  - 정렬 변경 이벤트
- 커스텀 훅 구현 (`src/hooks/useAnalytics.ts`)

#### 3. 이미지 최적화 및 Lazy Loading ✅
- LazyImage 컴포넌트 구현
- Intersection Observer 기반 lazy loading
- 이미지 로딩 상태 표시 (blur 효과)
- Placeholder 이미지 지원
- 50px 전 사전 로딩 최적화

#### 4. Nginx 설정 ✅
- 프로덕션 Nginx 설정 파일 작성
- Gzip 압축 설정
- 정적 파일 캐싱 (1년)
- API 프록시 설정
- Rate Limiting (10 req/s)
- SSL/TLS 설정 템플릿
- 보안 헤더 설정

#### 5. 배포 스크립트 ✅
- 서버 초기 설정 스크립트 (`deployment/setup-server.sh`)
  - 시스템 패키지 설치
  - Python, Node.js 설치
  - 프로젝트 클론
  - 백엔드 가상환경 설정
  - Systemd 서비스 등록
  - Nginx 설정
- 배포 자동화 스크립트 (`deployment/deploy.sh`)
  - Git pull
  - 의존성 설치
  - 프론트엔드 빌드
  - 서비스 재시작
- 배포 가이드 문서 (`deployment/DEPLOYMENT.md`)
  - 사전 요구사항
  - 단계별 배포 가이드
  - SSL 인증서 설정
  - 서비스 관리 방법
  - 백업 설정
  - 트러블슈팅

#### 6. 테스트 구성 ✅
- Phase 5 통합 테스트 스크립트 작성 (`test_phase5.js`)
- 환경 변수 기반 테스트 설정 (`.env.test`)
- 테스트 항목:
  1. 백엔드 서버 상태 확인
  2. 관리자 로그인
  3. 키보드 CRUD (생성/조회/수정/삭제)
  4. 계정 관리 (조회/생성/삭제)
  5. 프론트엔드 빌드 확인
- 상세한 로그 출력 및 색상 구분

#### 테스트 실행 방법
```bash
# 1. .env.test 파일에 관리자 계정 정보 입력
# ADMIN_USERNAME=your_admin
# ADMIN_PASSWORD=your_password

# 2. 백엔드 서버 실행 (별도 터미널)
cd backend
python run.py

# 3. 테스트 실행
node test_phase5.js
```

## 참고사항

### 배포 환경 (Oracle Cloud)
- 실제 Oracle Cloud 배포는 서버 환경이 필요
- 로컬에서는 설정 파일과 스크립트만 준비
- Nginx 설정은 로컬 테스트 가능 (Docker 사용)

### 성능 목표
- Lighthouse Score: 90+ (Performance)
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle Size: < 500KB (gzipped)

### 보안 고려사항
- HTTPS 적용 (Let's Encrypt)
- 환경 변수 보안 관리
- API Rate Limiting
- CORS 정책

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
