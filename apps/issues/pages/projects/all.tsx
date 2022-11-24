import { PlusIcon } from '@heroicons/react/outline';
import Link from 'next/link';

import Head from '../../components/Head';
import { ProjectList } from '../../components/ProjectList';
import { trpc } from '../../lib/trpc';
import requireLayoutProps from '../../utils/requireLayoutProps';

function All() {
  const { data: projects, isLoading } = trpc.project.getAll.useQuery();

  return (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <Head title="All Projects" />
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">
          All Projects
        </span>
        <Link href="/projects/add">
          <button className="bg-blue-100 border-2 border-blue-400 flex items-center px-3 py-1 rounded-md space-x-2 text-blue-900">
            <PlusIcon className="h-3 w-3" />
            <span>Add Project</span>
          </button>
        </Link>
      </div>
      <ProjectList isLoading={isLoading} projects={projects} />
    </div>
  );
}

export const getServerSideProps = requireLayoutProps(async (ctx) => {
  return { props: {} };
});

export default All;
