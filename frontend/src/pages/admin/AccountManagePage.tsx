import React, { useState, useEffect } from 'react';
import {
  getAdminAccounts,
  createAdminAccount,
  deleteAdminAccount,
} from '../../services/authService';
import type { Admin } from '../../types/admin';
import { useAuth } from '../../context/AuthContext';

const AccountManagePage: React.FC = () => {
  const [accounts, setAccounts] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [creating, setCreating] = useState(false);

  const { username: currentUsername } = useAuth();

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await getAdminAccounts();
      setAccounts(response.accounts);
    } catch (err: any) {
      setError(err.message || '계정 목록을 불러오는데 실패했습니다');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      await createAdminAccount({ username: newUsername, password: newPassword });
      alert('계정이 생성되었습니다');
      setNewUsername('');
      setNewPassword('');
      setShowForm(false);
      fetchAccounts();
    } catch (err: any) {
      alert(err.response?.data?.detail || '계정 생성에 실패했습니다');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (username === currentUsername) {
      alert('본인 계정은 삭제할 수 없습니다');
      return;
    }

    if (!confirm(`"${username}" 계정을 삭제하시겠습니까?`)) {
      return;
    }

    try {
      await deleteAdminAccount(id);
      alert('삭제되었습니다');
      fetchAccounts();
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
        <h2 className="text-2xl font-bold text-gray-900">계정 관리</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {showForm ? '취소' : '계정 추가'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">새 계정 생성</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                아이디
              </label>
              <input
                type="text"
                id="username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {creating ? '생성 중...' : '생성'}
            </button>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                아이디
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                생성일
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                작업
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr key={account.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {account.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {account.username}
                  {account.username === currentUsername && (
                    <span className="ml-2 text-xs text-blue-600">(본인)</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(account.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDelete(account.id, account.username)}
                    disabled={account.username === currentUsername}
                    className="text-red-600 hover:text-red-900 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {accounts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            등록된 계정이 없습니다
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountManagePage;
