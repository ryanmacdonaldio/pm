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
import TicketDetails from '../../components/TicketDetails_OLD';
import { trpc } from '../../lib/trpc';
import { requireLayoutProps } from '../../lib/utils';

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

function TicketPage() {
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
        <TicketDetails ticket={ticket} />
      </div>
      <div className="col-span-2">
        <div className="bg-slate-50 col-span-1 flex flex-col p-4 rounded-lg shadow-md space-y-2">
          <span className="font-medium text-xl text-slate-900">History</span>
          {ticket.history.length > 0 ? (
            <div className="flex flex-col space-y-2">
              {ticket.history.map((history) => {
                const changedAt = new Date(history.changedAt);

                const previousDiv =
                  history.previousValue !== 'Nil' ? (
                    <div className="bg-slate-200 flex flex-row items-center mx-2 px-1 rounded-md space-x-2">
                      <div
                        className="h-2 rounded-md w-2"
                        style={{
                          backgroundColor: history.previousColour,
                        }}
                      />
                      <span>{history.previousValue}</span>
                    </div>
                  ) : (
                    <></>
                  );

                const newDiv =
                  history.newValue !== 'Nil' ? (
                    <div className="bg-slate-200 flex flex-row items-center mx-2 px-1 rounded-md space-x-2">
                      <div
                        className="h-2 rounded-md w-2"
                        style={{
                          backgroundColor: history.newColour,
                        }}
                      />
                      <span>{history.newValue}</span>
                    </div>
                  ) : (
                    <></>
                  );

                return (
                  <div key={history.id} className="flex flex-col">
                    <div className="flex items-center justify-between space-x-2">
                      <span>{history.user.name}</span>
                      <span className="font-light italic text-sm text-slate-900">
                        {changedAt.toLocaleString('en-US', dateOptions)}
                      </span>
                    </div>
                    <div className="flex">
                      {`${history.changeType} ${
                        history.previousValue === 'Nil'
                          ? 'set to'
                          : history.newValue === 'Nil'
                          ? 'removed (was'
                          : 'changed from'
                      }`}
                      {history.previousValue === 'Nil' ? newDiv : previousDiv}
                      {history.previousValue !== 'Nil'
                        ? history.newValue === 'Nil'
                          ? ')'
                          : 'to'
                        : ''}
                      {history.previousValue !== 'Nil' &&
                        history.newValue !== 'Nil' &&
                        newDiv}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="font-light italic text-slate-900">
              No History Found
            </span>
          )}
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

export default TicketPage;
