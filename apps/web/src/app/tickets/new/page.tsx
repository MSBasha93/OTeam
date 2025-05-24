'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function NewTicket() {
  const { token } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api('/tickets', 'POST', { title, description, priority }, token!);
      router.push('/tickets/my');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Create New Ticket</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        <input
          className="border w-full px-3 py-2 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border w-full px-3 py-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="border w-full px-3 py-2 rounded"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium (default)</option>
          <option value="high">High</option>
        </select>
        <button className="bg-blue-600 text-white py-2 w-full rounded hover:bg-blue-700">
          Submit Ticket
        </button>
      </form>
    </div>
  );
}
