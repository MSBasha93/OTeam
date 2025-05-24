'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', role: 'client', expertise: '' });
  const [message, setMessage] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api('/auth/register', 'POST', form);
      setMessage('Registration submitted. Awaiting approval.');
      setForm({ email: '', password: '', role: 'client', expertise: '' });
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-3">
        <h2 className="text-xl font-semibold">Register</h2>
        {message && <p className="text-sm text-green-600">{message}</p>}
        <input className="w-full border p-2 rounded" placeholder="Email" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password"
          value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="w-full border p-2 rounded" value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="client">Client</option>
          <option value="expert">Expert</option>
        </select>
        {form.role === 'expert' && (
          <input className="w-full border p-2 rounded" placeholder="Expertise domain"
            value={form.expertise} onChange={(e) => setForm({ ...form, expertise: e.target.value })} />
        )}
        <button className="bg-blue-600 text-white w-full p-2 rounded hover:bg-blue-700">Submit</button>
      </form>
    </div>
  );
}
