import React from 'react';
import type { FilterState, KeyRange, PriceFilter } from '../../types/keyboard';

interface FilterPanelProps {
  filters: FilterState;
  availableKeyRanges: string[]; // 실제 데이터에서 추출한 키 개수 범위
  onPriceRangeChange: (range: [number, number]) => void;
  onPriceFilterChange: (value: PriceFilter) => void;
  onKeyRangeToggle: (range: KeyRange) => void;
  onBooleanFilterChange: (key: keyof FilterState, value: boolean | null) => void;
  onReset: () => void;
  onApply: () => void; // 필터 반영 버튼
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  availableKeyRanges,
  onPriceRangeChange,
  onPriceFilterChange,
  onKeyRangeToggle,
  onBooleanFilterChange,
  onReset,
  onApply,
}) => {

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">필터</h3>
        <div className="flex gap-2">
          <button
            onClick={onReset}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            초기화
          </button>
          <button
            onClick={onApply}
            className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            반영
          </button>
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          가격 필터
        </label>
        <div className="flex flex-col gap-2 mb-4">
          <button
            onClick={() => onPriceFilterChange('all')}
            className={`px-3 py-2 rounded text-sm text-left ${
              filters.priceFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            전체 보기
          </button>
          <button
            onClick={() => onPriceFilterChange('with_price')}
            className={`px-3 py-2 rounded text-sm text-left ${
              filters.priceFilter === 'with_price'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            가격 있는 제품만
          </button>
          <button
            onClick={() => onPriceFilterChange('diy_only')}
            className={`px-3 py-2 rounded text-sm text-left ${
              filters.priceFilter === 'diy_only'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            직접 제작만
          </button>
        </div>

        {filters.priceFilter !== 'diy_only' && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              최대 가격
            </label>
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                onPriceRangeChange([filters.priceRange[0], parseInt(e.target.value)])
              }
              className="w-full"
              disabled={filters.priceFilter === 'diy_only'}
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>₩0</span>
              <span>₩{filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Key Ranges */}
      {availableKeyRanges.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            키 개수
          </label>
          <div className="space-y-2">
            {availableKeyRanges.map((keyRange) => (
              <label key={keyRange} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.keyRanges.includes(keyRange)}
                  onChange={() => onKeyRangeToggle(keyRange)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">{keyRange}키</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Boolean Filters */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            무선
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onBooleanFilterChange('isWireless', true)}
              className={`px-3 py-1 rounded text-sm ${
                filters.isWireless === true
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              예
            </button>
            <button
              onClick={() => onBooleanFilterChange('isWireless', false)}
              className={`px-3 py-1 rounded text-sm ${
                filters.isWireless === false
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              아니오
            </button>
            <button
              onClick={() => onBooleanFilterChange('isWireless', null)}
              className={`px-3 py-1 rounded text-sm ${
                filters.isWireless === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              전체
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            오소리니어
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onBooleanFilterChange('hasOrtholinear', true)}
              className={`px-3 py-1 rounded text-sm ${
                filters.hasOrtholinear === true
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              예
            </button>
            <button
              onClick={() => onBooleanFilterChange('hasOrtholinear', false)}
              className={`px-3 py-1 rounded text-sm ${
                filters.hasOrtholinear === false
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              아니오
            </button>
            <button
              onClick={() => onBooleanFilterChange('hasOrtholinear', null)}
              className={`px-3 py-1 rounded text-sm ${
                filters.hasOrtholinear === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              전체
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            틸팅
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onBooleanFilterChange('hasTenting', true)}
              className={`px-3 py-1 rounded text-sm ${
                filters.hasTenting === true
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              예
            </button>
            <button
              onClick={() => onBooleanFilterChange('hasTenting', false)}
              className={`px-3 py-1 rounded text-sm ${
                filters.hasTenting === false
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              아니오
            </button>
            <button
              onClick={() => onBooleanFilterChange('hasTenting', null)}
              className={`px-3 py-1 rounded text-sm ${
                filters.hasTenting === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              전체
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            칼럼스태거
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onBooleanFilterChange('hasColumnStagger', true)}
              className={`px-3 py-1 rounded text-sm ${
                filters.hasColumnStagger === true
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              예
            </button>
            <button
              onClick={() => onBooleanFilterChange('hasColumnStagger', false)}
              className={`px-3 py-1 rounded text-sm ${
                filters.hasColumnStagger === false
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              아니오
            </button>
            <button
              onClick={() => onBooleanFilterChange('hasColumnStagger', null)}
              className={`px-3 py-1 rounded text-sm ${
                filters.hasColumnStagger === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              전체
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            스플레이
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => onBooleanFilterChange('hasSplay', true)}
              className={`px-3 py-1 rounded text-sm ${
                filters.hasSplay === true
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              예
            </button>
            <button
              onClick={() => onBooleanFilterChange('hasSplay', false)}
              className={`px-3 py-1 rounded text-sm ${
                filters.hasSplay === false
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              아니오
            </button>
            <button
              onClick={() => onBooleanFilterChange('hasSplay', null)}
              className={`px-3 py-1 rounded text-sm ${
                filters.hasSplay === null
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              전체
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
