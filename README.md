# 스플릿 키보드 비교 사이트

스플릿 키보드 정보를 한 곳에 모아 비교하고 검색할 수 있는 웹 애플리케이션입니다.

## 주요 기능

- **키보드 목록 조회**: 다양한 스플릿 키보드를 한눈에 확인
- **고급 필터링**: 가격대, 키 개수, 태그(무선, 오소리니어, 틸팅, 칼럼스태거, 스플레이 등) 기반 검색
- **키보드 비교**: 최대 2개의 키보드를 선택하여 상세 비교
- **관리자 페이지**: 키보드 및 관리자 계정 관리
- **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 기술 스택

### Frontend
- **Framework**: Vite + React 19 + TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: React Context API
- **라우팅**: React Router v7
- **분석**: Google Analytics 4

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **데이터베이스**: SQLite + SQLAlchemy ORM
- **인증**: JWT (JSON Web Token)
- **파일 업로드**: python-multipart

### 배포
- **호스팅**: Oracle Cloud
- **웹서버**: Nginx
- **프로세스 관리**: Systemd

## 시작하기

### 사전 요구사항
- Python 3.11 이상
- Node.js 18 이상
- Git

### 백엔드 설정 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/your-username/split-keyboard.git
cd split-keyboard
```

2. **Python 패키지 설치**
```bash
cd backend
pip install -r requirements.txt
```

3. **환경 변수 설정**

SECRET_KEY 생성:
```bash
# Windows (PowerShell)
python -c "import secrets; print(secrets.token_hex(32))"

# Linux/Mac
openssl rand -hex 32
```

`backend/.env` 파일 수정:
```env
SECRET_KEY=여기에_생성된_시크릿_키를_붙여넣으세요
```

4. **관리자 계정 생성**
```bash
python create_admin.py admin your_password
```

5. **서버 실행**
```bash
python run.py
```

서버 실행 후 접속 가능한 주소:
- API: http://localhost:8000
- API 문서 (Swagger): http://localhost:8000/docs
- API 문서 (ReDoc): http://localhost:8000/redoc

### 프론트엔드 설정 및 실행

1. **Node.js 패키지 설치**
```bash
cd frontend
npm install
```

2. **환경 변수 설정** (선택사항)

`frontend/.env.development` 생성:
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

3. **개발 서버 실행**
```bash
npm run dev
```

개발 서버: http://localhost:5173

4. **프로덕션 빌드**
```bash
npm run build
```

빌드 결과물: `frontend/dist/` 디렉토리

## API 테스트

1. 브라우저에서 http://localhost:8000/docs 접속
2. Swagger UI에서 API 테스트 가능
3. 관리자 기능 사용 시:
   - `POST /api/admin/login` 엔드포인트에서 로그인
   - 응답의 `access_token` 복사
   - "Authorize" 버튼 클릭하여 `Bearer {토큰}` 형식으로 입력

## 프로젝트 구조

```
split-keyboard/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI 앱
│   │   ├── database.py          # DB 연결
│   │   ├── models.py            # SQLAlchemy 모델
│   │   ├── schemas.py           # Pydantic 스키마
│   │   ├── auth.py              # JWT 인증
│   │   ├── routers/
│   │   │   ├── keyboards.py    # 키보드 API
│   │   │   └── admin.py         # 관리자 API
│   │   └── utils/
│   │       ├── security.py      # 비밀번호 해싱
│   │       └── file_upload.py   # 파일 업로드
│   ├── uploads/                 # 업로드 이미지
│   ├── database.db              # SQLite DB
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/               # 페이지 컴포넌트
│   │   ├── components/          # 재사용 컴포넌트
│   │   ├── hooks/               # 커스텀 훅
│   │   ├── services/            # API 서비스
│   │   ├── types/               # TypeScript 타입
│   │   ├── context/             # React Context
│   │   └── utils/               # 유틸리티
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
│
└── deployment/
    ├── nginx.conf               # Nginx 설정
    ├── setup-server.sh          # 서버 초기 설정
    ├── deploy.sh                # 배포 스크립트
    └── DEPLOYMENT.md            # 배포 가이드
```

## 주요 기능 설명

### 필터링
- **가격 필터**: 전체 보기 / 가격 있는 제품만 / 직접 제작만
- **가격 범위**: 슬라이더로 최대 가격 설정
- **키 개수**: 풀사이즈, TKL, 컴팩트, 40%, 30%
- **태그 필터**: 무선, 오소리니어, 틸팅, 커서조작, 디스플레이, 칼럼스태거, 스플레이

### 정렬
- 이름 오름차순/내림차순
- 가격 오름차순/내림차순 (가격 없는 제품은 항상 마지막)

### 비교 기능
1. 카드에서 최대 2개의 키보드 선택
2. 하단 비교 바에서 "비교하기" 버튼 클릭
3. 모달에서 상세 비교 확인

### 관리자 기능
- 키보드 CRUD (생성, 조회, 수정, 삭제)
- 이미지 업로드 및 관리
- 관리자 계정 관리
- JWT 기반 인증

## 배포

자세한 배포 가이드는 [DEPLOYMENT.md](deployment/DEPLOYMENT.md)를 참조하세요.

### 빠른 배포 (Oracle Cloud)

1. **서버 초기 설정**
```bash
./deployment/setup-server.sh
```

2. **환경 변수 설정**
```bash
cd backend
nano .env  # SECRET_KEY 설정
```

3. **관리자 계정 생성**
```bash
python create_admin.py admin yourpassword
```

4. **배포 실행**
```bash
./deployment/deploy.sh
```

## 데이터베이스 마이그레이션

새로운 태그 추가 시:
```bash
cd backend
python migrate_add_tags.py
```

## 환경 변수

### Backend (.env)
```env
SECRET_KEY=your-secret-key-here
```

### Frontend (.env.production)
```env
VITE_API_BASE_URL=/api
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 성능 최적화

- **이미지 Lazy Loading**: Intersection Observer 기반
- **코드 스플리팅**: React vendor와 메인 번들 분리
- **Gzip 압축**: Nginx 레벨에서 처리
- **빌드 최적화**: esbuild 사용

### 빌드 크기
- HTML: 0.54 kB (gzip: 0.32 kB)
- CSS: 20.81 kB (gzip: 4.37 kB)
- React vendor: 44.53 kB (gzip: 15.98 kB)
- Main bundle: 262.15 kB (gzip: 81.17 kB)

## 보안

- 비밀번호 bcrypt 해싱
- JWT 토큰 기반 인증
- 파일 업로드 검증 (.jpg, .jpeg, .png, .webp만 허용)
- CORS 정책
- Rate Limiting (Nginx)
- 보안 헤더 설정

## 테스트

### Phase 5 통합 테스트
```bash
# .env.test 파일에 관리자 계정 정보 입력 후
node test_phase5.js
```

## 라이선스

MIT License

## 기여

이슈 및 Pull Request는 언제나 환영합니다!

## 문의

문제가 발생하거나 질문이 있으시면 GitHub Issues를 이용해주세요.
