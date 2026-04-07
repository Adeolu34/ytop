import Link from 'next/link';
import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth-utils';
import { checkPermission } from '@/lib/auth-utils';
import prisma from '@/lib/db';

export default async function AdminProgramsListPage() {
  const user = await requireAuth();
  if (!checkPermission(user.role, 'EDITOR')) {
    redirect('/admin');
  }

  const programs = await prisma.program.findMany({
    orderBy: [{ order: 'asc' }, { title: 'asc' }],
    include: { image: { select: { url: true } } },
  });

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-2 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
            Programs
          </span>
          <h1 className="admin-font-display text-4xl font-extrabold text-[#1b1c1c]">
            Programs
          </h1>
        </div>
        <Link
          href="/admin/programs/new"
          className="rounded-lg bg-[#ba0013] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#93000d]"
        >
          Add program
        </Link>
      </div>

      <div className="admin-surface-card overflow-hidden rounded-2xl">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#e7d6d4] bg-[#f8f6f6] text-[0.6875rem] font-bold uppercase tracking-wider text-[#5d3f3c]">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((p) => (
              <tr key={p.id} className="border-b border-[#efeded] last:border-0">
                <td className="px-4 py-3 font-medium text-[#1b1c1c]">{p.title}</td>
                <td className="px-4 py-3 text-[#5d3f3c]">{p.slug}</td>
                <td className="px-4 py-3">{p.isActive ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/programs/${p.id}/edit`}
                    className="font-semibold text-[#ba0013] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {programs.length === 0 ? (
          <p className="p-8 text-center text-sm text-[#5d3f3c]">
            No programs in the database.{' '}
            <Link href="/admin/programs/new" className="font-semibold text-[#ba0013]">
              Create one
            </Link>
          </p>
        ) : null}
      </div>
    </div>
  );
}
