import { redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth-utils';
import { checkPermission } from '@/lib/auth-utils';
import TeamMemberForm from '@/components/admin/team/TeamMemberForm';
import { mongoMediaListImagesForPicker } from '@/lib/mongo-media';

export default async function NewTeamMemberPage() {
  const user = await requireAuth();
  if (!checkPermission(user.role, 'EDITOR')) {
    redirect('/admin');
  }

  const imageRows = await mongoMediaListImagesForPicker({ limit: 300 });
  const imageOptions = imageRows.map((m) => ({ id: m.id, label: m.filename }));

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
