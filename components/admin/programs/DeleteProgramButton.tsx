'use client';

import { useFormStatus } from 'react-dom';
import { deleteProgramAction } from '@/app/admin/(dashboard)/programs/actions';

function PendingLabel() {
  const { pending } = useFormStatus();
  return pending ? 'Deleting…' : 'Delete program';
}

export default function DeleteProgramButton({ programId }: { programId: string }) {
  return (
    <form action={deleteProgramAction}>
      <input type="hidden" name="programId" value={programId} />
      <button
        type="submit"
        className="rounded-lg border border-[#e7bdb8] bg-white px-4 py-2 text-sm font-semibold text-[#93000d] hover:bg-[#ffdad6]"
      >
        <PendingLabel />
      </button>
    </form>
  );
}
