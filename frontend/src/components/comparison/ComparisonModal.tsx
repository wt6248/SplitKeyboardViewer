import React, { useEffect } from 'react';
import { useComparison } from '../../context/ComparisonContext';
import { API_BASE_URL } from '../../services/api';

const ComparisonModal: React.FC = () => {
  const { isModalOpen, selectedKeyboards, closeModal } = useComparison();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen, closeModal]);

  if (!isModalOpen || selectedKeyboards.length !== 2) {
    return null;
  }

  const [kb1, kb2] = selectedKeyboards;

  const ComparisonRow = ({ label, value1, value2, highlight = false }: any) => {
    const isDifferent = value1 !== value2;

    return (
      <tr className={highlight && isDifferent ? 'bg-yellow-50' : ''}>
        <td className="px-4 py-3 font-medium text-gray-700 border-r">{label}</td>
        <td className={`px-4 py-3 ${highlight && isDifferent ? 'font-semibold' : ''}`}>
          {value1}
        </td>
        <td className={`px-4 py-3 ${highlight && isDifferent ? 'font-semibold' : ''}`}>
          {value2}
        </td>
      </tr>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">키보드 비교</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left w-1/3 border-r">항목</th>
                <th className="px-4 py-3 text-left w-1/3">{kb1.name}</th>
                <th className="px-4 py-3 text-left w-1/3">{kb2.name}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <ComparisonRow
                label="이미지"
                value1={
                  <img src={`${API_BASE_URL}${kb1.image_url}`} alt={kb1.name} className="w-32 h-24 object-cover rounded" />
                }
                value2={
                  <img src={`${API_BASE_URL}${kb2.image_url}`} alt={kb2.name} className="w-32 h-24 object-cover rounded" />
                }
              />
              <ComparisonRow
                label="가격"
                value1={kb1.price ? `₩${kb1.price.toLocaleString()}` : '가격 미정'}
                value2={kb2.price ? `₩${kb2.price.toLocaleString()}` : '가격 미정'}
                highlight
              />
              <ComparisonRow
                label="키 개수"
                value1={`${kb1.key_count_range}키`}
                value2={`${kb2.key_count_range}키`}
                highlight
              />
              <ComparisonRow
                label="무선"
                value1={kb1.tags.is_wireless ? '✓ 예' : '✗ 아니오'}
                value2={kb2.tags.is_wireless ? '✓ 예' : '✗ 아니오'}
                highlight
              />
              <ComparisonRow
                label="오소리니어"
                value1={kb1.tags.has_ortholinear ? '✓ 예' : '✗ 아니오'}
                value2={kb2.tags.has_ortholinear ? '✓ 예' : '✗ 아니오'}
                highlight
              />
              <ComparisonRow
                label="틸팅"
                value1={kb1.tags.has_tenting ? '✓ 예' : '✗ 아니오'}
                value2={kb2.tags.has_tenting ? '✓ 예' : '✗ 아니오'}
                highlight
              />
              <ComparisonRow
                label="커서조작"
                value1={kb1.tags.has_cursor_control ? '✓ 예' : '✗ 아니오'}
                value2={kb2.tags.has_cursor_control ? '✓ 예' : '✗ 아니오'}
                highlight
              />
              <ComparisonRow
                label="디스플레이"
                value1={kb1.tags.has_display ? '✓ 예' : '✗ 아니오'}
                value2={kb2.tags.has_display ? '✓ 예' : '✗ 아니오'}
                highlight
              />
              <ComparisonRow
                label="링크"
                value1={
                  <a
                    href={kb1.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    자세히 보기 →
                  </a>
                }
                value2={
                  <a
                    href={kb2.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    자세히 보기 →
                  </a>
                }
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComparisonModal;
