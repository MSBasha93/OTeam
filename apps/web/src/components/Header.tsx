'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const { role, logout } = useAuth();

  const links = {
    client: [
      { href: '/tickets/my', label: 'My Tickets' },
      { href: '/tickets/new', label: 'Create Ticket' },
    ],
    expert: [
      { href: '/tickets/assigned-to-me', label: 'Assigned Tickets' },
    ],
    management: [
      { href: '/tickets/escalated', label: 'Escalated' },
      { href: '/tickets/unassigned', label: 'Unassigned' },
      { href: '/tickets/with-missing-rca', label: 'Missing RCA' },
    ],
  };

  return (
    <header className="bg-white shadow px-4 py-2 flex items-center justify-between">
      <h1 className="text-lg font-semibold text-blue-600">OTeam</h1>
      <nav className="flex gap-4 text-sm">
        {(links[role as keyof typeof links] || []).map((link) => (
          <Link key={link.href} href={link.href} className="hover:underline">
            {link.label}
          </Link>
        ))}
        <button onClick={logout} className="text-red-500 hover:underline">
          Logout
        </button>
      </nav>
    </header>
  );
}
