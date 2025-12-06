import React, { useState, useEffect } from 'react';
import { useFilters } from '../hooks/useFilters';
import { useKeyboards } from '../hooks/useKeyboards';
import KeyboardGrid from '../components/keyboard/KeyboardGrid';
import FilterPanel from '../components/keyboard/FilterPanel';
import SearchBar from '../components/keyboard/SearchBar';
import SortSelector from '../components/keyboard/SortSelector';
import ComparisonBar from '../components/comparison/ComparisonBar';
import ComparisonModal from '../components/comparison/ComparisonModal';
import type { FilterState } from '../types/keyboard';

const MainPage: React.FC = () => {
  // 로컬 필터 상태 (사용자가 선택 중인 필터)
  const { filters: localFilters, updateFilter: updateLocalFilter, toggleKeyRange: toggleLocalKeyRange, resetFilters: resetLocalFilters } = useFilters();

  // 실제 적용된 필터 상태 (API 호출에 사용)
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(localFilters);

  const { keyboards, loading, error, total, fetchKeyboards } = useKeyboards(appliedFilters);

  // 전체 키 개수 범위를 저장 (필터링 전 전체 목록)
  const [allKeyRanges, setAllKeyRanges] = useState<string[]>([]);

  // 초기 로드 시 또는 새로운 키 개수가 추가되었을 때 전체 키 개수 범위 업데이트
  useEffect(() => {
    const ranges = keyboards.map(kb => kb.key_count_range).filter(Boolean);
    const uniqueRanges = Array.from(new Set(ranges)).sort();

    // 새로운 키 개수가 있으면 추가
    setAllKeyRanges(prev => {
      const combined = Array.from(new Set([...prev, ...uniqueRanges]));
      return combined.sort();
    });
  }, [keyboards]);

  // appliedFilters가 변경될 때 자동으로 fetchKeyboards 호출
  useEffect(() => {
    fetchKeyboards();
  }, [appliedFilters]);

  // 필터 반영 (필터 패널의 "반영" 버튼)
  const handleApplyFilters = () => {
    setAppliedFilters({ ...localFilters });
  };

  // 검색 실행 (검색 버튼)
  const handleSearch = () => {
    // 검색어와 정렬만 즉시 적용
    setAppliedFilters(prev => ({
      ...prev,
      searchQuery: localFilters.searchQuery,
      sortBy: localFilters.sortBy
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            스플릿 키보드 비교
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            원하는 스플릿 키보드를 찾아보세요
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filter Panel - Left Sidebar */}
          <aside className="lg:col-span-1">
            <FilterPanel
              filters={localFilters}
              availableKeyRanges={allKeyRanges}
              onPriceRangeChange={(range) => updateLocalFilter('priceRange', range)}
              onPriceFilterChange={(value) => updateLocalFilter('priceFilter', value)}
              onKeyRangeToggle={toggleLocalKeyRange}
              onBooleanFilterChange={(key, value) => updateLocalFilter(key, value)}
              onReset={resetLocalFilters}
              onApply={handleApplyFilters}
            />
          </aside>

          {/* Main Content - Keyboards Grid */}
          <div className="lg:col-span-3">
            {/* Search and Sort */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 w-full sm:w-auto flex gap-2">
                  <SearchBar
                    value={localFilters.searchQuery}
                    onChange={(value) => updateLocalFilter('searchQuery', value)}
                  />
                  <button
                    onClick={handleSearch}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
                  >
                    검색
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    총 <span className="font-semibold">{total}</span>개
                  </span>
                  <SortSelector
                    value={localFilters.sortBy}
                    onChange={(value) => updateLocalFilter('sortBy', value)}
                  />
                </div>
              </div>
            </div>

            {/* Keyboards Grid */}
            <KeyboardGrid keyboards={keyboards} loading={loading} error={error} />
          </div>
        </div>
      </main>

      {/* Comparison Bar - Fixed Bottom */}
      <ComparisonBar />

      {/* Comparison Modal */}
      <ComparisonModal />
    </div>
  );
};

export default MainPage;
