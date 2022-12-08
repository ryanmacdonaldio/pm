import { PlusIcon } from '@heroicons/react/outline';
import type { Session } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import TicketList from '../../../components/TicketList';
import { prisma } from '../../../lib/db';
import { getSession } from '../../../lib/session';

async function getTickets(session: Session) {
  const tickets = await prisma.ticket.findMany({
    include: {
      project: {
        include: {
          team: true,
        },
      },
      ticketPriority: true,
      ticketStatus: true,
      ticketType: true,
    },
    where: {
      project: {
        organizationId: { equals: session.user.settings.organization },
      },
    },
  });

  if (session.user.admin) return tickets;

  return tickets.filter((ticket) =>
    ticket.project.team
      .filter((member) => member.manager)
      .map((member) => member.userId)
      .includes(session.user.id)
  );
}

export default async function Page() {
  const session = await getSession();
  if (!session.user.admin && !session.user.pm) redirect('/');

  const tickets = await getTickets(session);

  return (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">All Tickets</span>
        <Link href="/tickets/add">
          <button className="bg-blue-100 border-2 border-blue-400 flex items-center px-3 py-1 rounded-md space-x-2 text-blue-900">
            <PlusIcon className="h-3 w-3" />
            <span>Add Ticket</span>
          </button>
        </Link>
      </div>
      <TicketList tickets={tickets} />
    </div>
  );
}
