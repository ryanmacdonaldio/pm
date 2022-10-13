import { PlusIcon } from '@heroicons/react/outline';
import { Project } from '@prisma/client';
import Link from 'next/link';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { ProjectList } from '../components/ProjectList';
import requireLayoutProps from '../utils/requireLayoutProps';
import { trpc } from '../utils/trpc';

function Index() {
  const { data: projects } = trpc.project.getAll.useQuery();
  const { data: tickets } = trpc.ticket.getAll.useQuery();
  const { data: ticketPriorities } = trpc.ticket.priority.getAll.useQuery();
  const { data: ticketStatuses } = trpc.ticket.status.getAll.useQuery();
  const { data: ticketTypes } = trpc.ticket.type.getAll.useQuery();

  const data = (projects ?? []).map((project) => {
    const project_data: { [key: string]: Project | number } = { project };

    if (!tickets || !ticketPriorities || !ticketStatuses || !ticketTypes)
      return project_data;

    const project_tickets = tickets?.filter(
      (ticket) => ticket.projectId === project.id
    );

    ticketPriorities.forEach(
      (priority) =>
        (project_data[`priority_${priority.value}`] = project_tickets.filter(
          (ticket) => ticket.ticketPriorityId === priority.id
        ).length)
    );
    ticketStatuses.forEach(
      (status) =>
        (project_data[`status_${status.value}`] = project_tickets.filter(
          (ticket) => ticket.ticketStatusId === status.id
        ).length)
    );
    ticketTypes.forEach(
      (type) =>
        (project_data[`type_${type.value}`] = project_tickets.filter(
          (ticket) => ticket.ticketTypeId === type.id
        ).length)
    );

    return project_data;
  });

  const importantFilterIds =
    ticketPriorities
      ?.filter((priority) => priority.rank === ticketPriorities[0].rank)
      .map((priority) => priority.id) ?? [];

  return (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">Dashboard</span>
        <div className="flex space-x-4">
          <Link href="/projects/add">
            <button className="bg-blue-100 border-2 border-blue-400 flex items-center px-3 py-1 rounded-md space-x-2 text-blue-900">
              <PlusIcon className="h-3 w-3" />
              <span>Add Project</span>
            </button>
          </Link>
          <button className="bg-green-100 border-2 border-green-400 flex items-center px-3 py-1 rounded-md space-x-2 text-green-900">
            <PlusIcon className="h-3 w-3" />
            <span>Add Ticket</span>
          </button>
        </div>
      </div>
      <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg shadow-md">
        <span className="text-xl">Active Projects</span>
        <div className="bg-blue-200 border-2 border-blue-800 rounded-full px-3 py-1 text-blue-800">
          {projects?.filter((project) => !project.archived).length ?? 0}
        </div>
      </div>
      <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg shadow-md">
        <span className="text-xl">Important Tickets</span>
        <div className="bg-red-200 border-2 border-red-800 rounded-full px-3 py-1 text-red-800">
          {tickets && ticketPriorities && ticketPriorities.length > 0
            ? tickets.filter(
                (ticket) =>
                  ticket.ticketPriorityId &&
                  importantFilterIds.includes(ticket.ticketPriorityId)
              ).length
            : 0}
        </div>
      </div>
      <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg shadow-md">
        <span className="text-xl">Unresolved Tickets</span>
        <div className="bg-orange-200 border-2 border-orange-800 rounded-full px-3 py-1 text-orange-800">
          {tickets ? tickets.filter((ticket) => !ticket.archived).length : 0}
        </div>
      </div>
      <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg shadow-md">
        <span className="text-xl">Unassigned Tickets</span>
        <div className="bg-purple-200 border-2 border-purple-800 rounded-full px-3 py-1 text-purple-800">
          {tickets ? tickets.filter((ticket) => !ticket.assignedId).length : 0}
        </div>
      </div>
      <div className="bg-slate-50 col-span-4 flex flex-col p-4 rounded-lg shadow-md space-y-2">
        <span className="font-medium text-xl text-slate-900">Tickets</span>
        {!tickets || !ticketPriorities || !ticketStatuses || !ticketTypes ? (
          <div>Loading...</div>
        ) : (
          <ResponsiveContainer height={500} width="100%">
            <BarChart
              data={data}
              margin={{ bottom: 0, left: 0, right: 0, top: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="project" />
              <YAxis />
              <Tooltip />
              {ticketStatuses.map((status) => (
                <Bar
                  key={status.id}
                  stackId="status"
                  dataKey={`status_${status.value}`}
                  fill={status.colour}
                />
              ))}
              {ticketTypes.map((type) => (
                <Bar
                  key={type.id}
                  stackId="type"
                  dataKey={`type_${type.value}`}
                  fill={type.colour}
                />
              ))}
              {ticketPriorities.map((priority) => (
                <Bar
                  key={priority.id}
                  stackId="priority"
                  dataKey={`priority_${priority.value}`}
                  fill={priority.colour}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="bg-slate-50 col-span-4 p-4 rounded-lg shadow-md">
        <span className="font-medium text-xl text-slate-900">Projects</span>
        <ProjectList isLoading={!projects} projects={projects} />
      </div>
    </div>
  );
}

export const getServerSideProps = requireLayoutProps(async (ctx) => {
  return {
    props: {},
  };
});

export default Index;
