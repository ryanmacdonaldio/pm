import { InformationCircleIcon } from '@heroicons/react/outline';
import { Prisma } from '@prisma/client';
import Link from 'next/link';

type TicketType = Prisma.TicketGetPayload<{
  include: {
    project: true;
    ticketPriority: true;
    ticketStatus: true;
    ticketType: true;
  };
}>;

export default function TicketList({ tickets }: { tickets: TicketType[] }) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  };

  return (
    <table className="bg-slate-50 col-span-4 mt-4 overflow-hidden rounded-lg shadow-md text-slate-800 w-full">
      <thead className="bg-slate-100 text-slate-900">
        <tr>
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Project</th>
          <th className="px-4 py-2">Created</th>
          <th className="px-4 py-2">Priority</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Type</th>
          <th className="px-4 py-2">Details</th>
        </tr>
      </thead>
      <tbody>
        {tickets.length === 0 ? (
          <tr className="border-b">
            <td className="px-2 py-1">
              <span className="font-light italic text-slate-900">
                No Tickets Found
              </span>
            </td>
          </tr>
        ) : (
          tickets.map((ticket) => (
            <tr key={ticket.id} className="border-b">
              <td className="px-2 py-1">
                <div className="pl-1">{ticket.title}</div>
              </td>
              <td className="px-2 py-1">
                <div className="text-center">{ticket.project.name}</div>
              </td>
              <td className="px-2 py-1">
                <div className="text-center">
                  {typeof ticket.createdAt === 'undefined' ||
                  ticket.createdAt === null
                    ? ''
                    : ticket.createdAt.toLocaleString('en-US', dateOptions)}
                </div>
              </td>
              <td className="px-2 py-1">
                {ticket.ticketPriority ? (
                  <div className="flex flex-row items-center justify-center space-x-2">
                    {ticket.ticketPriority && (
                      <div
                        className="h-2 rounded-md w-2"
                        style={{
                          backgroundColor: ticket.ticketPriority.colour,
                        }}
                      />
                    )}
                    <span>{ticket.ticketPriority.value}</span>
                  </div>
                ) : (
                  ''
                )}
              </td>
              <td className="px-2 py-1">
                {ticket.ticketStatus ? (
                  <div className="flex flex-row items-center justify-center space-x-2">
                    {ticket.ticketStatus && (
                      <div
                        className="h-2 rounded-md w-2"
                        style={{ backgroundColor: ticket.ticketStatus.colour }}
                      />
                    )}
                    <span>{ticket.ticketStatus.value}</span>
                  </div>
                ) : (
                  ''
                )}
              </td>
              <td className="px-2 py-1">
                {ticket.ticketType ? (
                  <div className="flex flex-row items-center justify-center space-x-2">
                    {ticket.ticketType && (
                      <div
                        className="h-2 rounded-md w-2"
                        style={{ backgroundColor: ticket.ticketType.colour }}
                      />
                    )}
                    <span>{ticket.ticketType.value}</span>
                  </div>
                ) : (
                  ''
                )}
              </td>
              <td className="px-2 py-1">
                <Link href={`/tickets/${ticket.id}`}>
                  <InformationCircleIcon className="h-5 mx-auto w-5 hover:cursor-pointer" />
                </Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
