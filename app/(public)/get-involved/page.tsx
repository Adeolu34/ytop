import Link from 'next/link';
import Image from 'next/image';
import { Handshake, Heart, GraduationCap, Users, ArrowRight } from 'lucide-react';

const SIDEBAR_LINKS = [
  { href: '/get-involved/partner', label: 'Join as a Partner', icon: Handshake },
  { href: '/get-involved/sponsor', label: 'Join as a Sponsor', icon: Heart },
  { href: '/get-involved/campus-ambassadors', label: 'Join Campus Ambassadors', icon: GraduationCap },
  { href: '/get-involved', label: 'Join Our Community', icon: Users, active: true },
];

export const metadata = {
  title: 'Get Involved - YTOP Global',
  description: 'Volunteer, become a mentor, join as a campus ambassador, partner with us or join the YTOP Global community.',
};

// Copy: Master Website Content document, Part Seven. Volunteer, mentor and community routes use the
// contact form until dedicated application forms exist.
const WAYS = [
  { href: '/contact?subject=Volunteer%20application', icon: Users, title: 'Volunteer With Us', body: 'Contribute your time, knowledge and abilities to programme coordination, research, communications, mobilisation, administration, learning activities and community engagement.', cta: 'Apply to Volunteer' },
  { href: '/contact?subject=Mentor%20application', icon: Heart, title: 'Become a Mentor', body: 'Share your experience and support the personal, educational and career development of young people.', cta: 'Become a Mentor' },
  { href: '/get-involved/campus-ambassadors', icon: GraduationCap, title: 'Campus Ambassadors', body: 'Represent youth development in your institution: promote activities, support mobilisation and encourage student participation.', cta: 'Apply to Become a Campus Ambassador' },
  { href: '/contact?subject=Join%20the%20YTOP%20community', icon: Handshake, title: 'Join Our Community', body: 'Connect with young people, professionals and volunteers. Receive learning opportunities, programme announcements and development resources.', cta: 'Join the YTOP Community' },
];

export default function GetInvolvedPage() {
  return (
    <div className="flex flex-col lg:flex-row min-h-[70vh]">
      <aside className="hidden lg:block w-64 flex-shrink-0 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 pt-10 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
        <div className="px-4 mb-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Get Involved</h3>
        </div>
        <nav className="flex flex-col">
          {SIDEBAR_LINKS.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center px-6 py-4 text-sm font-medium border-l-4 transition-all ${
                  item.active
                    ? 'text-primary bg-red-50 dark:bg-red-900/20 border-primary'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-primary border-transparent hover:border-primary'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${item.active ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1">
        <section className="relative bg-surface-light dark:bg-surface-dark">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-primary font-semibold tracking-wide uppercase text-sm mb-2 block">Get Involved</span>
                <h1 className="font-display text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                  Your Skills, Time and Experience Can <span className="text-primary">Make a Difference.</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                  Youth development requires more than financial contributions. It also requires people who are willing to share knowledge, provide mentorship, support programme delivery, and contribute to community initiatives.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                  There are several ways to participate in the work of YTOP Global.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex justify-center items-center px-6 py-3 rounded-lg text-white bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 transition font-medium"
                  >
                    Get in Touch
                  </Link>
                  <Link
                    href="/donate"
                    className="inline-flex justify-center items-center px-6 py-3 rounded-lg border-2 border-secondary text-secondary dark:text-white dark:border-gray-500 hover:bg-secondary hover:text-white transition font-medium"
                  >
                    Donate
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/media/2025/08/AAAA.jpg"
                    alt="YTOP Global community service volunteers"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="ways" className="py-20 bg-background dark:bg-background-dark">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-10 text-center">Ways to Get Involved</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {WAYS.map(({ href, icon: Icon, title, body, cta }) => (
                <Link key={title} href={href} className="p-8 rounded-2xl bg-white dark:bg-surface-dark border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-primary/30 transition-all group">
                  <Icon className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">{body}</p>
                  <span className="inline-flex items-center text-primary font-semibold text-sm">{cta} <ArrowRight className="w-4 h-4 ml-1" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
