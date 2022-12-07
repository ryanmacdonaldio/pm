import type { Session } from 'next-auth';

import TicketForm from '../../../components/TicketForm';
import { getSession } from '../../../lib/session';
import { prisma } from '../../../lib/db';

async function getProjects(session: Session) {
  const projects = await prisma.project.findMany({
    where: {
      organizationId: session.user.settings.organization,
    },
  });

  return projects;
}

async function getTicketPriorities(session: Session) {
  const ticketPriorities = await prisma.ticketPriority.findMany({
    where: {
      organizationId: session.user.settings.organization,
    },
  });

  return ticketPriorities;
}

async function getTicketStatuses(session: Session) {
  const ticketStatuses = await prisma.ticketStatus.findMany({
    where: {
      organizationId: session.user.settings.organization,
    },
  });

  return ticketStatuses;
}

async function getTicketTypes(session: Session) {
  const ticketTypes = await prisma.ticketType.findMany({
    where: {
      organizationId: session.user.settings.organization,
    },
  });

  return ticketTypes;
}

export default async function Page() {
  const session = await getSession();
  const projects = await getProjects(session);
  const ticketPriorities = await getTicketPriorities(session);
  const ticketStatuses = await getTicketStatuses(session);
  const ticketTypes = await getTicketTypes(session);

  return (
    <div className="bg-slate-200 h-screen pt-4">
      <TicketForm
        projects={projects}
        ticketPriorities={ticketPriorities}
        ticketStatuses={ticketStatuses}
        ticketTypes={ticketTypes}
      />
    </div>
  );
}
