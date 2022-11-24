import {
  InformationCircleIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { Prisma, User } from '@prisma/client';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { ParsedUrlQuery } from 'querystring';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import Head from '../../components/Head';
import Modal from '../../components/Modal';
import ProjectDetails from '../../components/ProjectDetails';
import { trpc } from '../../lib/trpc';
import { requireLayoutProps } from '../../lib/utils';

interface QParams extends ParsedUrlQuery {
  id: string;
}

const FormSchema = z.object({
  user: z.string().min(1, 'Please select a user'),
});
type FormSchemaType = z.infer<typeof FormSchema>;

function ProjectPage() {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  const router = useRouter();
  const { id } = router.query as QParams;

  const { mutateAsync: addUser } = trpc.project.addUser.useMutation();
  const { data: project, isLoading } = trpc.project.get.useQuery({ id });
  const { data: users } = trpc.project.getUsers.useQuery({ id });
  const { mutateAsync: removeUser } = trpc.project.removeUser.useMutation();
  const { data: organizationUsers } = trpc.user.getAll.useQuery();
  const utils = trpc.useContext();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const [showModal, setShowModal] = useState<boolean>(false);
  const [addableUsers, setAddableUsers] = useState<User[] | undefined>([]);
  const [addButtonColour, setAddButtonColour] = useState<string>('gray');

  useEffect(() => {
    if (router && !isLoading && !project) {
      router.push('/');
    }
  }, [isLoading, project, router]);

  useEffect(() => {
    const userIds = users?.map((user) => user.id);

    setAddableUsers(
      organizationUsers?.filter((user) => !userIds?.includes(user.id))
    );
  }, [organizationUsers, users]);

  useEffect(() => {
    setAddButtonColour(
      addableUsers && addableUsers.length > 0 ? 'green' : 'gray'
    );
  }, [addableUsers, setAddButtonColour]);

  const columnHelper = createColumnHelper<
    Prisma.TicketGetPayload<{
      include: {
        assigned: true;
        ticketPriority: true;
        ticketStatus: true;
        ticketType: true;
      };
    }>
  >();
  const columns = [
    columnHelper.accessor('title', {
      header: () => 'Title',
      cell: (info) => <div className="pl-1">{info.getValue()}</div>,
    }),
    columnHelper.accessor('assigned', {
      header: () => 'Assigned To',
      cell: (info) => info.getValue()?.name ?? '',
    }),
    columnHelper.accessor('createdAt', {
      header: () => 'Created Date',
      cell: (info) => {
        const date = new Date(info.getValue());

        return date.toLocaleString('en-US', dateOptions);
      },
    }),
    columnHelper.accessor('ticketPriority', {
      header: () => 'Priority',
      cell: (info) => {
        const data = info.getValue();

        return data ? (
          <div className="flex flex-row justify-center">
            <div className="bg-slate-200 flex flex-row items-center px-2 space-x-2 rounded-md">
              <div
                className="h-2 rounded-md w-2"
                style={{ backgroundColor: data.colour }}
              />
              <span>{data.value}</span>
            </div>
          </div>
        ) : (
          ''
        );
      },
    }),
    columnHelper.accessor('ticketStatus', {
      header: () => 'Status',
      cell: (info) => {
        const data = info.getValue();

        return data ? (
          <div className="flex flex-row justify-center">
            <div className="bg-slate-200 flex flex-row items-center px-2 space-x-2 rounded-md">
              <div
                className="h-2 rounded-md w-2"
                style={{ backgroundColor: data.colour }}
              />
              <span>{data.value}</span>
            </div>
          </div>
        ) : (
          ''
        );
      },
    }),
    columnHelper.accessor('ticketType', {
      header: () => 'Type',
      cell: (info) => {
        const data = info.getValue();

        return data ? (
          <div className="flex flex-row justify-center">
            <div className="bg-slate-200 flex flex-row items-center px-2 space-x-2 rounded-md">
              <div
                className="h-2 rounded-md w-2"
                style={{ backgroundColor: data.colour }}
              />
              <span>{data.value}</span>
            </div>
          </div>
        ) : (
          ''
        );
      },
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
    data: project?.tickets ?? [],
    getCoreRowModel: getCoreRowModel(),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    await addUser({ project: id, ...data });

    utils.project.getUsers.invalidate({ id });

    setShowModal(false);

    reset();
  };

  const removeOnClick = async (user: string) => {
    await removeUser({ project: id, user });

    utils.project.getUsers.invalidate({ id });
  };

  return isLoading || !project ? (
    <div>Loading...</div>
  ) : (
    <div className="auto-rows-min gap-4 grid grid-cols-4">
      <Head title={`${project.name}`} />
      <div className="col-span-4 flex items-center justify-between px-2">
        <span className="font-medium text-2xl text-slate-900">
          {project.name}
        </span>
        <Link href={`/tickets/add?project_id=${id}`}>
          <button className="bg-blue-100 border-2 border-blue-400 flex items-center px-3 py-1 rounded-md space-x-2 text-blue-900">
            <PlusIcon className="h-3 w-3" />
            <span>Add Ticket</span>
          </button>
        </Link>
      </div>
      <div className="col-span-1 flex flex-col space-y-4">
        <ProjectDetails project={project} />
        <div className="bg-slate-50 col-span-1 p-4 rounded-lg shadow-md">
          <div className="flex flex-row justify-between">
            <span className="font-medium text-xl text-slate-900">Team</span>
            <button
              className={`bg-${addButtonColour}-100 border-2 border-${addButtonColour}-400 flex items-center px-2 rounded-md space-x-1 text-${addButtonColour}-900`}
              disabled={addableUsers?.length == 0}
              onClick={() => setShowModal(true)}
            >
              <PlusIcon className="h-3 w-3" />
              <span>Add</span>
            </button>
          </div>
          <div className="mt-2">
            {!users || users.length === 0 ? (
              <span className="font-light italic text-slate-900">
                No Team Members Found
              </span>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-row items-center justify-between"
                >
                  <span>{user.email}</span>
                  <TrashIcon
                    className="cursor-pointer h-5 text-red-700 w-5"
                    onClick={() => removeOnClick(user.id)}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="bg-slate-50 col-span-3 p-4 rounded-lg shadow-md">
        <span className="font-medium text-xl text-slate-900">Tickets</span>
        <table className="bg-slate-50 col-span-4 mt-4 overflow-hidden rounded-lg shadow-md text-slate-800 w-full">
          <thead>
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
            ) : project?.tickets.length === 0 ? (
              <tr className="border-b">
                <td className="px-2 py-1">No Tickets Found</td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-2 py-1">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Modal setShow={setShowModal} show={showModal}>
        <div className="flex flex-row justify-between w-full">
          <span className="font-medium text-xl text-slate-900">Add User</span>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row space-x-2">
              {errors.user && (
                <pre className="mr-1 text-red-700">{errors.user.message}</pre>
              )}
              <select
                className="block border border-slate-300 flex-1 outline-none px-2 rounded-none rounded-r-md"
                defaultValue={''}
                {...register('user')}
              >
                <option value="" disabled>
                  Select a user...
                </option>
                {addableUsers?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.email}
                  </option>
                ))}
              </select>
              <button
                className="bg-slate-100 border-2 border-slate-300 px-2 rounded-md"
                type="submit"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export const getServerSideProps = requireLayoutProps(async (ctx) => {
  return { props: {} };
});

export default ProjectPage;
