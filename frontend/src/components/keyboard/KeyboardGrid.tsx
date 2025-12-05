import React from 'react';
import type { Keyboard } from '../../types/keyboard';
import KeyboardCard from './KeyboardCard';

interface KeyboardGridProps {
  keyboards: Keyboard[];
  loading: boolean;
  error: string | null;
}

const KeyboardGrid: React.FC<KeyboardGridProps> = ({ keyboards, loading, error }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-red-500">오류: {error}</div>
      </div>
    );
  }

  if (keyboards.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">검색 결과가 없습니다</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {keyboards.map((keyboard) => (
        <KeyboardCard key={keyboard.id} keyboard={keyboard} />
      ))}
    </div>
  );
};

export default KeyboardGrid;
