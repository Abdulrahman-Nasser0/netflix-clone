import React, { useState } from 'react';

const ApiTest = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing connection...');
    
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_API_URL;
      console.log( apiUrl);
      
      // Test with a simple GET request first
      const response = await fetch(`${apiUrl}/test`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Connection successful: ${JSON.stringify(data)}`);
      } else {
        const errorText = await response.text();
        setResult(`❌ Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('Connection error:', error);
      setResult(`❌ Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    setResult('Testing registration endpoint...');
    
    const testData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      password_confirmation: 'password123'
    };
    
    try {
      const apiUrl = import.meta.env.VITE_BACKEND_API_URL;
      console.log('Testing registration at:', `${apiUrl}/register`);
      
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(testData),
      });
      
      console.log('Registration response status:', response.status);
      
      const data = await response.json();
      console.log('Registration response:', data);
      
      if (response.ok) {
        setResult(`✅ Registration works: ${JSON.stringify(data)}`);
      } else {
        setResult(`❌ Registration failed (${response.status}): ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.error('Registration test error:', error);
      setResult(`❌ Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-800 text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      <div className="mb-4">
        <p><strong>API URL:</strong> {import.meta.env.VITE_BACKEND_API_URL || 'NOT SET'}</p>
      </div>
      
      <div className="space-x-4 mb-4">
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Test Connection
        </button>
        
        <button
          onClick={testRegistration}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded disabled:opacity-50"
        >
          Test Registration
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      
      <div className="mt-4 p-4 bg-gray-900 rounded">
        <h3 className="font-bold mb-2">Result:</h3>
        <pre className="whitespace-pre-wrap text-sm">{result}</pre>
      </div>
    </div>
  );
};

export default ApiTest;
