import { notFound, redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth-utils';
import { checkPermission } from '@/lib/auth-utils';
import prisma from '@/lib/db';
import TeamMemberForm from '@/components/admin/team/TeamMemberForm';

export default async function EditTeamMemberPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  const user = await requireAuth();
  if (!checkPermission(user.role, 'EDITOR')) {
    redirect('/admin');
  }

  const [member, imageRows] = await Promise.all([
    prisma.teamMember.findUnique({ where: { id: memberId } }),
    prisma.media.findMany({
      where: { type: 'IMAGE' },
      take: 300,
      orderBy: { createdAt: 'desc' },
      select: { id: true, filename: true },
    }),
  ]);

  const imageOptions = imageRows.map((m) => ({ id: m.id, label: m.filename }));

  if (!member) notFound();

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8">
      <h1 className="admin-font-display text-3xl font-bold text-[#1b1c1c]">
        Edit team member
      </h1>
      <TeamMemberForm
        mode="edit"
        imageOptions={imageOptions}
        initial={{
          id: member.id,
          name: member.name,
          slug: member.slug,
          position: member.position,
          teamSection: member.teamSection,
          bio: member.bio || '',
          photoId: member.photoId || '',
          email: member.email || '',
          phone: member.phone || '',
          linkedin: member.linkedin || '',
          twitter: member.twitter || '',
          facebook: member.facebook || '',
          order: member.order,
          isActive: member.isActive,
        }}
      />
    </div>
  );
}
