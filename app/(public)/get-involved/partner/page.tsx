import Link from 'next/link';
import { getPublicDocuments, profileUrl } from '@/lib/public-documents';

/** CDN ISR: the profile appears within a minute of publishing it in the admin. */
export const revalidate = 60;
import EnquiryForm from '@/components/public/EnquiryForm';
import PageHeader from '@/components/public/PageHeader';

export const metadata = {
  title: 'Partner With YTOP Global | Youth Development and CSR Partnerships',
  description:
    'Collaborate with YTOP Global through corporate sponsorship, institutional partnerships, programme funding and youth development initiatives.',
};

// Copy: Master Website Content document, Part Five and Part Thirteen (Partnership Application).
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

const solidButton =
  'inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition';
const lightButton =
  'inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-secondary transition';

export default async function PartnerPage() {
  const ORG_PROFILE_URL = profileUrl(await getPublicDocuments());
  return (
    <>
      <PageHeader
        title="Partner With YTOP to Expand Opportunities for Young People."
        eyebrow={<Link href="/get-involved" className="hover:underline">← Get Involved</Link>}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* 5.1 */}
      <div className="space-y-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
        <p>Sustainable youth development requires collaboration across institutions, communities, businesses and development organisations.</p>
        <p>No single organisation can address the full range of challenges affecting young people.</p>
        <p>YTOP Global welcomes partnerships with organisations and individuals committed to education, leadership development, youth participation and inclusive community development.</p>
        <p>We seek to build relationships that combine expertise, resources, networks and practical implementation capacity to deliver meaningful results.</p>
        <p>Our partnership approach is based on shared objectives, clear responsibilities, mutual accountability and measurable programme outcomes.</p>
      </div>

      {/* 5.2 */}
      <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-16 mb-8">Partnership Opportunities</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {OPPORTUNITIES.map((o) => (
          <div key={o.title} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark p-6 shadow-sm">
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">{o.title}</h3>
            <p className="text-slate-600 dark:text-slate-400">{o.body}</p>
          </div>
        ))}
      </div>

      {/* 5.3 */}
      <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-16 mb-4">Why Work With YTOP?</h2>
      <p className="text-slate-600 dark:text-slate-400 max-w-3xl mb-2">We offer potential partners an opportunity to contribute to locally relevant youth development initiatives.</p>
      <p className="text-slate-600 dark:text-slate-400 max-w-3xl mb-6">Our partnership approach focuses on:</p>
      <ul className="grid gap-3 md:grid-cols-2">
        {APPROACH.map((a) => (
          <li key={a} className="rounded-xl border-l-4 border-primary bg-slate-50 dark:bg-slate-800 p-4 text-slate-700 dark:text-slate-200">{a}</li>
        ))}
      </ul>
      <p className="mt-6 text-slate-600 dark:text-slate-400 max-w-3xl">
        We recognise that institutional trust requires clear responsibilities, responsible resource management and transparent reporting.
      </p>
      <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-3xl">We are committed to strengthening these systems across our work.</p>

      {/* 5.4 */}
      <div className="mt-16 rounded-2xl bg-secondary text-white p-8 md:p-12" id="partner-cta">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Let&apos;s Identify What We Can Achieve Together.</h2>
        <p className="text-blue-100 mb-8 max-w-2xl">
          If your organisation is interested in supporting youth development, education, leadership or community initiatives, we welcome an opportunity to discuss possible areas of collaboration.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a href="#partnership-enquiry" className={solidButton}>Submit a Partnership Enquiry</a>
          {ORG_PROFILE_URL ? (
            <a href={ORG_PROFILE_URL} download className={lightButton}>Download Our Organisational Profile</a>
          ) : (
            <Link href="/contact?subject=Request%20for%20organisational%20profile" className={lightButton}>Request Our Organisational Profile</Link>
          )}
          <a href="mailto:admin@ytopglobal.org" className={lightButton}>Contact Our Partnerships Team</a>
        </div>
      </div>

      {/* Partnership Application (Part Thirteen) */}
      <div id="partnership-enquiry" className="mt-12 scroll-mt-24 rounded-2xl bg-white shadow-xl p-8 border border-slate-100 max-w-2xl">
        <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Submit a Partnership Enquiry</h2>
        <EnquiryForm
          formType="PARTNERSHIP"
          intro="We welcome enquiries from organisations interested in collaborating with YTOP Global. Please provide information about your organisation and the proposed area of collaboration."
          confirmation="Thank you for your partnership enquiry. Our team will review the information and contact you regarding possible next steps."
          submitLabel="Submit Enquiry"
          defaultSubject="Partnership enquiry"
        />
      </div>
      </div>
    </>
  );
}
