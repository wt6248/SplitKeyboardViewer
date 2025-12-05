import React, { useState, useEffect } from 'react';
import { getKeyboards } from '../services/keyboardService';

const TestPage: React.FC = () => {
  const [status, setStatus] = useState('초기화 중...');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('TestPage mounted');
    setStatus('API 호출 중...');

    getKeyboards({})
      .then((response) => {
        console.log('API Success:', response);
        setStatus('성공!');
        setData(response);
      })
      .catch((err) => {
        console.error('API Error:', err);
        setStatus('실패');
        setError(err.message);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">프론트엔드 테스트 페이지</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">상태: {status}</h2>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
            <p className="text-red-700">오류: {error}</p>
          </div>
        )}

        {data && (
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <p className="font-semibold mb-2">
              총 {data.total}개의 키보드
            </p>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestPage;
