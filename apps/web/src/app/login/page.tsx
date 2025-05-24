'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { setToken } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api<{ token: string }>('/auth/login', 'POST', { email, password });
      setToken(res.token);

      const role = JSON.parse(atob(res.token.split('.')[1])).role;
      if (role === 'expert') router.push('/tickets/assigned-to-me');
      else router.push('/tickets/my');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={login} className="bg-white shadow p-6 rounded w-full max-w-sm">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          className="border px-3 py-2 mb-3 w-full rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border px-3 py-2 mb-4 w-full rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Sign In
        </button>
      </form>
    </div>
  );
}
