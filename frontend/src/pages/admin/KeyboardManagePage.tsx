import React, { useState, useEffect } from 'react';
import { getKeyboards, deleteKeyboard, createKeyboard, updateKeyboard } from '../../services/keyboardService';
import type { Keyboard } from '../../types/keyboard';
import Modal from '../../components/common/Modal';
import KeyboardForm from '../../components/admin/KeyboardForm';

const KeyboardManagePage: React.FC = () => {
  const [keyboards, setKeyboards] = useState<Keyboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKeyboard, setEditingKeyboard] = useState<Keyboard | undefined>(undefined);

  const fetchKeyboards = async () => {
    setLoading(true);
    try {
      const response = await getKeyboards({});
      setKeyboards(response.keyboards);
    } catch (err: any) {
      setError(err.message || '키보드 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeyboards();
  }, []);

  const handleOpenAddModal = () => {
    setEditingKeyboard(undefined);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (keyboard: Keyboard) => {
    setEditingKeyboard(keyboard);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingKeyboard(undefined);
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      if (editingKeyboard) {
        // 수정
        await updateKeyboard(editingKeyboard.id, formData);
        alert('키보드가 수정되었습니다');
      } else {
        // 추가
        await createKeyboard(formData);
        alert('키보드가 추가되었습니다');
      }
      handleCloseModal();
      fetchKeyboards();
    } catch (err: any) {
      alert(err.response?.data?.detail || '저장에 실패했습니다');
      throw err;
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" 키보드를 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteKeyboard(id);
      alert('삭제되었습니다');
      fetchKeyboards();
    } catch (err: any) {
      alert(err.response?.data?.detail || '삭제에 실패했습니다');
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">키보드 관리</h2>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          키보드 추가
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이미지
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이름
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가격
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                키 개수
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                태그
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {keyboards.map((keyboard) => (
              <tr key={keyboard.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img
                    src={keyboard.image_url}
                    alt={keyboard.name}
                    className="h-12 w-20 object-cover rounded"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {keyboard.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    <a
                      href={keyboard.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      링크
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {keyboard.price ? `₩${keyboard.price.toLocaleString()}` : '직접 제작'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {keyboard.key_count_range}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {keyboard.tags.is_wireless && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        무선
                      </span>
                    )}
                    {keyboard.tags.has_ortholinear && (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        오소리니어
                      </span>
                    )}
                    {keyboard.tags.has_tenting && (
                      <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded">
                        틸팅
                      </span>
                    )}
                    {keyboard.tags.has_cursor_control && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                        커서조작
                      </span>
                    )}
                    {keyboard.tags.has_display && (
                      <span className="px-2 py-1 text-xs bg-pink-100 text-pink-800 rounded">
                        디스플레이
                      </span>
                    )}
                    {keyboard.tags.has_column_stagger && (
                      <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                        칼럼스태거
                      </span>
                    )}
                    {keyboard.tags.has_splay && (
                      <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded">
                        스플레이
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleOpenEditModal(keyboard)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(keyboard.id, keyboard.name)}
                    className="text-red-600 hover:text-red-900"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {keyboards.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            등록된 키보드가 없습니다
          </div>
        )}
      </div>

      {/* 키보드 추가/수정 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingKeyboard ? '키보드 수정' : '키보드 추가'}
      >
        <KeyboardForm
          keyboard={editingKeyboard}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default KeyboardManagePage;
