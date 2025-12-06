# 프로젝트 진행 상황

**작성일**: 2025-12-06
**버전**: 0.0.3

## 최근 해결한 문제

### 1. 프로덕션 환경 API 경로 중복 문제 (해결 완료)

#### 문제 발생 과정
1. `.env.production`의 `VITE_API_BASE_URL`을 `''`에서 `'mockserver.site'`로 변경
2. 에러 발생: `Uncaught TypeError: Cannot read properties of undefined (reading 'length')`
3. URL에 프로토콜 추가: `https://mockserver.site` → 여전히 같은 에러
4. mockserver.site/api에서 `502 Bad Gateway` 발생
5. `VITE_API_BASE_URL=/api`로 변경 → `404 Not Found` 발생

#### 원인 분석
- **백엔드 라우터**: `/api/keyboards` (keyboards.py:18)
- **프론트엔드 설정**: `API_BASE_URL=/api`
- **프론트엔드 요청**: `api.get('/api/keyboards')`
- **실제 요청 경로**: `/api` + `/api/keyboards` = **`/api/api/keyboards`** ❌
- 결과: 404 Not Found

#### 해결 방법
`VITE_API_BASE_URL`을 **빈 문자열**로 설정

**요청 흐름**:
```
프론트엔드 요청: '' + '/api/keyboards' = '/api/keyboards'
                    ↓
Nginx: '/api' → proxy_pass http://127.0.0.1:8000
                    ↓
백엔드: '/api/keyboards' 엔드포인트 매칭 ✓
```

#### 적용한 코드 변경

**1. 방어적 코딩 추가** (undefined 에러 방지)

- `frontend/src/hooks/useKeyboards.ts:79-81`
  ```typescript
  setKeyboards(response?.keyboards || []);
  setTotal(response?.total || 0);
  setTotalPages(response?.total_pages || 0);
  ```

- `frontend/src/pages/MainPage.tsx:26`
  ```typescript
  if (!keyboards || keyboards.length === 0) return;
  ```

- `frontend/src/components/keyboard/KeyboardCard.tsx:63-97`
  ```typescript
  {keyboard.tags?.is_wireless && ( ... )}
  {keyboard.tags?.has_ortholinear && ( ... )}
  // ... 모든 tags 속성에 optional chaining 적용
  ```

**2. 환경 변수 수정**

`frontend/.env.production`:
```env
VITE_API_BASE_URL=
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**3. 프론트엔드 빌드 완료**
```bash
npm run build
✓ built in 1.38s
```

## 배포 대기 중

### 배포 필요 작업
1. 빌드된 파일을 오라클 서버로 전송
2. Nginx 재시작
3. 브라우저 캐시 클리어

### 배포 명령어
```bash
# 로컬에서 서버로 파일 전송
scp -r frontend/dist/* ubuntu@server-ip:/tmp/

# 서버에서
sudo cp -r /tmp/dist/* /var/www/split-keyboard/frontend/
sudo chown -R www-data:www-data /var/www/split-keyboard/frontend
sudo systemctl reload nginx
```

또는:
```bash
cd /home/ubuntu/split-keyboard
git pull
./deployment/deploy.sh
```

## 현재 시스템 구조

### API 경로 구조
```
프론트엔드 (Vite)
  ├─ API_BASE_URL: '' (빈 문자열)
  └─ 요청: '/api/keyboards'

Nginx
  ├─ location /api
  └─ proxy_pass: http://127.0.0.1:8000

백엔드 (FastAPI)
  ├─ 포트: 8000
  └─ 엔드포인트: /api/keyboards
```

### 주요 파일 변경 이력
| 파일 | 변경 내용 | 상태 |
|------|----------|------|
| `frontend/.env.production` | `VITE_API_BASE_URL=` (빈 문자열) | ✓ 완료 |
| `frontend/src/hooks/useKeyboards.ts` | Optional chaining 추가 | ✓ 완료 |
| `frontend/src/pages/MainPage.tsx` | keyboards 배열 체크 추가 | ✓ 완료 |
| `frontend/src/components/keyboard/KeyboardCard.tsx` | tags 속성 optional chaining | ✓ 완료 |

## 다음 단계
- [ ] 서버에 배포
- [ ] 브라우저 테스트 (강력 새로고침: Ctrl+Shift+R)
- [ ] 정상 작동 확인
- [ ] Git commit 및 push

## 참고사항

### Nginx 설정 (deployment/nginx.conf:71-88)
```nginx
location /api {
    proxy_pass http://127.0.0.1:8000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    # ...
}
```

### 백엔드 라우터 설정 (app/routers/keyboards.py:18)
```python
router = APIRouter(prefix="/api/keyboards", tags=["keyboards"])
```

### 트러블슈팅 팁
- **502 Bad Gateway**: 백엔드 서비스 상태 확인 (`sudo systemctl status split-keyboard-backend`)
- **404 Not Found**: API 경로 중복 확인 (BASE_URL + endpoint)
- **CORS 에러**: 백엔드 ALLOWED_ORIGINS 설정 확인
- **이미지 로드 실패**: Nginx `/uploads` 경로 및 권한 확인
