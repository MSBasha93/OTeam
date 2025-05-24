'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import TicketCard from '@/components/TicketCard';

export default function MyTickets() {
  const { token } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    api('/tickets/assigned-to-me', 'GET', undefined, token)
      .then((data) => setTickets(data as any[]))
      .catch((err: any) => setError(err.message));
  }, [token]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold mb-4">My Tickets</h1>
      {error && <p className="text-red-500">{error}</p>}
      {tickets.length === 0 && <p>No tickets found.</p>}
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
