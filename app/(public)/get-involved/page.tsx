import Link from 'next/link';
import { Users, Heart, GraduationCap, Handshake, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/public/PageHeader';

export const metadata = {
  title: 'Get Involved | YTOP Global',
  description:
    'Volunteer, become a mentor, join as a campus ambassador or join the YTOP Global community.',
};

// Copy: Master Website Content document, Part Seven (7.1 to 7.5).
const OPTIONS = [
  {
    icon: Users,
    headline: 'Be Part of the Work That Creates Opportunities.',
    title: 'Volunteer With Us',
    paragraphs: [
      'We welcome individuals who are interested in contributing their time, knowledge and abilities to youth development and community initiatives.',
      'Volunteers may support programme coordination, research, communications, mobilisation, administration, learning activities and community engagement.',
      'We seek individuals who demonstrate responsibility, respect, willingness to learn and commitment to our organisational values.',
    ],
    cta: 'Apply to Volunteer',
    href: '/get-involved/volunteer',
  },
  {
    icon: Heart,
    headline: "Share Your Experience. Support Someone's Development.",
    title: 'Become a Mentor',
    paragraphs: [
      'Mentorship gives young people opportunities to learn from the experiences, knowledge and professional insights of others.',
      "We welcome professionals and experienced individuals who are willing to support young people's personal, educational and career development.",
      'Our mentorship engagement should follow clear expectations, appropriate safeguarding arrangements and defined participation guidelines.',
    ],
    cta: 'Become a Mentor',
    href: '/get-involved/mentor',
  },
  {
    icon: GraduationCap,
    headline: 'Represent Youth Development in Your Institution.',
    title: 'Campus Ambassadors',
    paragraphs: [
      "YTOP Campus Ambassadors support the organisation's engagement with students and educational institutions.",
      'The role creates opportunities for young people to promote development activities, support mobilisation, share relevant opportunities and encourage student participation.',
    ],
    cta: 'Apply to Become a Campus Ambassador',
    href: '/get-involved/campus-ambassadors',
  },
  {
    icon: Handshake,
    headline: 'Connect. Learn. Participate. Contribute.',
    title: 'Join Our Community',
    paragraphs: [
      'Join a community of young people, professionals, volunteers and individuals interested in leadership development and community impact.',
      'Through our community platforms, we share learning opportunities, programme announcements, development resources and opportunities to participate.',
    ],
    cta: 'Join the YTOP Community',
    href: '/get-involved/community',
  },
];

export default function GetInvolvedPage() {
  return (
    <div>
      <PageHeader title="Your Skills, Time and Experience Can Make a Difference.">
        <p>Youth development requires more than financial contributions.</p>
        <p>It also requires people willing to share knowledge, provide mentorship, support programme delivery, and contribute to community initiatives.</p>
        <p>There are several ways to participate in the work of YTOP Global.</p>
        <nav aria-label="Ways to get involved" className="pt-3 flex flex-wrap justify-center gap-3">
          {OPTIONS.map((o) => (
            <a
              key={o.title}
              href={`#${o.href.split('/').pop()}`}
              className="rounded-full border border-white/50 px-4 py-2 text-sm font-semibold text-white hover:bg-white hover:text-secondary transition-colors"
            >
              {o.title}
            </a>
          ))}
        </nav>
      </PageHeader>

      {OPTIONS.map((o, i) => {
        const Icon = o.icon;
        return (
          <section
            key={o.title}
            id={o.href.split('/').pop()}
            className={`py-16 scroll-mt-24 ${i % 2 === 0 ? 'bg-white dark:bg-background-dark' : 'bg-slate-50 dark:bg-surface-dark'}`}
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="w-8 h-8 text-primary" aria-hidden />
                <p className="text-sm font-bold uppercase tracking-wider text-primary">{o.title}</p>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-5 max-w-3xl">{o.headline}</h2>
              <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                {o.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <Link
                href={o.href}
                className="mt-8 inline-flex items-center px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/30 transition"
              >
                {o.cta} <ArrowRight className="w-5 h-5 ml-2" aria-hidden />
              </Link>
            </div>
          </section>
        );
      })}
    </div>
  );
}
