import { PlusIcon } from '@heroicons/react/outline';
import type { Session } from 'next-auth';
import Link from 'next/link';

import ProjectList from '../../components/ProjectList';
import { prisma } from '../../lib/db';
import { getSession } from '../../lib/session';

async function getProjects(session: Session) {
  const projects = await prisma.project.findMany({
    include: { team: { include: { user: true } }, tickets: true },
    where: {
      team: { some: { userId: { equals: session.user.id } } },
    },
  });

  return projects;
}

export default async function Page() {
  const session = await getSession();
  const projects = await getProjects(session);

  return (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">My Projects</span>
        {session.user.admin && (
          <Link href="/projects/add">
            <button className="bg-blue-100 border-2 border-blue-400 flex items-center px-3 py-1 rounded-md space-x-2 text-blue-900">
              <PlusIcon className="h-3 w-3" />
              <span>Add Project</span>
            </button>
          </Link>
        )}
      </div>
      <ProjectList projects={projects} />
    </div>
  );
}
