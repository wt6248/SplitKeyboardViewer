// 관리자 계정
export interface Admin {
  id: number;
  username: string;
  created_at: string;
}

// 로그인 요청
export interface LoginRequest {
  username: string;
  password: string;
}

// 토큰 응답
export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// 인증 상태
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
}

// 관리자 계정 생성 요청
export interface AdminCreateRequest {
  username: string;
  password: string;
}

// 관리자 목록 응답
export interface AdminListResponse {
  accounts: Admin[];
}
