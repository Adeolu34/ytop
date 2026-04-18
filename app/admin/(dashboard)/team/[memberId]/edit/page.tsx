import { notFound, redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth-utils';
import { checkPermission } from '@/lib/auth-utils';
import TeamMemberForm from '@/components/admin/team/TeamMemberForm';
import { mongoMediaListImagesForPicker } from '@/lib/mongo-media';
import { mongoTeamFindById } from '@/lib/mongo-team-store';

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
    mongoTeamFindById(memberId),
    mongoMediaListImagesForPicker({ limit: 300 }),
  ]);

  if (!member) notFound();

  const imageOptions = imageRows.map((m) => ({ id: m.id, label: m.filename }));

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
