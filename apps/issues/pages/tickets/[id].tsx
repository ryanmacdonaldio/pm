import { useRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';
import { useEffect } from 'react';

import requireLayoutProps from '../../utils/requireLayoutProps';
import { trpc } from '../../utils/trpc';

interface QParams extends ParsedUrlQuery {
  id: string;
}

function TicketDetails() {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  const router = useRouter();
  const { id } = router.query as QParams;

  const { data: ticket, isLoading } = trpc.ticket.get.useQuery({ id });

  useEffect(() => {
    if (router && !isLoading && !ticket) {
      console.log(ticket);
      router.push('/');
    }
  }, [isLoading, router, ticket]);

  return isLoading || !ticket ? (
    <div>Loading...</div>
  ) : (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <div className="col-span-4 flex items-center justify-between px-2">
        <div className="flex space-x-2 text-2xl text-slate-900">
          <span className="font-light ">{ticket.project.name}</span>
          <span className=" font-normal">&gt;</span>
          <span className=" font-medium">{ticket.title}</span>
        </div>
      </div>
      <div className="col-span-1 flex flex-col space-y-4">
        <div className="bg-slate-50 p-4 rounded-lg shadow-md">
          <span className="font-medium text-xl text-slate-900">
            Ticket Details
          </span>
          <div
            className="grid mx-2 my-2 space-y-1"
            style={{ gridTemplateColumns: '1fr 3fr' }}
          >
            <span className="mt-1">Description</span>
            <span>{ticket.description}</span>
            <span>Created</span>
            <span>
              {new Date(ticket.createdAt).toLocaleString('en-US', dateOptions)}
            </span>
            <span>Priority</span>
            <span>{ticket.ticketPriority?.value}</span>
            <span>Status</span>
            <span>{ticket.ticketStatus?.value}</span>
            <span>Type</span>
            <span>{ticket.ticketType?.value}</span>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 col-span-2 p-4 rounded-lg shadow-md">
        <span className="font-medium text-xl text-slate-900">History</span>
      </div>
      <div className="bg-slate-50 col-span-1 p-4 rounded-lg shadow-md">
        <span className="font-medium text-xl text-slate-900">Comments</span>
      </div>
    </div>
  );
}

export const getServerSideProps = requireLayoutProps(async (ctx) => {
  return { props: {} };
});

export default TicketDetails;