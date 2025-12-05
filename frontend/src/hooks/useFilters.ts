import { useState } from 'react';
import  type { FilterState, KeyRange, SortOption } from '../types/keyboard';

const initialFilterState: FilterState = {
  priceRange: [0, 1000000],
  priceFilter: 'all',
  keyRanges: [],
  isWireless: null,
  hasOrtholinear: null,
  hasTenting: null,
  hasCursorControl: null,
  hasDisplay: null,
  hasColumnStagger: null,
  hasSplay: null,
  searchQuery: '',
  sortBy: 'name_asc',
};

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleKeyRange = (range: KeyRange) => {
    setFilters(prev => {
      const keyRanges = prev.keyRanges.includes(range)
        ? prev.keyRanges.filter(r => r !== range)
        : [...prev.keyRanges, range];
      return { ...prev, keyRanges };
    });
  };

  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  return {
    filters,
    updateFilter,
    toggleKeyRange,
    resetFilters,
  };
};
