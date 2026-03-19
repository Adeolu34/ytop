type AdminFlashBannerProps = {
  type: 'notice' | 'error';
  message: string;
};

export default function AdminFlashBanner({
  type,
  message,
}: AdminFlashBannerProps) {
  const toneClasses =
    type === 'notice'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-[#e7bdb8] bg-[#ffdad6] text-[#93000d]';

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${toneClasses}`}>
      {message}
    </div>
  );
}
