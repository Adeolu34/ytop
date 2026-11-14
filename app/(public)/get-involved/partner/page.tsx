import Link from 'next/link';
import { Handshake, ArrowRight } from 'lucide-react';
import { ORG_PROFILE_URL } from '@/lib/org';

export const metadata = {
  title: 'Partner With YTOP Global | Youth Development and CSR Partnerships',
  description:
    'Collaborate with YTOP Global through corporate sponsorship, institutional partnerships, programme funding and youth development initiatives.',
};

// Copy: Master Website Content document, Part Five.
const OPPORTUNITIES = [
  { title: 'Corporate Social Responsibility', body: 'We work with businesses interested in supporting youth development and community-based initiatives through structured social investment.' },
  { title: 'Institutional Collaboration', body: 'We welcome collaboration with universities, educational institutions, NGOs and development organisations.' },
  { title: 'Programme Sponsorship', body: 'Organisations can support specific initiatives through financial contributions, technical assistance or in-kind resources.' },
  { title: 'Research and Knowledge Partnerships', body: 'We welcome opportunities to collaborate on research, knowledge exchange and evidence generation relating to youth and community development.' },
  { title: 'Technical Partnerships', body: 'Organisations and professionals can contribute expertise, training, tools and technical support.' },
  { title: 'Development Funding', body: 'We welcome conversations with foundations and funding institutions interested in supporting programmes aligned with their development priorities.' },
];

const APPROACH = [
  'Understanding community and beneficiary needs.',
  'Developing relevant programme interventions.',
  'Mobilising participants and local stakeholders.',
  'Coordinating implementation activities.',
  'Monitoring programme progress.',
  'Documenting results.',
  'Communicating lessons and outcomes.',
];

export default function PartnerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <Link href="/get-involved" className="inline-flex items-center text-primary font-medium hover:underline">
          ← Get Involved
        </Link>
      </div>
      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Handshake className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Partner With YTOP to Expand Opportunities for Young People.
          </h1>
        </div>
      </div>
      <div className="space-y-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
        <p>Sustainable youth development requires collaboration across institutions, communities, businesses and development organisations. No single organisation can address the full range of challenges affecting young people.</p>
        <p>YTOP Global welcomes partnerships with organisations and individuals who share a commitment to education, leadership development, youth participation and inclusive community development.</p>
        <p>Our approach to partnerships is based on shared objectives, clear responsibilities, mutual accountability and measurable programme outcomes.</p>
      </div>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-16 mb-8">Partnership Opportunities</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {OPPORTUNITIES.map((o) => (
          <div key={o.title} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark p-6 shadow-sm">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">{o.title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{o.body}</p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-16 mb-4">Why Work With YTOP?</h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-3xl mb-6">
        We offer potential partners an opportunity to contribute to locally relevant youth development initiatives. Our partnership approach focuses on:
      </p>
      <ul className="grid gap-3 md:grid-cols-2">
        {APPROACH.map((a) => (
          <li key={a} className="rounded-xl border-l-4 border-primary bg-slate-50 dark:bg-slate-800 p-4 text-slate-700 dark:text-slate-200">{a}</li>
        ))}
      </ul>
      <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-3xl">
        Institutional trust requires clear responsibilities, responsible resource management and transparent reporting. We are committed to strengthening these systems across our work.
      </p>

      <div className="mt-16 rounded-2xl bg-secondary text-white p-8 md:p-12">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Let&apos;s Identify What We Can Achieve Together.</h2>
        <p className="text-blue-100 mb-8 max-w-2xl">
          If your organisation is interested in supporting youth development, education, leadership or community initiatives, we welcome an opportunity to discuss possible areas of collaboration.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/contact?subject=Partnership%20enquiry"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition"
          >
            Submit a Partnership Enquiry <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          <a
            href="mailto:admin@ytopglobal.org"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-secondary transition"
          >
            Contact Our Partnerships Team
          </a>
        </div>
        {ORG_PROFILE_URL ? (
          <p className="mt-6">
            <a href={ORG_PROFILE_URL} className="font-semibold underline underline-offset-4 hover:text-primary" download>
              Download Our Organisational Profile
            </a>
          </p>
        ) : null}
      </div>
    </div>
  );
}
