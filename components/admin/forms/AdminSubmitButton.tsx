'use client';

import { useFormStatus } from 'react-dom';

type AdminSubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
  className?: string;
};

export default function AdminSubmitButton({
  idleLabel,
  pendingLabel,
  className = '',
}: AdminSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-md bg-gradient-to-br from-[#ba0013] to-[#e31e24] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#ba0013]/20 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70 ${className}`}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}
