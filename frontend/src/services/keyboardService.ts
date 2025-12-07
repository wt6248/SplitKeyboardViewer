import api from './api';
import type {
  Keyboard,
  KeyboardListResponse,
  KeyboardCompareRequest,
  KeyboardCompareResponse,
  SortOption,
  KeyRange,
} from '../types/keyboard';

// Get keyboards list with filters
export const getKeyboards = async (params?: {
  min_price?: number;
  max_price?: number;
  include_null_price?: boolean;
  key_ranges?: string;
  keyboard_type?: string;
  is_wireless?: boolean;
  has_ortholinear?: boolean;
  has_tenting?: boolean;
  has_cursor_control?: boolean;
  has_display?: boolean;
  search?: string;
  sort_by?: SortOption;
  page?: number;
  limit?: number;
}): Promise<KeyboardListResponse> => {
  const response = await api.get<KeyboardListResponse>('/api/keyboards', { params });
  return response.data;
};

// Get specific keyboard by ID
export const getKeyboard = async (id: number): Promise<Keyboard> => {
  const response = await api.get<Keyboard>(`/api/keyboards/${id}`);
  return response.data;
};

// Compare keyboards
export const compareKeyboards = async (
  request: KeyboardCompareRequest
): Promise<KeyboardCompareResponse> => {
  const response = await api.post<KeyboardCompareResponse>(
    '/api/keyboards/compare',
    request
  );
  return response.data;
};

// Admin: Create keyboard
export const createKeyboard = async (formData: FormData): Promise<Keyboard> => {
  const response = await api.post<Keyboard>('/api/admin/keyboards', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Admin: Update keyboard
export const updateKeyboard = async (
  id: number,
  formData: FormData
): Promise<Keyboard> => {
  const response = await api.put<Keyboard>(`/api/admin/keyboards/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Admin: Delete keyboard
export const deleteKeyboard = async (id: number): Promise<void> => {
  await api.delete(`/api/admin/keyboards/${id}`);
};
