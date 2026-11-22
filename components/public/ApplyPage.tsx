import Link from 'next/link';
import EnquiryForm from '@/components/public/EnquiryForm';
import PageHeader from '@/components/public/PageHeader';

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
    <>
      <PageHeader
        title={headline}
        eyebrow={<Link href="/get-involved" className="hover:underline">← Get Involved</Link>}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
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
    </>
  );
}
