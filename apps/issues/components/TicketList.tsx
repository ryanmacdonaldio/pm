import { InformationCircleIcon } from '@heroicons/react/outline';
import { Prisma } from '@prisma/client';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';

type TicketType = Prisma.TicketGetPayload<{
  include: {
    project: true;
    ticketPriority: true;
    ticketStatus: true;
    ticketType: true;
  };
}>;

export function TicketList({
  isLoading,
  tickets,
}: {
  isLoading: boolean;
  tickets: TicketType[] | null | undefined;
}) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  const columnHelper = createColumnHelper<TicketType>();
  const columns = [
    columnHelper.accessor('title', {
      header: () => 'Title',
      cell: (info) => <div className="pl-1">{info.getValue()}</div>,
    }),
    columnHelper.accessor('project.name', {
      header: () => 'Project',
      cell: (info) => <div className="text-center">{info.getValue()}</div>,
    }),
    columnHelper.accessor('createdAt', {
      header: () => 'Created',
      cell: (info) => {
        const date = new Date(info.getValue());

        return (
          <div className="text-center">
            {typeof date === 'undefined' || date === null
              ? ''
              : date.toLocaleString('en-US', dateOptions)}
          </div>
        );
      },
    }),
    columnHelper.accessor('ticketPriority', {
      header: () => 'Priority',
      cell: (info) => (
        <div className="text-center">{info.getValue()?.value ?? ''}</div>
      ),
    }),
    columnHelper.accessor('ticketStatus', {
      header: () => 'Status',
      cell: (info) => (
        <div className="text-center">{info.getValue()?.value ?? ''}</div>
      ),
    }),
    columnHelper.accessor('ticketType', {
      header: () => 'Type',
      cell: (info) => (
        <div className="text-center">{info.getValue()?.value ?? ''}</div>
      ),
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
    data: tickets ?? [],
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
        ) : tickets?.length === 0 ? (
          <tr className="border-b">
            <td className="px-2 py-1">
              <span className="font-light italic text-slate-900">
                No Tickets Found
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
