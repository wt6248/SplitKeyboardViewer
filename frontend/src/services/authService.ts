import api from './api';
import type {
  LoginRequest,
  TokenResponse,
  Admin,
  AdminCreateRequest,
  AdminListResponse,
} from '../types/admin';

// Login
export const login = async (credentials: LoginRequest): Promise<TokenResponse> => {
  const response = await api.post<TokenResponse>('/api/admin/login', credentials);
  return response.data;
};

// Get admin accounts
export const getAdminAccounts = async (): Promise<AdminListResponse> => {
  const response = await api.get<AdminListResponse>('/api/admin/accounts');
  return response.data;
};

// Create admin account
export const createAdminAccount = async (
  account: AdminCreateRequest
): Promise<Admin> => {
  const response = await api.post<Admin>('/api/admin/accounts', account);
  return response.data;
};

// Delete admin account
export const deleteAdminAccount = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/accounts/${id}`);
};
