import React, { useState, useEffect } from 'react';
import { getKeyboards, deleteKeyboard, createKeyboard, updateKeyboard } from '../../services/keyboardService';
import type { Keyboard, KeyboardType } from '../../types/keyboard';
import { API_BASE_URL } from '../../services/api';
import Modal from '../../components/common/Modal';
import KeyboardForm from '../../components/admin/KeyboardForm';

const KeyboardManagePage: React.FC = () => {
  const [keyboards, setKeyboards] = useState<Keyboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKeyboard, setEditingKeyboard] = useState<Keyboard | undefined>(undefined);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [searchName, setSearchName] = useState('');
  const [filterKeyboardType, setFilterKeyboardType] = useState<KeyboardType | ''>('');
  const [filterKeyRange, setFilterKeyRange] = useState('');

  const fetchKeyboards = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 20,
      };

      if (searchName.trim()) {
        params.search = searchName.trim();
      }

      if (filterKeyboardType) {
        params.keyboard_type = filterKeyboardType;
      }

      if (filterKeyRange) {
        params.key_ranges = filterKeyRange;
      }

      console.log('Fetching keyboards with params:', params);

      const response = await getKeyboards(params);

      console.log('Response:', {
        total: response.total,
        count: response.keyboards.length,
        keyboards: response.keyboards.map(kb => ({ id: kb.id, name: kb.name, key_count_range: kb.key_count_range }))
      });

      setKeyboards(response.keyboards);
      setTotal(response.total);
      setTotalPages(response.total_pages);
    } catch (err: any) {
      console.error('Error fetching keyboards:', err);
      setError(err.message || '키보드 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeyboards();
  }, [currentPage, searchName, filterKeyboardType, filterKeyRange]);

  const handleResetFilters = () => {
    setSearchName('');
    setFilterKeyboardType('');
    setFilterKeyRange('');
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    fetchKeyboards();
  };

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

      {/* 필터 패널 */}
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 이름 검색 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름 검색
            </label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="키보드 이름 입력"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* 키배열 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              키배열
            </label>
            <select
              value={filterKeyboardType}
              onChange={(e) => setFilterKeyboardType(e.target.value as KeyboardType | '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">전체</option>
              <option value="typewriter">타자기</option>
              <option value="alice">앨리스</option>
              <option value="ortholinear">오소리니어</option>
              <option value="column_stagger">칼럼스태거</option>
              <option value="splay">스플레이</option>
              <option value="dactyl">닥틸</option>
              <option value="none">없음</option>
            </select>
          </div>

          {/* 키 개수 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              키 개수
            </label>
            <select
              value={filterKeyRange}
              onChange={(e) => setFilterKeyRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">전체</option>
              <option value="3*5">3*5</option>
              <option value="3*6">3*6</option>
              <option value="4*5">4*5</option>
              <option value="4*6">4*6</option>
              <option value="4*7">4*7</option>
              <option value="5*6">5*6</option>
              <option value="5*7">5*7</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            초기화
          </button>
        </div>

        {/* 검색 결과 정보 */}
        <div className="mt-4 text-sm text-gray-600">
          총 {total}개의 키보드 (페이지 {currentPage} / {totalPages})
        </div>
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
                키배열
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
                    src={`${API_BASE_URL}${keyboard.image_url}`}
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {keyboard.keyboard_type === 'typewriter' && '타자기'}
                    {keyboard.keyboard_type === 'alice' && '앨리스'}
                    {keyboard.keyboard_type === 'ortholinear' && '오소리니어'}
                    {keyboard.keyboard_type === 'column_stagger' && '칼럼스태거'}
                    {keyboard.keyboard_type === 'splay' && '스플레이'}
                    {keyboard.keyboard_type === 'dactyl' && '닥틸'}
                    {keyboard.keyboard_type === 'none' && '없음'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {keyboard.tags.is_wireless && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        무선
                      </span>
                    )}
                    {keyboard.tags.has_cursor_control && (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                        커서조작
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // 현재 페이지 근처만 표시
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 2 && page <= currentPage + 2)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 3 || page === currentPage + 3) {
              return <span key={page}>...</span>;
            }
            return null;
          })}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음
          </button>
        </div>
      )}

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
