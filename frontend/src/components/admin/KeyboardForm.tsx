import React, { useState, useEffect } from 'react';
import type { Keyboard, KeyRange, KeyboardType } from '../../types/keyboard';
import { API_BASE_URL } from '../../services/api';

interface KeyboardFormProps {
  keyboard?: Keyboard;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}

const KeyboardForm: React.FC<KeyboardFormProps> = ({ keyboard, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [link, setLink] = useState('');
  const [keyCountRange, setKeyCountRange] = useState<KeyRange>('');
  const [keyboardType, setKeyboardType] = useState<KeyboardType>('none');
  const [isWireless, setIsWireless] = useState(false);
  const [hasCursorControl, setHasCursorControl] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (keyboard) {
      setName(keyboard.name);
      setPrice(keyboard.price?.toString() || '');
      setLink(keyboard.link);
      setKeyCountRange(keyboard.key_count_range);
      setKeyboardType(keyboard.keyboard_type);
      setIsWireless(keyboard.tags.is_wireless);
      setHasCursorControl(keyboard.tags.has_cursor_control);
      setImagePreview(`${API_BASE_URL}${keyboard.image_url}`);
    }
  }, [keyboard]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !link || !keyCountRange) {
      alert('필수 항목을 모두 입력해주세요');
      return;
    }

    if (!keyboard && !image) {
      alert('이미지를 선택해주세요');
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('link', link);
    formData.append('key_count_range', keyCountRange);
    formData.append('keyboard_type', keyboardType);
    formData.append('is_wireless', isWireless.toString());
    formData.append('has_cursor_control', hasCursorControl.toString());

    if (price) {
      formData.append('price', price);
    }

    if (image) {
      formData.append('image', image);
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 이름 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          키보드 이름 *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      {/* 가격 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          가격 (원) - 선택사항
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="가격을 입력하지 않으면 '직접 제작'으로 표시됩니다"
        />
      </div>

      {/* 링크 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          구매/정보 링크 *
        </label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="https://example.com"
          required
        />
      </div>

      {/* 키 개수 범위 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          키 개수 범위 *
        </label>
        <input
          type="text"
          value={keyCountRange}
          onChange={(e) => setKeyCountRange(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="예: 42, 36, 60 등"
          required
        />
      </div>

      {/* 이미지 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          이미지 {!keyboard && '*'}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="미리보기"
              className="h-32 w-auto object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      {/* 키 배열 */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          키 배열 *
        </label>
        <select
          value={keyboardType}
          onChange={(e) => setKeyboardType(e.target.value as KeyboardType)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="none">없음</option>
          <option value="typewriter">일반</option>
          <option value="alice">앨리스</option>
          <option value="ortholinear">오소리니어</option>
          <option value="column_stagger">칼럼스태거</option>
          <option value="splay">스플레이</option>
          <option value="dactyl">댁틸</option>
        </select>
      </div>

      {/* 태그 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          태그
        </label>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isWireless}
              onChange={(e) => setIsWireless(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">무선</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={hasCursorControl}
              onChange={(e) => setHasCursorControl(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">커서조작</span>
          </label>
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          disabled={submitting}
        >
          취소
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? '저장 중...' : keyboard ? '수정' : '추가'}
        </button>
      </div>
    </form>
  );
};

export default KeyboardForm;
