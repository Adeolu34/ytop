import Link from 'next/link';
import { requireAuth } from '@/lib/auth-utils';
import { checkPermission } from '@/lib/auth-utils';
import prisma from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function AdminTeamListPage() {
  const user = await requireAuth();
  if (!checkPermission(user.role, 'EDITOR')) {
    redirect('/admin');
  }

  const members = await prisma.teamMember.findMany({
    orderBy: [{ teamSection: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    include: {
      photo: { select: { url: true } },
    },
  });

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-2 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
            People
          </span>
          <h1 className="admin-font-display text-4xl font-extrabold text-[#1b1c1c]">
            Team members
          </h1>
        </div>
        <Link
          href="/admin/team/new"
          className="rounded-lg bg-[#ba0013] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#93000d]"
        >
          Add member
        </Link>
      </div>

      <div className="admin-surface-card overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#e7d6d4] bg-[#f8f6f6] text-[0.6875rem] font-bold uppercase tracking-wider text-[#5d3f3c]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Tab</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b border-[#efeded] last:border-0">
                <td className="px-4 py-3 font-medium text-[#1b1c1c]">{m.name}</td>
                <td className="px-4 py-3 text-[#5d3f3c]">{m.position}</td>
                <td className="px-4 py-3 text-[#5d3f3c]">{m.teamSection}</td>
                <td className="px-4 py-3">{m.isActive ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/team/${m.id}/edit`}
                    className="font-semibold text-[#ba0013] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {members.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#5d3f3c]">
            No team members yet.{' '}
            <Link href="/admin/team/new" className="font-semibold text-[#ba0013]">
              Add one
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
