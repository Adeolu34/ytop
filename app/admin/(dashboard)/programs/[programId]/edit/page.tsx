import { notFound, redirect } from 'next/navigation';
import { requireAuth } from '@/lib/auth-utils';
import { checkPermission } from '@/lib/auth-utils';
import ProgramForm from '@/components/admin/programs/ProgramForm';
import DeleteProgramButton from '@/components/admin/programs/DeleteProgramButton';
import { mongoMediaListImagesForPicker } from '@/lib/mongo-media';
import { mongoProgramFindById } from '@/lib/mongo-program-store';

export default async function EditProgramPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const { programId } = await params;
  const user = await requireAuth();
  if (!checkPermission(user.role, 'EDITOR')) {
    redirect('/admin');
  }

  const [program, imageRows] = await Promise.all([
    mongoProgramFindById(programId),
    mongoMediaListImagesForPicker({ limit: 300 }),
  ]);

  if (!program) notFound();

  const imageOptions = imageRows.map((m) => ({ id: m.id, label: m.filename }));

  return (
    <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="admin-font-display text-3xl font-bold text-[#1b1c1c]">
          Edit program
        </h1>
        <DeleteProgramButton programId={program.id} />
      </div>
      <ProgramForm
        mode="edit"
        imageOptions={imageOptions}
        initial={{
          id: program.id,
          title: program.title,
          slug: program.slug,
          description: program.description,
          shortDesc: program.shortDesc || '',
          imageId: program.imageId || '',
          sdgGoals: program.sdgGoals.join(', '),
          order: program.order,
          isActive: program.isActive,
        }}
      />
    </div>
  );
}
