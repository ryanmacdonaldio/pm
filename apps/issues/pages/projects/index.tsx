import { PlusIcon } from '@heroicons/react/outline';
import Link from 'next/link';

import { ProjectList } from '../../components/ProjectList';
import requireLayoutProps from '../../utils/requireLayoutProps';
import { trpc } from '../../utils/trpc';

function Index() {
  const { data: projects, isLoading } = trpc.project.getUserProjects.useQuery();

  return (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">My Projects</span>
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

export default Index;
