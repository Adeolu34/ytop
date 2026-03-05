import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, Target, Shield, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Project 300 – Secondary School Outreach | YTOP Global',
  description:
    'Project 300 is a nationwide secondary school outreach program in Nigeria helping students discover identity, build confidence, and grow as young leaders.',
};

export default function Project300Page() {
  return (
    <div>
      {/* Hero */}
      <section className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden flex items-center justify-center bg-gray-900">
        <Image
          src="/media/2021/10/IMG_9658-scaled.jpg"
          alt="YTOP Global school outreach session"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/85 via-black/60 to-transparent" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white py-20">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase bg-primary rounded-full">
              Nationwide School Outreach
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-black leading-tight tracking-tight mb-4">
              Project 300
            </h1>
            <p className="text-lg md:text-xl text-gray-100 font-medium max-w-2xl mb-8 leading-relaxed">
              A nationwide secondary school outreach and youth empowerment program helping students understand who
              they are, discover their potential, and build a strong foundation for academic success and responsible
              living.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="https://forms.gle/s9DnAf5aZsivRm7a6"
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-6 bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-all shadow-lg flex items-center gap-2"
              >
                Apply to Volunteer
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="mailto:info@ytopglobal.org?subject=Project%20300%20School%20Mentorship%20Request"
                className="h-11 px-6 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/40 font-bold rounded-full transition-all flex items-center gap-2"
              >
                Request a School Session
              </Link>
              <Link
                href="mailto:info@ytopglobal.org?subject=Project%20300%20Partnership%20Inquiry"
                className="h-11 px-6 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                Partner With YTOP Global
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Project 300 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-background-dark">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Empowering the Next Generation
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full" />
            <p className="text-slate-700 dark:text-slate-300 text-lg leading-relaxed">
              Project 300 is a nationwide secondary school outreach program in Nigeria led by YTOP Global, a
              youth-focused nonprofit organization committed to youth empowerment, mentorship, and identity
              development.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              From February to November, Project 300 aims to reach{' '}
              <span className="font-semibold text-primary">300 secondary schools</span> across Nigeria, impacting over{' '}
              <span className="font-semibold text-primary">100,000 students</span> through structured mentorship
              sessions, identity development workshops, and youth leadership training.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              Our mission is clear: to help students understand who they are, discover their potential, and build a
              strong foundation for academic success and responsible living.
            </p>
          </div>
          <div className="grid gap-6">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm bg-surface-light dark:bg-surface-dark/60">
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">
                About YTOP Global
              </h3>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                YTOP Global (Young, Talented, Optimistic, and Full of Potential) is a youth development NGO focused on:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                <li>Youth empowerment in Nigeria</li>
                <li>Student mentorship and identity discovery</li>
                <li>Leadership development for teenagers</li>
                <li>Community-based outreach projects</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-gradient-to-br from-secondary/5 to-primary/5 dark:from-secondary/20 dark:to-primary/20">
              <p className="text-sm font-semibold uppercase tracking-wide text-secondary mb-1">
                Impact Goals
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                <div>
                  <p className="text-3xl font-black text-primary">300+</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Secondary Schools Reached</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-primary">100k+</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Students Empowered</p>
                </div>
                <div>
                  <p className="text-3xl font-black text-primary">Nationwide</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Volunteer Network</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why mentorship matters */}
      <section className="py-20 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Secondary School Mentorship Matters
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Many Nigerian students face academic pressure, social comparison, and uncertainty about their future.
              Project 300 addresses these challenges through identity-based youth empowerment training.
            </p>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300 text-sm">
              <li>
                • A significant percentage of teenagers feel unprepared for life and career decisions due to lack of
                guidance and mentorship.
              </li>
              <li>• Early exposure to identity education improves confidence, discipline, and academic focus.</li>
              <li>
                • Structured youth mentorship programs reduce negative peer influence and disengagement from school.
              </li>
            </ul>
          </div>
          <div className="space-y-4 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-background-dark shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              When students understand their identity, they:
            </p>
            <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
              <li>• Make better life decisions</li>
              <li>• Develop resilience and self-confidence</li>
              <li>• Improve academic engagement</li>
              <li>• Build leadership capacity</li>
            </ul>
          </div>
        </div>
      </section>

      {/* What students learn */}
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-4">
            What Students Learn in Project 300
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-center max-w-3xl mx-auto mb-10">
            Our school outreach sessions are age-appropriate and designed for both Junior and Senior Secondary
            students. Each session is interactive, structured, and aligned with educational goals.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Identity Development for Teenagers
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Helping students understand who they are beyond grades, labels, and background so they can build a
                  healthy sense of self.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Discovering Hidden Potential
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Encouraging students to recognize and develop their talents, interests, and strengths so they can
                  make informed choices about their future.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Confidence &amp; Self-Belief
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Strengthening resilience, positive thinking, and a growth mindset so students can handle challenges
                  with courage.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-1">
                  Student Leadership &amp; Responsibility
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Promoting discipline, values, and purposeful decision-making to prepare students for leadership
                  within their schools and communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model */}
      <section className="py-20 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How Project 300 Works
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Project 300 operates through a structured, replicable outreach model that ensures quality learning
              experiences in every school we visit.
            </p>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>• Trained volunteers across Nigeria</li>
              <li>• Identity-based mentorship curriculum</li>
              <li>• Student worksheets and reflection tools</li>
              <li>• Professional documentation and impact reporting</li>
              <li>• Collaboration with school administrators and counselors</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark p-6 shadow-sm space-y-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-secondary">
              Designed for School Schedules
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
              We work respectfully with school leadership to ensure smooth program delivery without disrupting
              academic schedules. Sessions typically run for 45–60 minutes and can be integrated into assemblies,
              special programs, or guidance periods.
            </p>
          </div>
        </div>
      </section>

      {/* Volunteer section */}
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-[1.2fr_minmax(0,1fr)] gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Volunteer With Project 300
            </h2>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              Project 300 is powered by volunteers passionate about youth development and social impact. We welcome
              students, educators, youth leaders, NYSC members, professionals, and anyone seeking meaningful
              volunteer work in Nigeria.
            </p>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
              As a volunteer, you gain youth mentorship experience, leadership development opportunities, and the
              chance to create real community impact.
            </p>
            <Link
              href="https://forms.gle/s9DnAf5aZsivRm7a6"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 h-11 px-6 bg-primary text-white font-bold rounded-full hover:bg-primary-hover transition shadow-lg"
            >
              Apply to Volunteer
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="rounded-2xl border border-dashed border-primary/40 bg-primary/5 dark:bg-primary/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
              Ideal for:
            </p>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-200">
              <li>• Youth leaders and mentors</li>
              <li>• University &amp; polytechnic students</li>
              <li>• NYSC members seeking community impact</li>
              <li>• Educators and guidance counselors</li>
              <li>• Professionals passionate about youth development</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Request & partner sections */}
      <section className="py-20 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-10">
          <div className="rounded-2xl bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Request a School Mentorship Program
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
              Are you a school principal, teacher, or administrator? Partner with us to strengthen student confidence,
              identity, and leadership.
            </p>
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300 mb-4">
              <li>• Free mentorship sessions for secondary schools</li>
              <li>• Identity development workshops</li>
              <li>• Youth empowerment talks</li>
              <li>• Structured 45–60-minute programs</li>
              <li>• Professional and respectful facilitators</li>
            </ul>
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Request a session:
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  href="mailto:info@ytopglobal.org?subject=Project%20300%20School%20Mentorship%20Request"
                  className="inline-flex items-center text-sm text-primary hover:text-primary-hover underline underline-offset-4"
                >
                  info@ytopglobal.org
                </Link>
                <Link
                  href="mailto:ytopglobalintent@gmail.com?subject=Project%20300%20School%20Mentorship%20Request"
                  className="inline-flex items-center text-sm text-primary hover:text-primary-hover underline underline-offset-4"
                >
                  ytopglobalintent@gmail.com
                </Link>
              </div>
            </div>
          </div>
          <div className="rounded-2xl bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Partner With YTOP Global
            </h2>
            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-4">
              Project 300 welcomes corporate sponsors, educational partners, youth organizations, NGOs, and
              foundations to help scale youth empowerment across Nigeria.
            </p>
            <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300 mb-4">
              <li>• Outreach logistics sponsorship</li>
              <li>• Resource provision (materials, tools, printing)</li>
              <li>• Regional partnership and coordination</li>
              <li>• Media, storytelling, and documentation support</li>
            </ul>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              Become a partner:
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="mailto:info@ytopglobal.org?subject=Project%20300%20Partnership%20Inquiry"
                className="inline-flex items-center text-sm text-primary hover:text-primary-hover underline underline-offset-4"
              >
                info@ytopglobal.org
              </Link>
              <Link
                href="mailto:ytopglobalintent@gmail.com?subject=Project%20300%20Partnership%20Inquiry"
                className="inline-flex items-center text-sm text-primary hover:text-primary-hover underline underline-offset-4"
              >
                ytopglobalintent@gmail.com
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Identity statement */}
      <section className="py-16 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Why Project 300 Matters for Nigeria’s Future
          </h2>
          <p className="text-white/90 text-sm md:text-base mb-6 leading-relaxed">
            Identity builds direction. Direction builds discipline. Discipline builds leadership. By investing in
            identity development for teenagers, we are building confident, responsible, and purpose-driven young
            Nigerians.
          </p>
          <p className="text-xs uppercase tracking-wide text-white/80">
            YTOP Global – Young. Talented. Optimistic. Full of Potential.
          </p>
        </div>
      </section>
    </div>
  );
}

