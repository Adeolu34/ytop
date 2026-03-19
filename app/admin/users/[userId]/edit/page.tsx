import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth-utils';
import UserEditorForm from '@/components/admin/users/UserEditorForm';

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  await requireAdmin();
  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      image: true,
    },
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section>
        <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
          Access & Roles
        </span>
        <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
          Edit User
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
          Update access, profile metadata, and credential state for this account.
        </p>
      </section>

      <UserEditorForm
        mode="edit"
        initialValues={{
          id: user.id,
          name: user.name || '',
          email: user.email,
          role: user.role,
          bio: user.bio || '',
          image: user.image || '',
        }}
      />
    </div>
  );
}
