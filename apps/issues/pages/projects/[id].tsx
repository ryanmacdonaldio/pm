import { PlusIcon } from '@heroicons/react/outline';
import { useRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';
import { useEffect } from 'react';

import requireLayoutProps from '../../utils/requireLayoutProps';
import { trpc } from '../../utils/trpc';

interface QParams extends ParsedUrlQuery {
  id: string;
}

function ProjectDetails() {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const router = useRouter();
  const { id } = router.query as QParams;

  const { data: project, isLoading } = trpc.project.get.useQuery({ id });

  useEffect(() => {
    if (router && !isLoading && !project) {
      router.push('/');
    }
  }, [isLoading, project, router]);

  return isLoading || !project ? (
    <div>Loading...</div>
  ) : (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">
          {project.name}
        </span>
        <button className="bg-blue-100 border-2 border-blue-400 flex items-center px-3 py-1 rounded-md space-x-2 text-blue-900">
          <PlusIcon className="h-3 w-3" />
          <span>Add Ticket</span>
        </button>
      </div>
      <div className="col-span-1 flex flex-col space-y-4">
        <div className="bg-slate-50 p-4 rounded-lg shadow-md">
          <span className="font-medium text-xl text-slate-900">
            Project Details
          </span>
          <div
            className="grid mx-2 my-2 space-y-1"
            style={{ gridTemplateColumns: '1fr 3fr' }}
          >
            <span>Start Date</span>
            <span>
              {project.startDate?.toLocaleString('en-US', dateOptions) ?? ''}
            </span>
            <span>End Date</span>
            <span>
              {project.endDate?.toLocaleString('en-US', dateOptions) ?? ''}
            </span>
            <span>Description</span>
            <span>{project.description}</span>
          </div>
        </div>
        <div className="bg-slate-50 col-span-1 p-4 rounded-lg shadow-md">
          <span className="font-medium text-xl text-slate-900">Team</span>
        </div>
      </div>
      <div className="bg-slate-50 col-span-3 p-4 rounded-lg shadow-md">
        <span className="font-medium text-xl text-slate-900">Tickets</span>
      </div>
    </div>
  );
}

export const getServerSideProps = requireLayoutProps(async (ctx) => {
  return { props: {} };
});

export default ProjectDetails;
