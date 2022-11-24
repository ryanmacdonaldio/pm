import { zodResolver } from '@hookform/resolvers/zod';
import { TicketModel } from '@pm/prisma';
import { useRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import FormInput from '../../components/FormInput';
import Head from '../../components/Head';
import { trpc } from '../../lib/trpc';
import requireLayoutProps from '../../utils/requireLayoutProps';

interface QParams extends ParsedUrlQuery {
  project_id: string | undefined;
}

const FormSchema = TicketModel.omit({
  createdAt: true,
  creatorId: true,
  id: true,
  updatedAt: true,
});
type FormSchemaType = z.infer<typeof FormSchema>;

function Add() {
  const router = useRouter();
  const { project_id } = router.query as QParams;

  const { mutateAsync } = trpc.ticket.add.useMutation();
  const { data: projects } = trpc.project.getAll.useQuery();
  const { data: ticketPriorities } = trpc.ticket.priority.getAll.useQuery();
  const { data: ticketStatuses } = trpc.ticket.status.getAll.useQuery();
  const { data: ticketTypes } = trpc.ticket.type.getAll.useQuery();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    const ticketID = await mutateAsync(data);

    reset();

    router.push(`/tickets/${ticketID}`);
  };

  return (
    <div className="bg-slate-200 h-screen pt-4">
      <Head title="Add Ticket" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-slate-50 mx-auto rounded-md shadow-md w-2/3">
          <div className="col-span-3 border-b font-medium p-4 text-slate-700 text-xl w-full">
            New Ticket
          </div>
          <div className="gap-6 grid grid-cols-3 my-4 px-6">
            <FormInput
              className="col-span-2 w-full"
              error={errors.title}
              label="Title"
              register={register('title')}
              type="text"
            />
            <FormInput
              className="col-span-3 w-full"
              error={errors.description}
              label="Description"
              register={register('description')}
              type="textarea"
            />
            <FormInput
              className="col-span-3 w-full"
              defaultListValue={project_id}
              error={errors.projectId}
              label="Project"
              listValues={
                projects?.map((project) => ({
                  id: project.id,
                  value: project.name,
                })) ?? []
              }
              register={register('projectId')}
              type="list"
            />
            <FormInput
              className="col-span-3 w-full"
              error={errors.ticketPriorityId}
              label="Ticket Priority"
              listValues={
                ticketPriorities?.map((ticketPriority) => ({
                  id: ticketPriority.id,
                  value: ticketPriority.value,
                })) ?? []
              }
              register={register('ticketPriorityId')}
              type="list"
            />
            <FormInput
              className="col-span-3 w-full"
              error={errors.ticketStatusId}
              label="Ticket Status"
              listValues={
                ticketStatuses?.map((ticketStatus) => ({
                  id: ticketStatus.id,
                  value: ticketStatus.value,
                })) ?? []
              }
              register={register('ticketStatusId')}
              type="list"
            />
            <FormInput
              className="col-span-3 w-full"
              error={errors.ticketTypeId}
              label="Ticket Type"
              listValues={
                ticketTypes?.map((ticketType) => ({
                  id: ticketType.id,
                  value: ticketType.value,
                })) ?? []
              }
              register={register('ticketTypeId')}
              type="list"
            />
            <FormInput
              className="col-span-3 w-full"
              error={errors.archived}
              label="Archived"
              register={register('archived')}
              type="checkbox"
            />
          </div>
          <div className="bg-slate-100 px-8 py-4 rounded-b-md text-right">
            <button
              type="submit"
              className="bg-slate-400 font-medium px-4 py-2 rounded-md shadow-sm text-md text-slate-800 hover:bg-slate-500 hover:text-slate-900"
              disabled={false}
            >
              Create
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export const getServerSideProps = requireLayoutProps(async (ctx) => {
  return { props: {} };
});

export default Add;
