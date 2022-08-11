import { Sidebar } from '../components/Sidebar';

export function Index() {
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
        <div className="bg-slate-50 p-4 rounded-lg">Tickets By Project</div>
        <div className="bg-slate-50 p-4 rounded-lg">Tickets By Status</div>
        <div className="bg-slate-50 p-4 rounded-lg">Tickets By Priority</div>
        <div className="bg-slate-50 p-4 rounded-lg">Tickets By Type</div>
      </main>
    </div>
  );
}

export default Index;
