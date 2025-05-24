'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function PendingUsersPage() {
  const { token, role } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  const fetchPending = async () => {
    try {
      const data = await api('/users/pending', 'GET', undefined, token!);
      setPending(data as any[]);
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
    }
  };

  const approve = async (id: number) => {
    try {
      await api(`/users/${id}/approve`, 'PATCH', undefined, token!);
      setMessage(`Approved user #${id}`);
      fetchPending(); // refresh
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
    }
  };

  useEffect(() => {
    if (role && !['management', 'sdm'].includes(role)) {
      router.push('/');
    }
    if (token) fetchPending();
  }, [token, role]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Pending User Approvals</h1>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      {pending.length === 0 ? (
        <p>No pending users.</p>
      ) : (
        <ul className="space-y-2">
          {pending.map((user) => (
            <li key={user.id} className="border p-3 rounded flex justify-between items-center">
              <div>
                <p className="font-semibold">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Role: {user.role} {user.expertise && `| ${user.expertise}`}
                </p>
              </div>
              <button
                onClick={() => approve(user.id)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
