import { InformationCircleIcon, PlusIcon } from '@heroicons/react/outline';
import { Prisma } from '@prisma/client';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
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
    day: '2-digit',
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

  const columnHelper = createColumnHelper<
    Prisma.TicketGetPayload<{
      include: {
        assigned: true;
        ticketPriority: true;
        ticketStatus: true;
        ticketType: true;
      };
    }>
  >();
  const columns = [
    columnHelper.accessor('title', {
      header: () => 'Title',
      cell: (info) => <div className="pl-1">{info.getValue()}</div>,
    }),
    columnHelper.accessor('assigned', {
      header: () => 'Assigned To',
      cell: (info) => info.getValue()?.name ?? '',
    }),
    columnHelper.accessor('createdAt', {
      header: () => 'Created Date',
      cell: (info) => {
        const date = new Date(info.getValue());

        return date.toLocaleString('en-US', dateOptions);
      },
    }),
    columnHelper.accessor('ticketPriority', {
      header: () => 'Priority',
      cell: (info) => info.getValue()?.value ?? '',
    }),
    columnHelper.accessor('ticketStatus', {
      header: () => 'Status',
      cell: (info) => info.getValue()?.value ?? '',
    }),
    columnHelper.accessor('ticketType', {
      header: () => 'Type',
      cell: (info) => info.getValue()?.value ?? '',
    }),
    columnHelper.display({
      id: 'details',
      cell: (info) => (
        <Link href={`/tickets/${info.row.original.id}`}>
          <InformationCircleIcon className="h-5 mx-auto w-5 hover:cursor-pointer" />
        </Link>
      ),
    }),
  ];

  const table = useReactTable({
    columns,
    data: project?.tickets ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  return isLoading || !project ? (
    <div>Loading...</div>
  ) : (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">
          {project.name}
        </span>
        <Link href={`/tickets/add?project_id=${id}`}>
          <button className="bg-blue-100 border-2 border-blue-400 flex items-center px-3 py-1 rounded-md space-x-2 text-blue-900">
            <PlusIcon className="h-3 w-3" />
            <span>Add Ticket</span>
          </button>
        </Link>
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
        <table className="bg-slate-50 col-span-4 mt-4 overflow-hidden rounded-lg shadow-md text-slate-800 w-full">
          <thead>
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
            {isLoading ? (
              <tr className="border-b">
                <td className="px-2 py-1">Loading...</td>
              </tr>
            ) : project?.tickets.length === 0 ? (
              <tr className="border-b">
                <td className="px-2 py-1">No Tickets Found</td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const getServerSideProps = requireLayoutProps(async (ctx) => {
  return { props: {} };
});

export default ProjectDetails;
