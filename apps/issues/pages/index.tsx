import { PlusIcon } from '@heroicons/react/outline';
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

interface Ticket {
  title: string;
  project: string;
  status: string;
  type: string;
  priority: string;
  assignee?: string;
}

function Index() {
  const { data: projects, isLoading } = trpc.project.getAll.useQuery();

  const tickets: Ticket[] = [
    {
      title: 'create dashboard',
      project: 'issues',
      status: 'code',
      type: 'feat',
      priority: 'medium',
    },
    {
      title: 'create projects page',
      project: 'issues',
      status: 'backlog',
      type: 'feat',
      priority: 'medium',
    },
    {
      title: 'create tickets page',
      project: 'issues',
      status: 'backlog',
      type: 'feat',
      priority: 'medium',
    },
    {
      title: 'fix sidebar dropdown animation',
      project: 'issues',
      status: 'backlog',
      type: 'fix',
      priority: 'high',
    },
    {
      title: 'create kanban board',
      project: 'kanban',
      status: 'backlog',
      type: 'feat',
      priority: 'medium',
    },
  ];

  const data = (projects ?? []).map((project) => {
    const project_tickets = tickets.filter(
      (ticket) => ticket.project === project.name
    );

    return {
      project,
      status_backlog: project_tickets.filter(
        (ticket) => ticket.status === 'backlog'
      ).length,
      status_code: project_tickets.filter((ticket) => ticket.status === 'code')
        .length,
      status_test: project_tickets.filter((ticket) => ticket.status === 'test')
        .length,
      status_refactor: project_tickets.filter(
        (ticket) => ticket.status === 'refactor'
      ).length,
      type_chore: project_tickets.filter((ticket) => ticket.type === 'chore')
        .length,
      type_feat: project_tickets.filter((ticket) => ticket.type === 'feat')
        .length,
      type_fix: project_tickets.filter((ticket) => ticket.type === 'fix')
        .length,
      priority_urgent: project_tickets.filter(
        (ticket) => ticket.priority === 'urgent'
      ).length,
      priority_high: project_tickets.filter(
        (ticket) => ticket.priority === 'high'
      ).length,
      priority_medium: project_tickets.filter(
        (ticket) => ticket.priority === 'medium'
      ).length,
      priority_low: project_tickets.filter(
        (ticket) => ticket.priority === 'low'
      ).length,
    };
  });

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
          {projects?.length ?? 0}
        </div>
      </div>
      <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg shadow-md">
        <span className="text-xl">Urgent Tickets</span>
        <div className="bg-red-200 border-2 border-red-800 rounded-full px-3 py-1 text-red-800">
          {tickets.filter((ticket) => ticket.priority === 'urgent').length}
        </div>
      </div>
      <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg shadow-md">
        <span className="text-xl">Unresolved Tickets</span>
        <div className="bg-orange-200 border-2 border-orange-800 rounded-full px-3 py-1 text-orange-800">
          {tickets.filter((ticket) => ticket.status !== 'done').length}
        </div>
      </div>
      <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg shadow-md">
        <span className="text-xl">Unassigned Tickets</span>
        <div className="bg-purple-200 border-2 border-purple-800 rounded-full px-3 py-1 text-purple-800">
          {tickets.filter((ticket) => ticket.assignee === undefined).length}
        </div>
      </div>
      <div className="bg-slate-50 col-span-4 flex flex-col p-4 rounded-lg shadow-md space-y-2">
        <span className="font-medium text-xl text-slate-900">Tickets</span>
        <ResponsiveContainer height={500} width="100%">
          <BarChart
            data={data}
            margin={{ bottom: 0, left: 0, right: 0, top: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="project" />
            <YAxis />
            <Tooltip />
            <Bar stackId="status" dataKey="status_backlog" fill="red" />
            <Bar stackId="status" dataKey="status_code" fill="orange" />
            <Bar stackId="status" dataKey="status_test" fill="yellow" />
            <Bar stackId="status" dataKey="status_refactor" fill="green" />
            <Bar stackId="type" dataKey="type_chore" fill="red" />
            <Bar stackId="type" dataKey="type_feat" fill="orange" />
            <Bar stackId="type" dataKey="type_fix" fill="yellow" />
            <Bar stackId="priority" dataKey="priority_urgent" fill="red" />
            <Bar stackId="priority" dataKey="priority_high" fill="orange" />
            <Bar stackId="priority" dataKey="priority_medium" fill="yellow" />
            <Bar stackId="priority" dataKey="priority_low" fill="green" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-slate-50 col-span-4 p-4 rounded-lg shadow-md">
        <span className="font-medium text-xl text-slate-900">Projects</span>
        <ProjectList isLoading={isLoading} projects={projects} />
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
