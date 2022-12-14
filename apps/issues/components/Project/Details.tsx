'use client';

import { PencilIcon, XIcon } from '@heroicons/react/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectModel } from '@pm/prisma';
import { Project } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const FormSchema = ProjectModel.omit({
  id: true,
  name: true,
  organizationId: true,
});
type FormSchemaType = z.infer<typeof FormSchema>;

async function updateProject(id: string, data: FormSchemaType) {
  await fetch(`/api/projects/${id}`, {
    body: JSON.stringify(data),
    method: 'PATCH',
  });
}

export default function ProjectDetails({
  editable,
  project,
}: {
  editable: boolean;
  project: Project;
}) {
  const dateOptions: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };

  const router = useRouter();
  const [edit, setEdit] = useState(false);

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormSchemaType>({
    defaultValues: {
      ...project,
      startDate: project.startDate ?? undefined,
      endDate: project.endDate ?? undefined,
    },
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    await updateProject(project.id, data);

    await router.refresh();

    setEdit(false);
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg shadow-md">
      <div className="flex flex-row justify-between">
        <span className="font-medium text-xl text-slate-900">
          Project Details
        </span>
        {editable &&
          (edit ? (
            <button
              className="bg-red-100 border-2 border-red-400 flex h-8 items-center px-2 rounded-md space-x-1 text-red-900"
              onClick={() => {
                setEdit(false);
                reset();
              }}
            >
              <XIcon className="h-3 w-3" />
            </button>
          ) : (
            <button
              className="bg-blue-100 border-2 border-blue-400 flex h-8 items-center px-2 rounded-md space-x-1 text-blue-900"
              onClick={() => setEdit(true)}
            >
              <PencilIcon className="h-3 w-3" />
              <span>Edit</span>
            </button>
          ))}
      </div>
      <form className="details-form" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <span>Start Date</span>
          {edit ? (
            <div>
              {errors.startDate && (
                <pre className="mr-1 text-red-700 text-sm">
                  {errors.startDate.message}
                </pre>
              )}
              <input
                type="date"
                className="block border border-slate-300 flex-1 outline-none px-2 py-1 rounded-none rounded-r-md focus:border-slate-400"
                {...register('startDate', {
                  required: false,
                  setValueAs(value) {
                    const date = new Date(value);
                    if (isNaN(date.valueOf())) return undefined;
                    return date;
                  },
                })}
              />
            </div>
          ) : (
            <span>
              {project.startDate?.toLocaleString('en-US', dateOptions) ?? ''}
            </span>
          )}
        </div>
        <div>
          <span>End Date</span>
          {edit ? (
            <div>
              {errors.endDate && (
                <pre className="mr-1 text-red-700 text-sm">
                  {errors.endDate.message}
                </pre>
              )}
              <input
                type="date"
                className="block border border-slate-300 flex-1 outline-none px-2 py-1 rounded-none rounded-r-md focus:border-slate-400"
                {...register('endDate', {
                  required: false,
                  setValueAs(value) {
                    const date = new Date(value);
                    if (isNaN(date.valueOf())) return undefined;
                    return date;
                  },
                })}
              />
            </div>
          ) : (
            <span>
              {project.endDate?.toLocaleString('en-US', dateOptions) ?? ''}
            </span>
          )}
        </div>
        <div>
          <span>Description</span>
          {edit ? (
            <div>
              {errors.description && (
                <pre className="mr-1 text-red-700 text-sm">
                  {errors.description.message}
                </pre>
              )}
              <textarea
                className="block border border-slate-300 flex-1 outline-none px-2 py-1 rounded-none rounded-r-md focus:border-slate-400"
                {...register('description')}
              />
            </div>
          ) : (
            <span>{project.description}</span>
          )}
        </div>
        {edit && (
          <div>
            <span>Archived</span>
            <input type="checkbox" {...register('archived')} />
          </div>
        )}
        {edit && (
          <button
            type="submit"
            className="bg-slate-400 font-medium mt-1 px-2 py-1 rounded-md shadow-sm text-md text-slate-800 hover:bg-slate-500 hover:text-slate-900"
          >
            Update
          </button>
        )}
      </form>
    </div>
  );
}
