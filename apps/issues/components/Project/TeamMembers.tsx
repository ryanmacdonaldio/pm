'use client';

import { PlusIcon, TrashIcon } from '@heroicons/react/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import Modal from '../Modal';

const FormSchema = z.object({
  user: z.string().min(1, 'Please select a user'),
});
type FormSchemaType = z.infer<typeof FormSchema>;

async function addUser(id: string, data: FormSchemaType) {
  await fetch(`/api/projects/${id}/users`, {
    body: JSON.stringify(data),
    method: 'POST',
  });
}

async function removeUser(project: string, user: string) {
  await fetch(`/api/projects/${project}/users`, {
    body: JSON.stringify({ user }),
    method: 'DELETE',
  });
}

export default function TeamMembers({
  id,
  organizationUsers,
  users,
}: {
  id: string;
  organizationUsers: User[];
  users: User[];
}) {
  const router = useRouter();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [addableUsers, setAddableUsers] = useState<User[]>([]);
  const [addButtonColour, setAddButtonColour] = useState<string>('gray');

  useEffect(() => {
    const userIds = users.map((user) => user.id);

    setAddableUsers(
      organizationUsers.filter((user) => !userIds.includes(user.id))
    );
  }, [organizationUsers, setAddableUsers, users]);

  useEffect(() => {
    setAddButtonColour(
      addableUsers && addableUsers.length > 0 ? 'green' : 'gray'
    );
  }, [addableUsers, setAddButtonColour]);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    await addUser(id, data);

    setShowModal(false);

    reset();

    router.refresh();
  };

  const removeOnClick = async (user: string) => {
    await removeUser(id, user);

    router.refresh();
  };

  return (
    <>
      <div className="bg-slate-50 col-span-1 p-4 rounded-lg shadow-md">
        <div className="flex flex-row justify-between">
          <span className="font-medium text-xl text-slate-900">Team</span>
          <button
            className={`bg-${addButtonColour}-100 border-2 border-${addButtonColour}-400 flex items-center px-2 rounded-md space-x-1 text-${addButtonColour}-900`}
            disabled={addableUsers.length == 0}
            onClick={() => setShowModal(true)}
          >
            <PlusIcon className="h-3 w-3" />
            <span>Add</span>
          </button>
        </div>
        <div className="mt-2">
          {users.length === 0 ? (
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
                {addableUsers.map((user) => (
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
    </>
  );
}
