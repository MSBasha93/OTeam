import { formatDistanceToNow } from 'date-fns';

type Ticket = {
  id: number;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  assignee?: { email: string };
  escalated: boolean;
};

export default function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <div className="border bg-white shadow-sm rounded p-4">
      <div className="flex justify-between">
        <h2 className="font-semibold text-lg">{ticket.title}</h2>
        <span className="text-sm text-gray-500">
          #{ticket.id} • {ticket.priority}
        </span>
      </div>
      <p className="text-sm text-gray-600">
        Status: <span className="capitalize">{ticket.status}</span>{' '}
        {ticket.escalated && <span className="text-red-500 ml-2">[Escalated]</span>}
      </p>
      {ticket.assignee && (
        <p className="text-sm text-gray-500">Assigned to: {ticket.assignee.email}</p>
      )}
      <p className="text-xs text-gray-400 mt-1">
        Created {formatDistanceToNow(new Date(ticket.createdAt))} ago
      </p>
    </div>
  );
}
