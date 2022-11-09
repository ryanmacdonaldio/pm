import { InformationCircleIcon } from '@heroicons/react/outline';
import { Prisma } from '@prisma/client';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Image from 'next/image';
import Link from 'next/link';

type ProjectType = Prisma.ProjectGetPayload<{
  include: { tickets: true };
}>;

const ProfileImage = ({ src, user }: { src?: string; user: string }) => {
  return (
    <Image src={src ?? '/profile.jpg'} alt={user} height="32" width="32" />
  );
};

export function ProjectList({
  isLoading,
  projects,
}: {
  isLoading: boolean;
  projects: ProjectType[] | null | undefined;
}) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const columnHelper = createColumnHelper<ProjectType>();
  const columns = [
    columnHelper.accessor('name', {
      header: () => 'Name',
      cell: (info) => <div className="pl-1">{info.getValue()}</div>,
    }),
    columnHelper.accessor('startDate', {
      header: () => 'Start Date',
      cell: (info) => {
        const date = info.getValue();

        return (
          <div className="text-center">
            {typeof date === 'undefined' || date === null
              ? ''
              : date.toLocaleString('en-US', dateOptions)}
          </div>
        );
      },
    }),
    columnHelper.accessor('endDate', {
      header: () => 'End Date',
      cell: (info) => {
        const date = info.getValue();

        return (
          <div className="text-center">
            {typeof date === 'undefined' || date === null
              ? ''
              : date.toLocaleString('en-US', dateOptions)}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'team',
      header: () => 'Team',
      cell: () => (
        <div className="team-avatars">
          <ProfileImage user="Ryan" />
          <ProfileImage user="Ryan" />
        </div>
      ),
    }),
    columnHelper.display({
      id: 'ticketCount',
      header: () => 'Ticket Count',
      cell: (info) => (
        <div className="text-center">{info.row.original.tickets.length}</div>
      ),
    }),
    columnHelper.display({
      id: 'details',
      cell: (info) => (
        <Link href={`/projects/${info.row.original.id}`}>
          <InformationCircleIcon className="h-5 mx-auto w-5 hover:cursor-pointer" />
        </Link>
      ),
    }),
  ];

  const table = useReactTable({
    columns,
    data: projects ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table className="bg-slate-50 col-span-4 mt-4 overflow-hidden rounded-lg shadow-md text-slate-800 w-full">
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
        {isLoading ? (
          <tr className="border-b">
            <td className="px-2 py-1">Loading...</td>
          </tr>
        ) : projects?.length === 0 ? (
          <tr className="border-b">
            <td className="px-2 py-1">
              <span className="font-light italic text-slate-900">
                No Projects Found
              </span>
            </td>
          </tr>
        ) : (
          table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-2 py-1">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
