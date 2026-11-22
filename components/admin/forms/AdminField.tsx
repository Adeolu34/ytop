import type { ReactNode } from 'react';

const inputClass =
  'w-full rounded-xl border border-[#e4beb9] bg-white px-4 py-2.5 text-sm text-[#1b1c1c] focus:border-[#ba0013] focus:outline-none focus:ring-2 focus:ring-[#ba0013]/20';

export function AdminField({
  label,
  name,
  type = 'text',
  defaultValue,
  required,
  placeholder,
  hint,
  min,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  min?: number;
  step?: number | string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#1b1c1c]">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        required={required}
        placeholder={placeholder}
        min={min}
        step={step}
        className={inputClass}
      />
      {hint ? <span className="text-xs font-normal text-[#5d3f3c]">{hint}</span> : null}
    </label>
  );
}

export function AdminTextArea({
  label,
  name,
  defaultValue,
  required,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-semibold text-[#1b1c1c]">
      {label}
      <textarea
        name={name}
        rows={rows}
        defaultValue={defaultValue ?? ''}
        required={required}
        className={inputClass}
      />
    </label>
  );
}

export function AdminCheckbox({
  label,
  name,
  defaultChecked,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-[#1b1c1c]">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="h-4 w-4 rounded border-[#e4beb9] text-[#ba0013]"
      />
      {label}
    </label>
  );
}

export function AdminFormCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#e4beb9]/50 bg-white p-6">
      <h2 className="admin-font-display mb-4 text-xl font-bold text-[#1b1c1c]">{title}</h2>
      {children}
    </section>
  );
}

export function AdminPrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="rounded-full bg-[#ba0013] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#93000d]"
    >
      {children}
    </button>
  );
}

export function AdminDeleteButton({ confirmText }: { confirmText: string }) {
  return (
    <button
      type="submit"
      className="rounded-full border border-[#ba0013]/40 px-3 py-1 text-xs font-semibold text-[#ba0013] hover:bg-[#ffdad6]"
      aria-label={confirmText}
    >
      Delete
    </button>
  );
}
