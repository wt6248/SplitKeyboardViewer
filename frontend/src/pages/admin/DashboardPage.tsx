import React from 'react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">대시보드</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 키보드 관리 카드 */}
        <Link
          to="/admin/keyboards"
          className="block p-6 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            키보드 관리
          </h3>
          <p className="text-sm text-blue-700">
            키보드 추가, 수정, 삭제
          </p>
        </Link>

        {/* 계정 관리 카드 */}
        <Link
          to="/admin/accounts"
          className="block p-6 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
        >
          <h3 className="text-lg font-semibold text-green-900 mb-2">
            계정 관리
          </h3>
          <p className="text-sm text-green-700">
            관리자 계정 추가, 삭제
          </p>
        </Link>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">빠른 가이드</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• 키보드 관리: 새로운 키보드를 추가하거나 기존 키보드 정보를 수정할 수 있습니다.</li>
          <li>• 계정 관리: 새로운 관리자 계정을 생성하거나 기존 계정을 삭제할 수 있습니다.</li>
          <li>• 이미지는 JPG, PNG, WEBP 형식만 업로드 가능합니다.</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
