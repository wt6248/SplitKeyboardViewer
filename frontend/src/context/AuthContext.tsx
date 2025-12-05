import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, LoginRequest } from '../types/admin';
import { login as loginApi } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    token: null,
    username: null,
  });

  // 초기 로드 시 로컬 스토리지에서 인증 정보 복원
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {
      setAuthState({
        isAuthenticated: true,
        token,
        username,
      });
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await loginApi(credentials);

    const { access_token } = response;

    // 로컬 스토리지에 저장
    localStorage.setItem('token', access_token);
    localStorage.setItem('username', credentials.username);

    // 상태 업데이트
    setAuthState({
      isAuthenticated: true,
      token: access_token,
      username: credentials.username,
    });
  };

  const logout = () => {
    // 로컬 스토리지에서 제거
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // 상태 초기화
    setAuthState({
      isAuthenticated: false,
      token: null,
      username: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
