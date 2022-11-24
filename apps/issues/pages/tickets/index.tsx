import { PlusIcon } from '@heroicons/react/outline';
import Link from 'next/link';

import Head from '../../components/Head';
import { TicketList } from '../../components/TicketList';
import { trpc } from '../../lib/trpc';
import requireLayoutProps from '../../utils/requireLayoutProps';

function Index() {
  const { data: assignedTickets, isLoading: assignedIsLoading } =
    trpc.ticket.getUserAssignedTickets.useQuery();
  const { data: submittedTickets, isLoading: submittedIsLoading } =
    trpc.ticket.getUserSubmittedTickets.useQuery();

  return (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <Head title="My Tickets" />
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">My Tickets</span>
        <Link href="/tickets/add">
          <button className="bg-blue-100 border-2 border-blue-400 flex items-center px-3 py-1 rounded-md space-x-2 text-blue-900">
            <PlusIcon className="h-3 w-3" />
            <span>Add Ticket</span>
          </button>
        </Link>
      </div>
      {assignedTickets && assignedTickets.length > 0 && (
        <div className="col-span-4 flex flex-col">
          <span className="font-medium pl-2 text-xl text-slate-700">
            Assigned Tickets
          </span>
          <TicketList isLoading={assignedIsLoading} tickets={assignedTickets} />
        </div>
      )}
      {submittedTickets && submittedTickets.length > 0 && (
        <div className="col-span-4 flex flex-col">
          <span className="font-medium pl-2 text-xl text-slate-700">
            Submitted Tickets
          </span>
          <TicketList
            isLoading={submittedIsLoading}
            tickets={submittedTickets}
          />
        </div>
      )}
    </div>
  );
}

export const getServerSideProps = requireLayoutProps(async (ctx) => {
  return { props: {} };
});

export default Index;
