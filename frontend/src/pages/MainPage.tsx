import React from 'react';
import { useFilters } from '../hooks/useFilters';
import { useKeyboards } from '../hooks/useKeyboards';
import KeyboardGrid from '../components/keyboard/KeyboardGrid';
import FilterPanel from '../components/keyboard/FilterPanel';
import SearchBar from '../components/keyboard/SearchBar';
import SortSelector from '../components/keyboard/SortSelector';
import ComparisonBar from '../components/comparison/ComparisonBar';
import ComparisonModal from '../components/comparison/ComparisonModal';

const MainPage: React.FC = () => {
  const { filters, updateFilter, toggleKeyRange, resetFilters } = useFilters();
  const { keyboards, loading, error, total, fetchKeyboards } = useKeyboards(filters);

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
              filters={filters}
              onPriceRangeChange={(range) => updateFilter('priceRange', range)}
              onPriceFilterChange={(value) => updateFilter('priceFilter', value)}
              onKeyRangeToggle={toggleKeyRange}
              onBooleanFilterChange={(key, value) => updateFilter(key, value)}
              onReset={resetFilters}
            />
          </aside>

          {/* Main Content - Keyboards Grid */}
          <div className="lg:col-span-3">
            {/* Search and Sort */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex-1 w-full sm:w-auto flex gap-2">
                  <SearchBar
                    value={filters.searchQuery}
                    onChange={(value) => updateFilter('searchQuery', value)}
                  />
                  <button
                    onClick={fetchKeyboards}
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
                    value={filters.sortBy}
                    onChange={(value) => updateFilter('sortBy', value)}
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
