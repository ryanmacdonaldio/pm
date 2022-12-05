import { PlusIcon } from '@heroicons/react/outline';
import { Session } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import ProjectDetails from '../../../components/Project/Details';
import ProjectTeamMembers from '../../../components/Project/TeamMembers';
import ProjectTickets from '../../../components/Project/Tickets';
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
    where: { id },
  });

  return project;
}

async function getTickets(id: string) {
  const tickets = await prisma.ticket.findMany({
    where: {
      projectId: id,
    },
  });

  return tickets;
}

async function getTeam(id: string) {
  const team = await prisma.user.findMany({
    where: {
      usersInProject: {
        some: {
          projectId: id,
        },
      },
    },
  });

  return team;
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
  const team = await getTeam(id);
  const tickets = await getTickets(id);
  const users = await getUsers(id);

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
        <ProjectDetails project={project} />
        <ProjectTeamMembers
          id={id}
          organizationUsers={organizationUsers}
          users={users}
        />
      </div>
      <div className="bg-slate-50 col-span-3 p-4 rounded-lg shadow-md">
        <ProjectTickets id={id} />
      </div>
    </div>
  );
}
