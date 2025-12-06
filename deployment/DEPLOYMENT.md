# 배포 가이드

## 사전 요구사항

- Oracle Cloud VM (Ubuntu 20.04 이상)
- 도메인 네임 (DNS 설정 완료)
- Git 저장소 접근 권한

## 1. 초기 서버 설정

### 서버 접속
```bash
ssh ubuntu@your-server-ip
```

### 설정 스크립트 실행
```bash
# 스크립트 다운로드
wget https://raw.githubusercontent.com/wt6248/SplitKeyboardViewer/main/deployment/setup-server.sh

# 실행 권한 부여
chmod +x setup-server.sh

# 실행
./setup-server.sh
```

### 환경 변수 설정
```bash
cd /home/ubuntu/split-keyboard/backend
nano .env
```

`.env` 파일에서 다음 설정:
```env
SECRET_KEY=your-generated-secret-key-here
UPLOAD_DIR=/var/lib/split-keyboard/uploads
```

SECRET_KEY 생성:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

**중요**: `UPLOAD_DIR`을 `/var/lib/split-keyboard/uploads`로 설정하여 업로드된 파일이 올바른 위치에 저장되도록 합니다.

### 관리자 계정 생성
```bash
cd /home/ubuntu/split-keyboard/backend
source venv/bin/activate
python create_admin.py admin yourpassword
```

### 프론트엔드 환경 변수 설정
```bash
cd /home/ubuntu/split-keyboard/frontend
nano .env.production
```

`.env.production` 파일에서 Google Analytics ID 설정:
```env
VITE_API_BASE_URL=/api
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 2. SSL 인증서 설정 (Let's Encrypt)

### Certbot 설치
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### SSL 인증서 발급
```bash
sudo certbot --nginx -d your-domain.com
```

### Nginx 설정 업데이트
```bash
sudo nano /etc/nginx/sites-available/split-keyboard
```

다음 부분의 주석 해제:
```nginx
# SSL 인증서 설정
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

# HTTPS 리다이렉트
return 301 https://$server_name$request_uri;
```

### Nginx 재시작
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 3. 첫 배포

### 배포 스크립트 실행
```bash
cd /home/ubuntu/split-keyboard
chmod +x deployment/deploy.sh
./deployment/deploy.sh
```

## 4. 서비스 관리

### 백엔드 서비스 상태 확인
```bash
sudo systemctl status split-keyboard-backend
```

### 로그 확인
```bash
# 백엔드 로그
sudo journalctl -u split-keyboard-backend -f

# Nginx 에러 로그
sudo tail -f /var/log/nginx/split-keyboard-error.log

# Nginx 액세스 로그
sudo tail -f /var/log/nginx/split-keyboard-access.log
```

### 서비스 재시작
```bash
# 백엔드 재시작
sudo systemctl restart split-keyboard-backend

# Nginx 재로드
sudo systemctl reload nginx
```

## 5. 업데이트 배포

코드를 업데이트한 후:
```bash
cd /home/ubuntu/split-keyboard
./deployment/deploy.sh
```

## 6. 백업

### 데이터베이스 백업
```bash
# 백업 디렉토리 생성
mkdir -p ~/backups

# 데이터베이스 백업
cp /var/lib/split-keyboard/database.db ~/backups/database-$(date +%Y%m%d-%H%M%S).db

# 업로드 파일 백업
tar -czf ~/backups/uploads-$(date +%Y%m%d-%H%M%S).tar.gz /var/lib/split-keyboard/uploads
```

### 자동 백업 설정 (crontab)
```bash
crontab -e
```

다음 추가 (매일 새벽 3시 백업):
```
0 3 * * * cp /var/lib/split-keyboard/database.db ~/backups/database-$(date +\%Y\%m\%d).db
0 3 * * * tar -czf ~/backups/uploads-$(date +\%Y\%m\%d).tar.gz /var/lib/split-keyboard/uploads
```

## 7. 모니터링

### 시스템 리소스 모니터링
```bash
# CPU, 메모리 사용량
htop

# 디스크 사용량
df -h

# 프로세스 확인
ps aux | grep python
```

### 서비스 상태 모니터링
```bash
# 백엔드 상태
curl http://localhost:8000/api/keyboards

# 프론트엔드 접속 테스트
curl -I https://your-domain.com
```

## 8. 트러블슈팅

### 백엔드가 시작되지 않을 때
```bash
# 로그 확인
sudo journalctl -u split-keyboard-backend -n 100

# 수동 실행으로 오류 확인
cd /home/ubuntu/split-keyboard/backend
source venv/bin/activate
python run.py
```

### Nginx 502 Bad Gateway
```bash
# 백엔드 서비스 상태 확인
sudo systemctl status split-keyboard-backend

# 포트 확인
sudo netstat -tlnp | grep 8000
```

### 권한 문제
```bash
# 업로드 디렉토리 권한 수정
sudo chown -R ubuntu:ubuntu /var/lib/split-keyboard
sudo chmod -R 755 /var/lib/split-keyboard
```

## 9. 보안 설정

### 방화벽 설정 (UFW)
```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### Fail2Ban 설치 (브루트포스 방어)
```bash
sudo apt install -y fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## 10. 성능 최적화

### Nginx 워커 프로세스 조정
```bash
# CPU 코어 수 확인
nproc

# /etc/nginx/nginx.conf 수정
worker_processes auto;
```

### 데이터베이스 최적화
```bash
cd /home/ubuntu/split-keyboard/backend
source venv/bin/activate
python -c "
from app.database import engine
from sqlalchemy import text
with engine.connect() as conn:
    conn.execute(text('VACUUM'))
    conn.execute(text('ANALYZE'))
"
```

## 지원

문제가 발생하면 GitHub Issues에 보고하세요:
https://github.com/your-username/split-keyboard/issues
