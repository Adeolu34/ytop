import Link from 'next/link';
import PageHeader from '@/components/public/PageHeader';

export const metadata = {
  title: 'Frequently Asked Questions | YTOP Global',
  description:
    'Answers about YTOP Global, our programmes, donations, recurring giving, receipts and partnerships.',
};

// Copy: Master Website Content document, Part Fourteen, word for word.
const FAQ_GROUPS = [
  {
    group: 'About YTOP',
    items: [
      { q: 'What is YTOP Global?', a: 'YTOP Global is a youth development organisation committed to empowering young people through leadership development, education, mentorship, capacity building and community engagement.' },
      { q: 'When was YTOP Global established?', a: "YTOP was conceived in 2015 and began its activities in 2017. It was subsequently registered as an organisation with the Corporate Affairs Commission in Nigeria. Its registration details are available through the organisation's official documentation." },
      { q: 'Where does YTOP Global operate?', a: "YTOP's activities are based in Nigeria, with engagements and collaborations extending across other countries. Specific programme locations are communicated through relevant programme updates." },
    ],
  },
  {
    group: 'Programmes',
    items: [
      { q: 'Who can participate in YTOP programmes?', a: 'Eligibility depends on the objectives and requirements of each programme. Specific participation criteria are published with individual programme announcements.' },
      { q: 'How can I participate?', a: 'Visit the programmes page or follow our official communication channels for available opportunities and registration information.' },
    ],
  },
  {
    group: 'Donations',
    items: [
      { q: 'Can I donate from outside Nigeria?', a: 'We welcome international and diaspora supporters. Available payment methods and currencies are displayed through our approved donation channels.' },
      { q: 'Can I support a specific programme?', a: 'Yes. Where an active campaign offers programme-specific giving, you can select the initiative you wish to support.' },
      { q: 'Can I make monthly donations?', a: 'YTOP intends to provide recurring giving options through supported payment channels. The donation page will indicate available recurring payment arrangements.' },
      { q: 'Will I receive a donation receipt?', a: 'Successful donations should generate an electronic confirmation and receipt using the contact information provided.' },
    ],
  },
  {
    group: 'Partnerships',
    items: [
      { q: 'Can my organisation partner with YTOP?', a: 'Yes. We welcome enquiries from businesses, foundations, universities, NGOs and other organisations interested in youth development and community initiatives.' },
      { q: 'How can my organisation sponsor a programme?', a: 'Contact our partnerships team with information about your organisation and the programme you are interested in supporting.' },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader title="Frequently Asked Questions" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {FAQ_GROUPS.map((g) => (
        <section key={g.group} className="mb-10">
          <h2 className="font-display text-2xl font-bold text-secondary dark:text-white mb-4">{g.group}</h2>
          <div className="space-y-3">
            {g.items.map((item) => (
              <details key={item.q} className="group rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark p-5">
                <summary className="cursor-pointer font-semibold text-slate-900 dark:text-white list-none flex justify-between gap-4">
                  {item.q}
                  <span aria-hidden className="text-primary transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-slate-600 dark:text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
      <p className="text-slate-600 dark:text-slate-400">
        Still have a question? <Link href="/contact" className="text-primary font-semibold hover:underline">Contact us</Link>.
      </p>
      </div>
    </>
  );
}
