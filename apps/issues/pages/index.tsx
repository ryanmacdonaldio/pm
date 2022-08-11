import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Sidebar } from '../components/Sidebar';

interface Ticket {
  title: string;
  project: string;
  status: string;
  type: string;
  priority: string;
}

export function Index() {
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

  const data = tickets
    .map((ticket) => ticket.project)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map((project) => {
      const project_tickets = tickets.filter(
        (ticket) => ticket.project === project
      );

      return {
        project,
        status_backlog: project_tickets.filter(
          (ticket) => ticket.status === 'backlog'
        ).length,
        status_code: project_tickets.filter(
          (ticket) => ticket.status === 'code'
        ).length,
        status_test: project_tickets.filter(
          (ticket) => ticket.status === 'test'
        ).length,
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

  console.log(data);

  return (
    <div className="flex">
      <Sidebar />
      <main className="auto-rows-min bg-slate-200 flex-grow gap-4 grid grid-cols-4 p-4">
        <span className="col-span-4 font-medium pl-2 text-2xl text-slate-900">
          Dashboard
        </span>
        <div className="bg-slate-50 p-4 rounded-lg">Active Projects</div>
        <div className="bg-slate-50 p-4 rounded-lg">Resolved Tickets</div>
        <div className="bg-slate-50 p-4 rounded-lg">Unresolved Tickets</div>
        <div className="bg-slate-50 p-4 rounded-lg">Unassigned Tickets</div>
        <div className="bg-slate-50 col-span-4 p-4 rounded-lg">
          <span>Tickets</span>
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
      </main>
    </div>
  );
}

export default Index;
