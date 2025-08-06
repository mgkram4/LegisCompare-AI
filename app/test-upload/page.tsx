'use client';

import { useState } from 'react';

export default function TestUpload() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResult(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Test PDF Upload</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Bill A (PDF or Text)</label>
          <input type="file" name="billA_file" required accept=".pdf,.txt" className="border p-2" />
        </div>
        <div>
          <label className="block mb-2">Bill B (PDF or Text)</label>
          <input type="file" name="billB_file" required accept=".pdf,.txt" className="border p-2" />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Test Upload'}
        </button>
      </form>
      
      {result && (
        <pre className="mt-8 p-4 bg-gray-100 rounded overflow-auto">
          {result}
        </pre>
      )}
    </div>
  );
}
