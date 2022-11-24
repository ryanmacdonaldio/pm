import { PlusIcon } from '@heroicons/react/outline';
import Link from 'next/link';

import Head from '../../components/Head';
import { TicketList } from '../../components/TicketList';
import { trpc } from '../../lib/trpc';
import { requireLayoutProps } from '../../lib/utils';

function All() {
  const { data: tickets, isLoading } = trpc.ticket.getAll.useQuery();

  return (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <Head title="All Tickets" />
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">All Tickets</span>
        <Link href="/tickets/add">
          <button className="bg-blue-100 border-2 border-blue-400 flex items-center px-3 py-1 rounded-md space-x-2 text-blue-900">
            <PlusIcon className="h-3 w-3" />
            <span>Add Ticket</span>
          </button>
        </Link>
      </div>
      <TicketList isLoading={isLoading} tickets={tickets} />
    </div>
  );
}

export const getServerSideProps = requireLayoutProps(async (ctx) => {
  return { props: {} };
});

export default All;
