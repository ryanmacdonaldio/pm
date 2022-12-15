import { PlusIcon } from '@heroicons/react/outline';
import type { Session } from 'next-auth';
import Link from 'next/link';

import Charts, { ChartData } from '../components/Charts';
import ProjectList from '../components/ProjectList';
import { prisma } from '../lib/db';
import { getSession } from '../lib/session';

async function getProjects(session: Session) {
  const projects = await prisma.project.findMany({
    include: { team: { include: { user: true } }, tickets: true },
    where: {
      organizationId: { equals: session.user.settings.organization },
    },
  });

  if (session.user.admin) return projects;

  return projects.filter((project) =>
    project.team.map((member) => member.userId).includes(session.user.id)
  );
}

async function getTickets(session: Session) {
  const tickets = await prisma.ticket.findMany({
    include: {
      project: true,
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

  return tickets;
}

async function getTicketPriorities(session: Session) {
  const ticketPriorities = await prisma.ticketPriority.findMany({
    orderBy: [{ rank: 'asc' }, { value: 'asc' }],
    where: {
      organizationId: { equals: session.user.settings.organization },
    },
  });

  return ticketPriorities;
}

async function getTicketStatuses(session: Session) {
  const ticketStatuses = await prisma.ticketStatus.findMany({
    orderBy: [{ rank: 'asc' }, { value: 'asc' }],
    where: {
      organizationId: { equals: session.user.settings.organization },
    },
  });

  return ticketStatuses;
}

async function getTicketTypes(session: Session) {
  const ticketTypes = await prisma.ticketType.findMany({
    orderBy: [{ rank: 'asc' }, { value: 'asc' }],
    where: {
      organizationId: { equals: session.user.settings.organization },
    },
  });

  return ticketTypes;
}

export default async function Page() {
  const session = (await getSession()) as Session;

  const projects = await getProjects(session);
  const tickets = await getTickets(session);
  const ticketPriorities = await getTicketPriorities(session);
  const ticketStatuses = await getTicketStatuses(session);
  const ticketTypes = await getTicketTypes(session);

  const importantFilterIds = ticketPriorities
    .filter((priority) => priority.rank === ticketPriorities[0].rank)
    .map((priority) => priority.id);

  const data = projects.map((project) => {
    const project_data: ChartData = {
      project: project.name,
      priority: [],
      status: [],
      type: [],
    };

    const project_tickets = tickets?.filter(
      (ticket) => ticket.projectId === project.id
    );

    ticketPriorities.forEach((priority) => {
      const count = project_tickets.filter(
        (ticket) => ticket.ticketPriorityId === priority.id
      ).length;

      project_data.priority = project_data.priority.concat({
        colour: priority.colour,
        key: priority.value,
        value: count,
      });
    });
    ticketStatuses.forEach((status) => {
      const count = project_tickets.filter(
        (ticket) => ticket.ticketStatusId === status.id
      ).length;

      project_data.status = project_data.status.concat({
        colour: status.colour,
        key: status.value,
        value: count,
      });
    });
    ticketTypes.forEach((type) => {
      const count = project_tickets.filter(
        (ticket) => ticket.ticketTypeId === type.id
      ).length;

      project_data.type = project_data.type.concat({
        colour: type.colour,
        key: type.value,
        value: count,
      });
    });

    return project_data;
  });

  const keys: { [key: string]: string[] } = {};

  data.forEach((project) => {
    Object.keys(project)
      .filter((key) => key != 'project')
      .forEach((key) => {
        const type = key.split(' ')[0];

        if (!(type in keys)) keys[type] = [];
        if (!keys[type].includes(key)) keys[type] = keys[type].concat(key);
      });
  });

  return (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">Dashboard</span>
        <div className="flex space-x-4">
          {session.user.admin && (
            <Link href="/projects/add">
              <button className="bg-blue-100 border-2 border-blue-400 flex items-center px-3 py-1 rounded-md space-x-2 text-blue-900">
                <PlusIcon className="h-3 w-3" />
                <span>Add Project</span>
              </button>
            </Link>
          )}
          <Link href="/tickets/add">
            <button className="bg-green-100 border-2 border-green-400 flex items-center px-3 py-1 rounded-md space-x-2 text-green-900">
              <PlusIcon className="h-3 w-3" />
              <span>Add Ticket</span>
            </button>
          </Link>
        </div>
      </div>
      <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg shadow-md">
        <span className="text-xl">Active Projects</span>
        <div className="bg-blue-200 border-2 border-blue-800 rounded-full px-3 py-1 text-blue-800">
          {projects.filter((project) => !project.archived).length ?? 0}
        </div>
      </div>
      <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg shadow-md">
        <span className="text-xl">Important Tickets</span>
        <div className="bg-red-200 border-2 border-red-800 rounded-full px-3 py-1 text-red-800">
          {
            tickets.filter(
              (ticket) =>
                ticket.ticketPriorityId &&
                importantFilterIds.includes(ticket.ticketPriorityId)
            ).length
          }
        </div>
      </div>
      <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg shadow-md">
        <span className="text-xl">Unresolved Tickets</span>
        <div className="bg-orange-200 border-2 border-orange-800 rounded-full px-3 py-1 text-orange-800">
          {tickets.filter((ticket) => !ticket.archived).length}
        </div>
      </div>
      <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg shadow-md">
        <span className="text-xl">Unassigned Tickets</span>
        <div className="bg-purple-200 border-2 border-purple-800 rounded-full px-3 py-1 text-purple-800">
          {tickets.filter((ticket) => !ticket.assignedId).length}
        </div>
      </div>
      <div className="bg-slate-50 col-span-4 flex flex-col p-4 rounded-lg shadow-md space-y-2">
        <span className="font-medium text-xl text-slate-900">Tickets</span>
        <Charts data={data} keys={keys} />
      </div>
      <div className="bg-slate-50 col-span-4 p-4 rounded-lg shadow-md">
        <span className="font-medium text-xl text-slate-900">Projects</span>
        <ProjectList projects={projects} />
      </div>
    </div>
  );
}
