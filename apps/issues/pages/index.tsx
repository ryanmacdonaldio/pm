import { InformationCircleIcon, PlusIcon } from '@heroicons/react/outline';
import { GetServerSidePropsContext } from 'next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import Layout from '../components/Layout';
import { getAuthSession } from '../server/common/get-server-session';
import { prisma } from '../server/db/client';

interface Project {
  title: string;
  start_date?: Date;
  end_date?: Date;
}

interface Ticket {
  title: string;
  project: string;
  status: string;
  type: string;
  priority: string;
  assignee?: string;
}

export function Index() {
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const projects: Project[] = [
    {
      title: 'issues',
      start_date: today,
      end_date: new Date(
        today.getTime() + Math.ceil(Math.random() * 14) * 24 * 60 * 60 * 1000
      ),
    },
    {
      title: 'kanban',
      start_date: today,
      end_date: new Date(
        today.getTime() + Math.ceil(Math.random() * 14) * 24 * 60 * 60 * 1000
      ),
    },
  ];

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

  const data = projects.map((project) => {
    const project_tickets = tickets.filter(
      (ticket) => ticket.project === project.title
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

  const columnHelper = createColumnHelper<Project>();
  const columns = [
    columnHelper.accessor('title', {
      header: () => 'Title',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('start_date', {
      header: () => 'Start Date',
      cell: (info) => (
        <div className="text-center">
          {info.getValue().toLocaleString('en-US', dateOptions)}
        </div>
      ),
    }),
    columnHelper.accessor('end_date', {
      header: () => 'End Date',
      cell: (info) => (
        <div className="text-center">
          {info.getValue().toLocaleString('en-US', dateOptions)}
        </div>
      ),
    }),
    columnHelper.display({
      id: 'details',
      cell: () => <InformationCircleIcon className="h-5 mx-auto w-5" />,
    }),
  ];
  const table = useReactTable({
    columns,
    data: projects,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Layout>
      <div className="auto-rows-min gap-4 grid grid-cols-4">
        <div className="col-span-4 flex items-center justify-between px-2">
          <span className="font-medium text-2xl text-slate-900">Dashboard</span>
          <div className="flex space-x-4">
            <button className="bg-blue-100 border-2 border-blue-400 flex items-center px-3 py-1 rounded-md space-x-2 text-blue-900">
              <PlusIcon className="h-3 w-3" />
              <span>Add Project</span>
            </button>
            <button className="bg-green-100 border-2 border-green-400 flex items-center px-3 py-1 rounded-md space-x-2 text-green-900">
              <PlusIcon className="h-3 w-3" />
              <span>Add Ticket</span>
            </button>
          </div>
        </div>
        <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg">
          <span className="text-xl">Active Projects</span>
          <div className="bg-blue-200 border-2 border-blue-800 rounded-full px-3 py-1 text-blue-800">
            {projects.length}
          </div>
        </div>
        <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg">
          <span className="text-xl">Urgent Tickets</span>
          <div className="bg-red-200 border-2 border-red-800 rounded-full px-3 py-1 text-red-800">
            {tickets.filter((ticket) => ticket.priority === 'urgent').length}
          </div>
        </div>
        <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg">
          <span className="text-xl">Unresolved Tickets</span>
          <div className="bg-orange-200 border-2 border-orange-800 rounded-full px-3 py-1 text-orange-800">
            {tickets.filter((ticket) => ticket.status !== 'done').length}
          </div>
        </div>
        <div className="items-center bg-slate-50 flex font-medium justify-between p-4 rounded-lg">
          <span className="text-xl">Unassigned Tickets</span>
          <div className="bg-purple-200 border-2 border-purple-800 rounded-full px-3 py-1 text-purple-800">
            {tickets.filter((ticket) => ticket.assignee === undefined).length}
          </div>
        </div>
        <div className="bg-slate-50 col-span-4 flex flex-col p-4 rounded-lg space-y-2">
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
        <div className="bg-slate-50 col-span-4 p-4 rounded-lg">
          <span className="font-medium text-xl text-slate-900">Projects</span>
          <table className="mt-4 text-slate-800 w-full">
            <thead className="bg-slate-100 text-slate-900">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-4 py-2">
                      {!header.isPlaceholder &&
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-2 py-1">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getAuthSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
      },
    };
  }

  const organizations = await prisma.organization.findMany();

  if (organizations.length === 0) {
    return {
      redirect: {
        destination: '/organizations/add',
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}

export default Index;
