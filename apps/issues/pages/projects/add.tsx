import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectModel } from '@pm/prisma';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { z } from 'zod';

import FormInput from '../../components/FormInput';
import requireLayoutProps from '../../utils/requireLayoutProps';
import { trpc } from '../../utils/trpc';

const FormSchema = ProjectModel.omit({ id: true, organizationId: true });
type FormSchemaType = z.infer<typeof FormSchema>;

function Add() {
  const router = useRouter();
  const { mutateAsync } = trpc.project.add.useMutation();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
  });

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    const projectID = await mutateAsync(data);

    reset();

    router.push(`/projects/${projectID}`);
  };

  return (
    <div className="bg-slate-200 h-screen pt-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-slate-50 mx-auto rounded-md shadow-md w-2/3">
          <div className="col-span-3 border-b font-medium p-4 text-slate-700 text-xl w-full">
            New Project
          </div>
          <div className="gap-6 grid grid-cols-3 my-4 px-6">
            <FormInput
              className="col-span-2 w-full"
              error={errors.name}
              label="Name"
              register={register('name')}
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
              error={errors.startDate}
              label="Start Date"
              register={register('startDate', {
                required: false,
                setValueAs(value) {
                  const date = new Date(value);
                  if (isNaN(date.valueOf())) return undefined;
                  return date;
                },
              })}
              type="date"
            />
            <FormInput
              className="col-span-3 w-full"
              error={errors.endDate}
              label="End Date"
              register={register('endDate', {
                required: false,
                setValueAs(value) {
                  const date = new Date(value);
                  if (isNaN(date.valueOf())) return undefined;
                  return date;
                },
              })}
              type="date"
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
