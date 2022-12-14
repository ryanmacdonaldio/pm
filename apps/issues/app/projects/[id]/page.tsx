import { PlusIcon } from '@heroicons/react/outline';
import { Session } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import ProjectDetails from '../../../components/Project/Details';
import ProjectTeamMembers from '../../../components/Project/TeamMembers';
import TicketList from '../../../components/TicketList';
import { prisma } from '../../../lib/db';
import { getSession } from '../../../lib/session';

interface PageProps {
  params: {
    id: string;
  };
}

async function getOrganizationUsers(session: Session) {
  const users = await prisma.user.findMany({
    where: {
      usersInOrganization: {
        some: { organizationId: session.user.settings.organization },
      },
    },
  });

  return users;
}

async function getProject(id: string) {
  const project = await prisma.project.findUnique({
    include: { team: true },
    where: { id },
  });

  return project;
}

async function getTickets(id: string) {
  const tickets = await prisma.ticket.findMany({
    include: {
      project: true,
      ticketPriority: true,
      ticketStatus: true,
      ticketType: true,
    },
    where: {
      projectId: id,
    },
  });

  return tickets;
}

async function getUsers(id: string) {
  const users = await prisma.user.findMany({
    where: { usersInProject: { some: { projectId: id } } },
  });

  return users;
}

export default async function Page({ params: { id } }: PageProps) {
  const session = await getSession();
  const project = await getProject(id);

  if (!project) {
    redirect('/');
  }

  const organizationUsers = await getOrganizationUsers(session);
  const tickets = await getTickets(id);
  const users = await getUsers(id);

  const managerArray = project.team.filter((member) => member.manager);

  const editable =
    session.user.admin ||
    (managerArray.length > 0 && managerArray[0].userId === session.user.id);

  return (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">
          {project.name}
        </span>
        <Link href={`/tickets/add?project_id=${id}`}>
          <button className="bg-blue-100 border-2 border-blue-400 flex items-center px-3 py-1 rounded-md space-x-2 text-blue-900">
            <PlusIcon className="h-3 w-3" />
            <span>Add Ticket</span>
          </button>
        </Link>
      </div>
      <div className="col-span-1 flex flex-col space-y-4">
        <ProjectDetails editable={editable} project={project} />
        <ProjectTeamMembers
          editable={editable}
          id={id}
          organizationUsers={organizationUsers}
          users={users}
        />
      </div>
      <div className="bg-slate-50 col-span-3 p-4 rounded-lg shadow-md">
        <span className="font-medium text-xl text-slate-900">Tickets</span>
        <TicketList tickets={tickets} />
      </div>
    </div>
  );
}
