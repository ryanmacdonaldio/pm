import { BookmarkIcon, BookOpenIcon, HomeIcon } from '@heroicons/react/outline';

export function Sidebar() {
  return (
    <aside className="bg-slate-800 flex flex-col h-screen py-4 sticky text-slate-200 top-0 w-48">
      <span className="font-mono mx-8 mb-4 text-3xl text-center">Issues</span>
      <div className="border-t border-slate-400 mx-4 mb-4" />
      <ul className="mb-4 ml-3">
        <li className="flex items-center mb-1 ml-1 space-x-2">
          <HomeIcon className="h-4 w-4" />
          <span>Dashboard</span>
        </li>
        <ul className="mb-1 ml-1">
          <div className="flex items-center space-x-2">
            <BookOpenIcon className="h-4 w-4" />
            <span>Projects</span>
          </div>
          <li className="ml-1">All Projects</li>
          <li className="ml-1">Add Project</li>
          <li className="ml-1">My Projects</li>
          <li className="ml-1">Archived Projects</li>
        </ul>
        <ul className="mb-1 ml-1">
          <div className="flex items-center space-x-2">
            <BookmarkIcon className="h-4 w-4" />
            <span>Tickets</span>
          </div>
          <li className="ml-1">All Tickets</li>
          <li className="ml-1">Add Ticket</li>
          <li className="ml-1">My Tickets</li>
          <li className="ml-1">Archived Tickets</li>
        </ul>
      </ul>
      <div className="border-t border-slate-400 mx-4 mb-4" />
    </aside>
  );
}
