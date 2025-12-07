import { useState, useEffect, useCallback } from 'react';
import type { Keyboard, FilterState, KeyboardListResponse } from '../types/keyboard';
import { getKeyboards } from '../services/keyboardService';

export const useKeyboards = (filters: FilterState) => {
  const [keyboards, setKeyboards] = useState<Keyboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchKeyboards = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params: any = {
        page,
        limit: 20,
        sort_by: filters.sortBy,
      };

      // 가격 필터 처리
      if (filters.priceFilter === 'with_price') {
        // 가격 있는 것만
        params.include_null_price = false;
      } else if (filters.priceFilter === 'diy_only') {
        // 직접 제작만 (가격 없는 것만)
        params.include_null_price = true;
        params.only_null_price = true;
      } else {
        // 전체
        params.include_null_price = true;
      }

      // Price range
      if (filters.priceRange[0] > 0) {
        params.min_price = filters.priceRange[0];
      }
      if (filters.priceRange[1] < 1000000) {
        params.max_price = filters.priceRange[1];
      }

      // Key ranges
      if (filters.keyRanges.length > 0) {
        params.key_ranges = filters.keyRanges.join(',');
      }

      // Keyboard type filter
      if (filters.keyboardType !== null) {
        params.keyboard_type = filters.keyboardType;
      }

      // Tag filters (무선, 커서조작만)
      if (filters.isWireless !== null) {
        params.is_wireless = filters.isWireless;
      }
      if (filters.hasCursorControl !== null) {
        params.has_cursor_control = filters.hasCursorControl;
      }

      // Search query
      if (filters.searchQuery) {
        params.search = filters.searchQuery;
      }

      const response = await getKeyboards(params);
      setKeyboards(response?.keyboards || []);
      setTotal(response?.total || 0);
      setTotalPages(response?.total_pages || 0);
    } catch (err: any) {
      setError(err.message || '키보드 목록을 가져오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  // 초기 마운트 시 1번만 호출
  useEffect(() => {
    fetchKeyboards();
  }, []); // 빈 배열: 마운트 시에만 실행

  return {
    keyboards,
    loading,
    error,
    total,
    page,
    totalPages,
    setPage,
    fetchKeyboards, // 수동으로 호출할 수 있도록 함수 반환
  };
};
