import { PlusIcon } from '@heroicons/react/outline';
import type { Session } from 'next-auth';
import Link from 'next/link';

import TicketList from '../../components/TicketList';
import { prisma } from '../../lib/db';
import { getSession } from '../../lib/session';

async function getAssignedTickets(session: Session) {
  const tickets = await prisma.ticket.findMany({
    include: {
      project: true,
      ticketPriority: true,
      ticketStatus: true,
      ticketType: true,
    },
    where: {
      assignedId: session.user.id,
      project: {
        organizationId: { equals: session.user.settings.organization },
      },
    },
  });

  return tickets;
}

async function getSubmittedTickets(session: Session) {
  const tickets = await prisma.ticket.findMany({
    include: {
      project: true,
      ticketPriority: true,
      ticketStatus: true,
      ticketType: true,
    },
    where: {
      creatorId: session.user.id,
      project: {
        organizationId: { equals: session.user.settings.organization },
      },
    },
  });

  return tickets;
}

export default async function Page() {
  const session = await getSession();
  const assignedTickets = await getAssignedTickets(session);
  const submittedTickets = await getSubmittedTickets(session);

  return (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">My Tickets</span>
        <Link href="/tickets/add">
          <button className="bg-blue-100 border-2 border-blue-400 flex items-center px-3 py-1 rounded-md space-x-2 text-blue-900">
            <PlusIcon className="h-3 w-3" />
            <span>Add Ticket</span>
          </button>
        </Link>
      </div>
      {assignedTickets.length > 0 && (
        <div className="col-span-4 flex flex-col">
          <span className="font-medium pl-2 text-xl text-slate-700">
            Assigned Tickets
          </span>
          <TicketList tickets={assignedTickets} />
        </div>
      )}
      {submittedTickets.length > 0 && (
        <div className="col-span-4 flex flex-col">
          <span className="font-medium pl-2 text-xl text-slate-700">
            Submitted Tickets
          </span>
          <TicketList tickets={submittedTickets} />
        </div>
      )}
    </div>
  );
}
