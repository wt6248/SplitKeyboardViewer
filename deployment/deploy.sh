#!/bin/bash

# Split Keyboard Site 배포 스크립트
# Oracle Cloud 서버에서 실행

set -e  # 오류 발생 시 중단

echo "=== Split Keyboard Site 배포 시작 ==="

# 설정
PROJECT_DIR="/home/ubuntu/split-keyboard"
FRONTEND_BUILD_DIR="$PROJECT_DIR/frontend/dist"
FRONTEND_DEPLOY_DIR="/var/www/split-keyboard/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"
UPLOAD_DIR="/var/lib/split-keyboard/uploads"
DB_DIR="/var/lib/split-keyboard"

echo "[1/8] 코드 업데이트..."
cd $PROJECT_DIR
git pull origin main

echo "[2/8] 백엔드 의존성 설치..."
cd $BACKEND_DIR
source venv/bin/activate
pip install -r requirements.txt

echo "[3/8] 프론트엔드 빌드..."
cd $PROJECT_DIR/frontend
npm install
npm run build

echo "[4/8] 프론트엔드 배포..."
sudo rm -rf $FRONTEND_DEPLOY_DIR/*
sudo cp -r $FRONTEND_BUILD_DIR/* $FRONTEND_DEPLOY_DIR/

echo "[5/8] 업로드 디렉토리 권한 설정..."
sudo mkdir -p $UPLOAD_DIR
sudo chown -R ubuntu:ubuntu $UPLOAD_DIR
sudo chmod -R 755 $UPLOAD_DIR

echo "[6/8] 데이터베이스 디렉토리 권한 설정..."
sudo mkdir -p $DB_DIR
sudo chown -R ubuntu:ubuntu $DB_DIR
sudo chmod -R 755 $DB_DIR

echo "[7/8] 백엔드 서비스 재시작..."
sudo systemctl restart split-keyboard-backend

echo "[8/8] Nginx 재시작..."
sudo systemctl reload nginx

echo "=== 배포 완료! ==="
echo "Frontend: https://your-domain.com"
echo "Backend API: https://your-domain.com/api"
echo "API Docs: https://your-domain.com/docs"
