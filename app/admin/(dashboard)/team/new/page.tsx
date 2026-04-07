import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth-utils';
import { checkPermission } from '@/lib/auth-utils';
import prisma from '@/lib/db';
import TeamMemberForm from '@/components/admin/team/TeamMemberForm';

export default async function NewTeamMemberPage() {
  const user = await requireAuth();
  if (!checkPermission(user.role, 'EDITOR')) {
    redirect('/admin');
  }

  const imageOptions = (
    await prisma.media.findMany({
      where: { type: 'IMAGE' },
      take: 300,
      orderBy: { createdAt: 'desc' },
      select: { id: true, filename: true },
    })
  ).map((m) => ({ id: m.id, label: m.filename }));

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8">
      <h1 className="admin-font-display text-3xl font-bold text-[#1b1c1c]">
        New team member
      </h1>
      <TeamMemberForm
        mode="create"
        imageOptions={imageOptions}
        initial={{
          name: '',
          slug: '',
          position: '',
          teamSection: 'core',
          bio: '',
          photoId: '',
          email: '',
          phone: '',
          linkedin: '',
          twitter: '',
          facebook: '',
          order: 0,
          isActive: true,
        }}
      />
    </div>
  );
}
