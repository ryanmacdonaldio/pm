import { redirect } from 'next/navigation';
import ProjectForm from '../../../components/ProjectForm';
import { getSession } from '../../../lib/session';

export default async function Page() {
  const session = await getSession();
  if (!session.user.admin) redirect('/');

  return (
    <div className="bg-slate-200 h-screen pt-4">
      <ProjectForm />
    </div>
  );
}
