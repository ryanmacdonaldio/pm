import { InformationCircleIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { prisma } from '../../lib/db';

async function getTickets(id: string) {
  const tickets = await prisma.ticket.findMany({
    include: {
      assigned: true,
      ticketPriority: true,
      ticketStatus: true,
      ticketType: true,
    },
    where: {
      projectId: id,
    },
  });

  return tickets;
}

export default async function Tickets({ id }: { id: string }) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  const tickets = await getTickets(id);

  return (
    <>
      <span className="font-medium text-xl text-slate-900">Tickets</span>
      <table className="bg-slate-50 col-span-4 mt-4 overflow-hidden rounded-lg shadow-md text-slate-800 w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Assigned To</th>
            <th className="px-4 py-2">Created Date</th>
            <th className="px-4 py-2">Priority</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? (
            <tr className="border-b">
              <td className="px-2 py-1">No Tickets Found</td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <tr key={ticket.id} className="border-b">
                <td className="px-2 py-1">
                  <div className="pl-1">{ticket.title}</div>
                </td>
                <td className="px-2 py-1">{ticket.assigned?.name ?? ''}</td>
                <td className="px-2 py-1">
                  {new Date(ticket.createdAt).toLocaleString(
                    'en-US',
                    dateOptions
                  )}
                </td>
                <td className="px-2 py-1">
                  {ticket.ticketPriority ? (
                    <div className="flex flex-row justify-center">
                      <div className="bg-slate-200 flex flex-row items-center px-2 space-x-2 rounded-md">
                        <div
                          className="h-2 rounded-md w-2"
                          style={{
                            backgroundColor: ticket.ticketPriority.colour,
                          }}
                        />
                        <span>{ticket.ticketPriority.value}</span>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </td>
                <td className="px-2 py-1">
                  {ticket.ticketStatus ? (
                    <div className="flex flex-row justify-center">
                      <div className="bg-slate-200 flex flex-row items-center px-2 space-x-2 rounded-md">
                        <div
                          className="h-2 rounded-md w-2"
                          style={{
                            backgroundColor: ticket.ticketStatus.colour,
                          }}
                        />
                        <span>{ticket.ticketStatus.value}</span>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </td>
                <td className="px-2 py-1">
                  {ticket.ticketType ? (
                    <div className="flex flex-row justify-center">
                      <div className="bg-slate-200 flex flex-row items-center px-2 space-x-2 rounded-md">
                        <div
                          className="h-2 rounded-md w-2"
                          style={{
                            backgroundColor: ticket.ticketType.colour,
                          }}
                        />
                        <span>{ticket.ticketType.value}</span>
                      </div>
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
    </>
  );
}
