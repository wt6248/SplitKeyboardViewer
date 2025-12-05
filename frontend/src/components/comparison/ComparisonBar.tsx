import React from 'react';
import { useComparison } from '../../context/ComparisonContext';

const ComparisonBar: React.FC = () => {
  const { selectedKeyboards, clearSelection, openModal } = useComparison();

  if (selectedKeyboards.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50 animate-slide-up">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex gap-4 flex-1">
          {selectedKeyboards.map((keyboard) => (
            <div
              key={keyboard.id}
              className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded"
            >
              <span className="text-sm font-medium">{keyboard.name}</span>
              <button
                onClick={() => clearSelection()}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={clearSelection}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            선택 해제
          </button>
          <button
            onClick={openModal}
            disabled={selectedKeyboards.length !== 2}
            className={`px-6 py-2 rounded-lg text-white font-medium ${
              selectedKeyboards.length === 2
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            비교하기 ({selectedKeyboards.length}/2)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;
