# 프로젝트 진행 상황

**최종 업데이트**: 2025-12-07
**버전**: 0.0.4 (준비 중)
**현재 단계**: Phase 6 (기능 개선 및 UX 향상) - 거의 완료

## 전체 프로젝트 현황

### 완료된 Phase
- **Phase 1-4**: 기본 기능 구현 완료
- **Phase 5**: 배포 및 최적화 완료 (2025-12-05)
  - 프로덕션 빌드, GA 연동, 이미지 최적화, Nginx 설정, 배포 스크립트

### 현재 Phase: Phase 6 (기능 개선 및 UX 향상)

#### fixlist.md 구현 상태 요약 (2025-12-07 완료)
- **완전 구현**: 8개 (89%)
  - ✅ 키보드 종류 드롭다운 (타자기/앨리스/오소리니어/칼럼스태거/스플레이/없음)
  - ✅ 태그를 키보드 종류로 이동 (오소리니어/칼럼스태거/스플레이)
  - ✅ 태그 재구조화 (무선, 커서조작만 남김)
  - ✅ 왼쪽 필터에서 모든 태그 필터링 기능
  - ✅ 페이지네이션 UI (1,2,3... 버튼)
  - ✅ 스크롤 시 필터 패널 고정 (sticky)
  - ✅ 대소문자 구분 없는 정렬
  - ✅ 홈페이지 제목 변경
- **미구현**: 1개 (11%)
  - ⏳ 계정 권한 시스템 (editor 등급 추가)

### 기술 스택 현황

**Frontend**:
- React 19 + TypeScript + Vite
- Tailwind CSS
- 페이지네이션: UI 구현 완료 ✅
- Lazy Loading: 구현 완료 ✅
- Google Analytics: 연동 완료 ✅
- Sticky Filter Panel: 구현 완료 ✅

**Backend**:
- FastAPI (Python 3.11+)
- SQLite + SQLAlchemy ORM
- JWT 인증
- **키보드 타입**: Enum (typewriter, alice, ortholinear, column_stagger, splay, none)
- **태그**: 2개로 단순화 (무선, 커서조작)
- 대소문자 구분 없는 정렬: 구현 완료 ✅

---

## 최근 해결한 문제 (이전 기록)

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

## 완료된 작업 (Phase 6) - 2025-12-07

### ✅ Breaking Change: 키보드 종류 필드 추가 및 태그 재구조화
**백엔드**:
- models.py에 KeyboardType enum 추가 (typewriter, alice, ortholinear, column_stagger, splay, none)
- keyboard_type 필드 추가, 기존 태그 필드 deprecated
- schemas.py에 KeyboardType enum 추가, KeyboardTags 단순화 (무선, 커서조작만)
- keyboards.py API에 keyboard_type 필터 추가
- admin.py CRUD 엔드포인트 업데이트
- 데이터 마이그레이션 스크립트 작성 및 실행 (11개 키보드 마이그레이션 완료)

**프론트엔드**:
- types/keyboard.ts에 KeyboardType 타입 추가
- FilterPanel에 키보드 종류 드롭다운 추가 (327줄 → 213줄 단순화)
- useKeyboards hook에 keyboard_type 필터 추가
- KeyboardCard에서 keyboard_type 태그 표시
- MainPage 업데이트

**테스트**:
- Frontend 빌드 성공 (1.64s)
- 통합 테스트 모두 통과 (keyboard_type 필터, 태그 구조 검증)

### ✅ UI/UX 개선
1. **페이지네이션 UI** - Pagination 컴포넌트 생성, MainPage에 통합
2. **Sticky 필터 패널** - 스크롤 시 필터 패널 고정
3. **대소문자 구분 없는 정렬** - func.lower() 사용
4. **홈페이지 제목** - index.html 및 MainPage.tsx 모두 "스플릿 키보드 모아보기"로 변경

## 다음 작업 우선순위

### Phase 7: 고급 기능 (선택사항)
1. **계정 권한 시스템** (미구현)
   - Admin 모델에 role 필드 추가 (admin, editor)
   - 권한별 API 접근 제어
   - 관리자 페이지 UI 업데이트

### 배포 준비
2. **원격 서버 데이터 마이그레이션**
   - 프로덕션 서버에 keyboard_type 필드 추가
   - 기존 데이터 마이그레이션
   - 새 버전 배포 (0.0.4)

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

## 현재 개발 환경 상태

### 로컬 개발 환경
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:5173`
- API 문서: `http://localhost:8000/docs`

### 배포 환경 (Oracle Cloud)
- Phase 5에서 배포 스크립트 및 설정 완료
- 실제 서버 배포는 수동으로 진행 필요

### 배포 방법 (필요시)
```bash
cd /home/ubuntu/split-keyboard
git pull
./deployment/deploy.sh
```

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
