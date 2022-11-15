import { zodResolver } from '@hookform/resolvers/zod';
import { TicketCommentModel } from '@pm/prisma';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import FormInput from '../../components/FormInput';
import Head from '../../components/Head';
import requireLayoutProps from '../../utils/requireLayoutProps';
import { trpc } from '../../utils/trpc';

interface QParams extends ParsedUrlQuery {
  id: string;
}

const FormSchema = TicketCommentModel.omit({
  createdAt: true,
  creatorId: true,
  id: true,
  ticketId: true,
});
type FormSchemaType = z.infer<typeof FormSchema>;

function TicketDetails() {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  const router = useRouter();
  const { id } = router.query as QParams;

  const { data: ticket, isLoading } = trpc.ticket.get.useQuery({ id });
  const { mutateAsync } = trpc.ticket.comment.add.useMutation();
  const utils = trpc.useContext();

  useEffect(() => {
    if (router && !isLoading && !ticket) {
      router.push('/');
    }
  }, [isLoading, router, ticket]);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormSchemaType>({ resolver: zodResolver(FormSchema) });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    await mutateAsync({ ...data, ticketId: id });

    reset();

    await utils.ticket.get.invalidate({ id });
  };

  return isLoading || !ticket ? (
    <div>Loading...</div>
  ) : (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <Head title={`${ticket.project.name} > ${ticket.title}`} />
      <div className="col-span-4 flex items-center justify-between px-2">
        <div className="flex space-x-2 text-2xl text-slate-900">
          <Link href={`/projects/${ticket.projectId}`}>
            <span className="cursor-pointer font-light">
              {ticket.project.name}
            </span>
          </Link>
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
            <div className="flex flex-row items-center space-x-2">
              {ticket.ticketPriority && (
                <div
                  className="h-2 rounded-md w-2"
                  style={{ backgroundColor: ticket.ticketPriority.colour }}
                />
              )}
              <span>{ticket.ticketPriority?.value}</span>
            </div>
            <span>Status</span>
            <div className="flex flex-row items-center space-x-2">
              {ticket.ticketStatus && (
                <div
                  className="h-2 rounded-md w-2"
                  style={{ backgroundColor: ticket.ticketStatus.colour }}
                />
              )}
              <span>{ticket.ticketStatus?.value}</span>
            </div>
            <span>Type</span>
            <div className="flex flex-row items-center space-x-2">
              {ticket.ticketType && (
                <div
                  className="h-2 rounded-md w-2"
                  style={{ backgroundColor: ticket.ticketType.colour }}
                />
              )}
              <span>{ticket.ticketType?.value}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <div className="bg-slate-50 p-4 rounded-lg shadow-md">
          <span className="font-medium text-xl text-slate-900">History</span>
        </div>
      </div>
      <div>
        <div className="bg-slate-50 col-span-1 mb-4 p-4 rounded-lg shadow-md">
          <span className="font-medium text-xl text-slate-900">
            Add Comment
          </span>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col space-y-2">
              <FormInput
                className="w-full"
                error={errors.comment}
                label=""
                register={register('comment')}
                type="textarea"
              />
              <button
                type="submit"
                className="bg-slate-400 font-medium px-4 py-2 rounded-md shadow-sm text-md text-slate-800 hover:bg-slate-500 hover:text-slate-900"
                disabled={isLoading}
              >
                Add
              </button>
            </div>
          </form>
        </div>
        <div className="bg-slate-50 col-span-1 flex flex-col p-4 rounded-lg shadow-md space-y-2">
          <span className="font-medium text-xl text-slate-900">Comments</span>
          {ticket.comments?.length > 0 ? (
            <div className="flex flex-col space-y-2">
              {ticket.comments.map((comment) => {
                const createdAt = new Date(comment.createdAt);
                return (
                  <div key={comment.id} className="flex flex-col">
                    <div className="flex items-center justify-between space-x-2">
                      <span>{comment.creator.name}</span>
                      <span className="font-light italic text-sm text-slate-900">
                        {createdAt.toLocaleString('en-US', dateOptions)}
                      </span>
                    </div>
                    <div>{comment.comment}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="font-light italic text-slate-900">
              No Comments Found
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = requireLayoutProps(async (ctx) => {
  return { props: {} };
});

export default TicketDetails;
