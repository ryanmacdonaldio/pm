import { PlusIcon } from '@heroicons/react/outline';
import Link from 'next/link';

import { TicketList } from '../../components/TicketList';
import requireLayoutProps from '../../utils/requireLayoutProps';
import { trpc } from '../../utils/trpc';

function All() {
  const { data: tickets, isLoading } = trpc.ticket.getAll.useQuery();

  return (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">All Tickets</span>
        <Link href="/tickets/add">
          <button className="bg-blue-100 border-2 border-blue-400 flex items-center px-3 py-1 rounded-md space-x-2 text-blue-900">
            <PlusIcon className="h-3 w-3" />
            <span>Add Ticket</span>
          </button>
        </Link>
      </div>
      <TicketList
        isLoading={isLoading}
        tickets={tickets?.filter((ticket) => ticket.archived)}
      />
    </div>
  );
}

export const getServerSideProps = requireLayoutProps(async (ctx) => {
  return { props: {} };
});

export default All;
