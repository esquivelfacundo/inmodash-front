'use client';

import { useState } from 'react';

export default function ApiTest() {
  const [result, setResult] = useState<string>('');

  const testApi = async () => {
    try {
      const response = await fetch('https://inmodash-back-production.up.railway.app/health');
      const data = await response.json();
      setResult(`✅ Backend OK: ${JSON.stringify(data)}`);
    } catch (error) {
      setResult(`❌ Backend Error: ${error}`);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h3 className="font-bold">API Test</h3>
      <button 
        onClick={testApi}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
      >
        Test Backend Connection
      </button>
      <p className="mt-2 text-sm">{result}</p>
    </div>
  );
}
