import Link from 'next/link';
import EnquiryForm from '@/components/public/EnquiryForm';

type Props = {
  headline: string;
  paragraphs: string[];
  formIntro: string;
  confirmation: string;
  submitLabel: string;
  defaultSubject: string;
  formType: 'CONTACT' | 'VOLUNTEER' | 'PARTNERSHIP';
};

/** Layout for the Get Involved application pages: explanation first, then the form on the same page. */
export default function ApplyPage({
  headline,
  paragraphs,
  formIntro,
  confirmation,
  submitLabel,
  defaultSubject,
  formType,
}: Props) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <Link href="/get-involved" className="inline-flex items-center text-primary font-medium hover:underline mb-8">
        ← Get Involved
      </Link>
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">{headline}</h1>
          <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 self-start">
          <EnquiryForm
            formType={formType}
            intro={formIntro}
            confirmation={confirmation}
            submitLabel={submitLabel}
            defaultSubject={defaultSubject}
          />
        </div>
      </div>
    </div>
  );
}
