#!/bin/bash

# Oracle Cloud 서버 초기 설정 스크립트

set -e

echo "=== 서버 초기 설정 시작 ==="

# 설정
PROJECT_DIR="/home/ubuntu/split-keyboard"
BACKEND_SERVICE_FILE="/etc/systemd/system/split-keyboard-backend.service"

echo "[1/10] 시스템 업데이트..."
sudo apt update && sudo apt upgrade -y

echo "[2/10] 필수 패키지 설치..."
sudo apt install -y python3 python3-pip python3-venv nginx git curl

echo "[3/10] Node.js 설치 (v20)..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "[4/10] 프로젝트 클론..."
if [ ! -d "$PROJECT_DIR" ]; then
    git clone https://github.com/your-username/split-keyboard.git $PROJECT_DIR
fi

echo "[5/10] 백엔드 가상환경 설정..."
cd $PROJECT_DIR/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

echo "[6/10] 환경 변수 설정..."
if [ ! -f "$PROJECT_DIR/backend/.env" ]; then
    cp $PROJECT_DIR/backend/.env.example $PROJECT_DIR/backend/.env
    echo "⚠️  .env 파일을 수정하여 SECRET_KEY를 설정하세요!"
fi

echo "[7/10] 관리자 계정 생성..."
echo "관리자 계정을 생성하세요 (예: python create_admin.py admin yourpassword)"

echo "[8/10] 백엔드 systemd 서비스 생성..."
sudo tee $BACKEND_SERVICE_FILE > /dev/null <<EOF
[Unit]
Description=Split Keyboard Backend API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=$PROJECT_DIR/backend
Environment="PATH=$PROJECT_DIR/backend/venv/bin"
ExecStart=$PROJECT_DIR/backend/venv/bin/python run.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo "[9/10] 서비스 활성화..."
sudo systemctl daemon-reload
sudo systemctl enable split-keyboard-backend
sudo systemctl start split-keyboard-backend

echo "[10/10] Nginx 설정..."
sudo cp $PROJECT_DIR/deployment/nginx.conf /etc/nginx/sites-available/split-keyboard
sudo ln -sf /etc/nginx/sites-available/split-keyboard /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

echo "=== 서버 설정 완료! ==="
echo ""
echo "다음 단계:"
echo "1. $PROJECT_DIR/backend/.env 파일에서 SECRET_KEY 설정"
echo "2. 관리자 계정 생성: cd $PROJECT_DIR/backend && python create_admin.py admin yourpassword"
echo "3. deployment/deploy.sh 실행하여 첫 배포"
echo "4. Let's Encrypt SSL 인증서 설정: sudo certbot --nginx -d your-domain.com"
