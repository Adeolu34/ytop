import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Flag,
  Eye,
  Rocket,
  GraduationCap,
  Cpu,
  MapPin,
  Trophy,
  CheckCircle2,
  Heart,
  Handshake,
  Quote,
} from 'lucide-react';

export const metadata = {
  title: 'About Us - YTOP Global',
  description: 'Learn about YTOP Global\'s mission to empower young people through leadership development and community impact.',
};

const JOURNEY = [
  { year: '2016', title: 'Founded in Lagos', desc: 'YTOP Global started as a small community group passionate about youth literacy.', icon: Rocket },
  { year: '2018', title: 'First School Outreach', desc: 'Partnered with 5 local high schools to deliver leadership seminars.', icon: GraduationCap },
  { year: '2019', title: 'Launched Tech Bootcamp', desc: 'Introduced digital skills training, graduating our first cohort of 50 developers.', icon: Cpu },
  { year: '2021', title: 'Expanded to 3 States', desc: 'Established regional chapters to broaden our impact beyond the capital.', icon: MapPin },
  { year: '2023', title: 'Global Partnership Award', desc: 'Recognized internationally for our contribution to youth empowerment.', icon: Trophy },
];

const IMPACT = [
  { value: '5,000+', label: 'Students Reached', icon: GraduationCap },
  { value: '50+', label: 'Projects Executed', icon: Handshake },
  { value: '12', label: 'Communities Served', icon: Users },
  { value: '200+', label: 'Volunteers', icon: Heart },
];

const VALUES = [
  { title: 'Integrity', desc: 'We operate with transparency and hold ourselves accountable to the highest ethical standards in all our actions.', icon: CheckCircle2 },
  { title: 'Honesty', desc: 'We believe in building trust through open communication and truthfulness with our partners, beneficiaries, and team.', icon: Heart },
  { title: 'Collaboration', desc: 'We achieve more together. We actively seek partnerships to maximize impact and create shared value.', icon: Handshake },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[500px] flex items-center justify-center bg-cover bg-center">
        <Image
          src="/media/2021/10/IMG_9724-scaled.jpg"
          alt="YTOP Global community"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white relative z-10">
          <h1 className="font-display text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">
            Empowering young people to <span className="text-primary">learn</span>, <span className="text-primary">innovate</span> and <span className="text-primary">engage</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto font-medium">
            We bridge the critical gap between potential and opportunity for youth worldwide through mentorship, education, and community action.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900 text-primary text-xs font-bold uppercase tracking-wider">
              <Users className="w-4 h-4" /> Who We Are
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
              Transforming Struggles into <span className="text-primary">Sustainable Solutions</span>
            </h2>
            <div className="prose prose-lg text-slate-600 dark:text-slate-300 max-w-none">
              <p>
                Young people today face unprecedented challenges, from staggering unemployment rates to a lack of accessible mentorship. The traditional education system often leaves a gap between academic knowledge and real-world application.
              </p>
              <p>
                YTOP Global was founded to fill this void. We provide sustainable solutions through practical education, skill-building workshops, and active community engagement. We are a youth-led movement committed to transforming potential into tangible impact.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="pl-4 border-l-4 border-primary">
                <span className="block text-3xl font-black text-slate-900 dark:text-white">15+</span>
                <span className="text-sm text-slate-500 font-medium">Partner Schools</span>
              </div>
              <div className="pl-4 border-l-4 border-primary">
                <span className="block text-3xl font-black text-slate-900 dark:text-white">5k+</span>
                <span className="text-sm text-slate-500 font-medium">Lives Impacted</span>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 rounded-2xl rotate-3" aria-hidden />
            <div className="relative rounded-xl shadow-2xl overflow-hidden aspect-[4/3]">
              <Image
                src="/media/2021/11/1-scaled.jpg"
                alt="Young people collaborating"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-slate-50 dark:bg-background-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-white dark:bg-surface-dark p-10 rounded-2xl border-2 border-transparent hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Flag className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                To provide sustainable solutions for youth development through inclusive education, innovative skill-building programs, and community-driven engagement initiatives that bridge the gap between talent and opportunity.
              </p>
            </div>
            <div className="group bg-white dark:bg-surface-dark p-10 rounded-2xl border-2 border-transparent hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                A world where every young person, regardless of their background, has access to the mentorship, resources, and platforms needed to lead, innovate, and contribute meaningfully to society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section className="py-24 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Our 8 Years Journey</h2>
          <p className="text-slate-500 max-w-xl mx-auto">From a small idea in Lagos to a global movement impacting thousands.</p>
        </div>
        <div className="relative">
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-0.5 bg-red-100 dark:bg-red-900/30 -ml-px md:-translate-x-1/2" aria-hidden />
          {JOURNEY.map((item, i) => {
            const Icon = item.icon;
            const isLeft = i % 2 === 1;
            return (
              <div
                key={item.year}
                className={`relative flex flex-col md:flex-row items-stretch justify-between mb-12 last:mb-0 ${isLeft ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`md:w-[calc(50%-2rem)] pl-12 md:pl-0 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pr-12'}`}>
                  <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    <span className="text-primary font-bold text-xl block mb-1">{item.year}</span>
                    <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </div>
                <div className={`absolute left-0 md:left-1/2 size-10 rounded-full border-4 flex items-center justify-center z-10 shadow-lg transform md:-translate-x-1/2 ${
                  i === 0 || i === JOURNEY.length - 1
                    ? 'bg-primary border-white dark:border-background-dark'
                    : 'bg-white dark:bg-surface-dark border-primary'
                }`}>
                  <Icon className={`w-5 h-5 ${i === 0 || i === JOURNEY.length - 1 ? 'text-white' : 'text-primary'}`} />
                </div>
                <div className="md:w-[calc(50%-2rem)] hidden md:block" />
              </div>
            );
          })}
        </div>
      </section>

      {/* Impact Counters */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {IMPACT.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex flex-col items-center p-4">
                  <Icon className="w-10 h-10 mb-4 text-white/80" aria-hidden />
                  <span className="font-display text-4xl md:text-5xl font-black mb-2">{item.value}</span>
                  <span className="text-white/80 font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {VALUES.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="p-8 rounded-2xl bg-white dark:bg-surface-dark shadow-sm hover:shadow-lg transition-shadow border-t-4 border-primary">
                <div className="size-12 rounded-lg bg-red-50 dark:bg-red-900/20 text-primary flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Founder Note */}
      <section className="py-20 bg-slate-50 dark:bg-background-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" aria-hidden />
            <Quote className="absolute top-4 right-4 w-16 h-16 text-slate-100 dark:text-slate-800 -z-0" aria-hidden />
            <div className="relative z-10">
              <h3 className="font-display text-2xl font-bold mb-6">A Note from Our Founder</h3>
              <div className="prose prose-lg text-slate-600 dark:text-slate-300 italic mb-8 max-w-none">
                <p>
                  &ldquo;When we started YTOP Global, the vision was simple: give young people a chance. Today, that vision has grown into a movement. We aren&apos;t just teaching skills; we are igniting hope. Every child we reach represents a future leader, a future innovator, and a future changemaker. Our journey has just begun, and I invite you to be part of this incredible story.&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative size-16 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
                  <Image
                    src="/media/2023/02/DSC_1209.jpga-min-e1677764390481.jpg"
                    alt="Founder"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-lg">EKUNDAYO Oluwadamilare PMP</p>
                  <p className="text-primary text-sm font-medium">Founder &amp; Executive Director</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl font-black mb-6">Ready to make a difference?</h2>
          <p className="text-slate-500 text-lg mb-8">Join the movement today. Whether as a volunteer, donor, or partner, your contribution shapes the future.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/get-involved"
              className="bg-primary hover:bg-primary-hover text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Join the Movement
            </Link>
            <Link
              href="/contact"
              className="bg-white dark:bg-transparent border-2 border-slate-200 dark:border-slate-700 hover:border-primary text-slate-900 dark:text-white font-bold py-4 px-8 rounded-lg transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
