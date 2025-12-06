import React from 'react';
import type { Keyboard } from '../../types/keyboard';
import { useComparison } from '../../context/ComparisonContext';
import { API_BASE_URL } from '../../services/api';
import reactLogo from '../../assets/react.svg';

interface KeyboardCardProps {
  keyboard: Keyboard;
}

const KeyboardCard: React.FC<KeyboardCardProps> = ({ keyboard }) => {
  const { selectedIds, toggleSelection } = useComparison();
  const isSelected = selectedIds.includes(keyboard.id);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleSelection(keyboard);
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return '직접 제작';
    return `₩${price.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      {/* Image */}
      <div className="relative">
        <img
          src={`${API_BASE_URL}${keyboard.image_url}`}
          alt={keyboard.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = reactLogo;
          }}
        />
        {/* Checkbox overlay */}
        <div className="absolute top-2 right-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            className="w-5 h-5 cursor-pointer"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {keyboard.name}
        </h3>

        <p className="text-xl font-bold text-blue-600 mb-3">
          {formatPrice(keyboard.price)}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {keyboard.key_count_range}키
          </span>
          {keyboard.tags.is_wireless && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
              무선
            </span>
          )}
          {keyboard.tags.has_ortholinear && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
              오소리니어
            </span>
          )}
          {keyboard.tags.has_tenting && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
              틸팅
            </span>
          )}
          {keyboard.tags.has_cursor_control && (
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
              커서조작
            </span>
          )}
          {keyboard.tags.has_display && (
            <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
              디스플레이
            </span>
          )}
          {keyboard.tags.has_column_stagger && (
            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
              칼럼스태거
            </span>
          )}
          {keyboard.tags.has_splay && (
            <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">
              스플레이
            </span>
          )}
        </div>

        {/* Link */}
        <a
          href={keyboard.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
        >
          자세히 보기 →
        </a>
      </div>
    </div>
  );
};

export default KeyboardCard;
