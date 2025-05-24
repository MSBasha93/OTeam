'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function TicketPage() {
  const { id } = useParams();
  const { token, role } = useAuth();
  const [ticket, setTicket] = useState<any>(null);
  const [rca, setRca] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
    api(`/tickets/${id}`, 'GET', undefined, token)
      .then(setTicket)
      .catch((err) => setMessage(err.message));
  }, [id, token]);

  const submitRca = async () => {
    try {
      await api(`/rca/${id}`, 'POST', { content: rca }, token!);
      setMessage('RCA submitted');
      router.refresh();
    } catch (err: any) {
      setMessage(err.message);
    }
  };

  if (!ticket) return <div className="p-6">Loading ticket...</div>;

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">{ticket.title}</h1>
      <p className="text-gray-600">{ticket.description}</p>
      <p>Status: <strong>{ticket.status}</strong></p>
      <p>Priority: {ticket.priority}</p>
      <p>Created at: {new Date(ticket.createdAt).toLocaleString()}</p>
      {ticket.escalated && <p className="text-red-500">This ticket was escalated.</p>}

      {role === 'expert' && ticket.status === 'resolved' && (
        <div className="mt-6">
          <textarea
            placeholder="Enter RCA here..."
            className="w-full border px-3 py-2 rounded"
            rows={4}
            value={rca}
            onChange={(e) => setRca(e.target.value)}
          />
          <button
            onClick={submitRca}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit RCA
          </button>
        </div>
      )}

      {message && <p className="text-green-600 mt-2">{message}</p>}
    </div>
  );
}
