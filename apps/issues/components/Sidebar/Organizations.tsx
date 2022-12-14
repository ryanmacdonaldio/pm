'use client';

import { PlusIcon } from '@heroicons/react/outline';
import type { Organization } from '@prisma/client';
import type { Session } from 'next-auth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

async function update(
  userId: string,
  organizationId: string,
  refresh: () => void
) {
  await fetch(`/api/users/${userId}/settings/organization`, {
    body: JSON.stringify({ organizationId }),
    method: 'PUT',
  });

  refresh();
}

export function SidebarOrganizations({
  organizations,
  session,
}: {
  organizations: Organization[];
  session: Session;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col mb-4 mx-4 space-y-1">
      <span className="text-slate-50">Organization:</span>
      <select
        defaultValue={session.user.settings.organization ?? ''}
        className="text-slate-800 py-1"
        onChange={(e) =>
          update(session.user.id, e.target.value, router.refresh)
        }
      >
        {organizations.map((organization) => (
          <option key={organization.id} value={organization.id}>
            {organization.name}
          </option>
        ))}
      </select>
      <Link href="/organizations/add">
        <button className="bg-slate-100 border-2 border-slate-400 flex items-center justify-center px-3 py-1 rounded-md space-x-2 text-slate-900 text-sm w-full">
          <PlusIcon className="h-3 w-3" />
          <span>Create</span>
        </button>
      </Link>
    </div>
  );
}
