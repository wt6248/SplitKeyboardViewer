import React from 'react';
import type { FilterState, KeyRange, PriceFilter, KeyboardType } from '../../types/keyboard';

interface FilterPanelProps {
  filters: FilterState;
  availableKeyRanges: string[];
  onPriceRangeChange: (range: [number, number]) => void;
  onPriceFilterChange: (value: PriceFilter) => void;
  onKeyRangeToggle: (range: KeyRange) => void;
  onBooleanFilterChange: (key: keyof FilterState, value: boolean | null) => void;
  onKeyboardTypeChange: (value: KeyboardType | null) => void;
  onReset: () => void;
  onApply: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  availableKeyRanges,
  onPriceRangeChange,
  onPriceFilterChange,
  onKeyRangeToggle,
  onBooleanFilterChange,
  onKeyboardTypeChange,
  onReset,
  onApply,
}) => {
  const keyboardTypes: { value: KeyboardType | null; label: string }[] = [
    { value: null, label: '전체' },
    { value: 'typewriter', label: '일반' },
    { value: 'alice', label: '앨리스' },
    { value: 'ortholinear', label: '오소리니어' },
    { value: 'column_stagger', label: '칼럼스태거' },
    { value: 'splay', label: '스플레이' },
    { value: 'dactyl', label: '댁틸' },
    { value: 'none', label: '없음' },
  ];

  const renderBooleanFilter = (
    label: string,
    filterKey: 'isWireless' | 'hasCursorControl'
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => onBooleanFilterChange(filterKey, true)}
          className={`px-3 py-1 rounded text-sm ${
            filters[filterKey] === true
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          예
        </button>
        <button
          onClick={() => onBooleanFilterChange(filterKey, false)}
          className={`px-3 py-1 rounded text-sm ${
            filters[filterKey] === false
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          아니오
        </button>
        <button
          onClick={() => onBooleanFilterChange(filterKey, null)}
          className={`px-3 py-1 rounded text-sm ${
            filters[filterKey] === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          전체
        </button>
      </div>
    </div>
  );

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
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              checked={filters.priceFilter === 'all'}
              onChange={() => onPriceFilterChange('all')}
              className="mr-2"
            />
            <span className="text-sm">전체 보기</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={filters.priceFilter === 'with_price'}
              onChange={() => onPriceFilterChange('with_price')}
              className="mr-2"
            />
            <span className="text-sm">가격 있는 제품만</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              checked={filters.priceFilter === 'diy_only'}
              onChange={() => onPriceFilterChange('diy_only')}
              className="mr-2"
            />
            <span className="text-sm">직접 제작만 (DIY)</span>
          </label>
        </div>

        {filters.priceFilter === 'with_price' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              최대 가격: ₩{filters.priceRange[1].toLocaleString()}
            </label>
            <input
              type="range"
              min="0"
              max="1000000"
              step="10000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                onPriceRangeChange([0, parseInt(e.target.value)])
              }
              className="w-full"
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

      {/* Keyboard Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          키 배열
        </label>
        <select
          value={filters.keyboardType || ''}
          onChange={(e) =>
            onKeyboardTypeChange(
              e.target.value ? (e.target.value as KeyboardType) : null
            )
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {keyboardTypes.map(({ value, label }) => (
            <option key={value || 'null'} value={value || ''}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Boolean Filters */}
      <div className="space-y-4">
        {renderBooleanFilter('무선', 'isWireless')}
        {renderBooleanFilter('커서조작', 'hasCursorControl')}
      </div>
    </div>
  );
};

export default FilterPanel;
