import React from 'react';
import type { SortOption } from '../../types/keyboard';

interface SortSelectorProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SortSelector: React.FC<SortSelectorProps> = ({ value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
    >
      <option value="name_asc">이름 (가나다순)</option>
      <option value="name_desc">이름 (가나다 역순)</option>
      <option value="price_asc">가격 낮은순</option>
      <option value="price_desc">가격 높은순</option>
    </select>
  );
};

export default SortSelector;
