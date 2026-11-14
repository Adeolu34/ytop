import Image from 'next/image';
import Link from 'next/link';
import {
  Users,
  Flag,
  Eye,
  Rocket,
  GraduationCap,
  Trophy,
  CheckCircle2,
  Heart,
  Handshake,
  Quote,
  Lightbulb,
  Scale,
  Globe,
} from 'lucide-react';
import { generateSEOMetadata } from '@/components/SEOHead';
import { ORG_FOUNDED_YEAR, ORG_REGISTRATION_YEAR, ORG_RC_NUMBER } from '@/lib/org';

export function generateMetadata() {
  return generateSEOMetadata({
    title: 'About YTOP Global | Our Mission, Leadership and Youth Development Work',
    description:
      'Learn about YTOP Global, our mission, history, leadership and commitment to developing young people through education, mentorship and community engagement.',
    url: '/about',
    image: '/media/2021/11/1-scaled.jpg',
    type: 'website',
    keywords: 'about YTOP Global, RC179444, youth NGO Nigeria, youth development organisation, YTOP mission vision',
  });
}

// Copy: Master Website Content document, Part Two. Only facts confirmed by YTOP (conceived 2015,
// activities began 2017) or already documented on the Events page are used.
const JOURNEY_ENTRIES = [
  { year: '2015', title: 'Conceived', desc: 'YTOP Global was conceived from a recognition that young people needed more opportunities to develop their leadership abilities and contribute meaningfully to society.', icon: Lightbulb },
  { year: String(ORG_FOUNDED_YEAR), title: 'Activities begin', desc: 'The organisation began its activities, focusing on youth engagement, personal development, leadership and community participation.', icon: Rocket },
  { year: '2020', title: 'Rise of Warriors launched', desc: 'Rise of Warriors was launched to raise community leaders and change-makers, alongside a ten-day development webinar.', icon: Flag },
  { year: '2022', title: 'YTOP Global Conference', desc: 'The conference brought young people and speakers together at Obafemi Awolowo University, Ile-Ife.', icon: GraduationCap },
  { year: '2024', title: 'Conference 2.0', desc: 'Youth On A Mission: beCOMING drew participants from secondary schools, 32 universities and five countries.', icon: Trophy },
];

// Registration milestone is inserted in chronological order when ORG_REGISTRATION_YEAR is set in lib/org.ts.
const JOURNEY = ORG_REGISTRATION_YEAR
  ? [
      ...JOURNEY_ENTRIES,
      {
        year: String(ORG_REGISTRATION_YEAR),
        title: 'Registered with the CAC',
        desc: `YTOP Global registered with the Corporate Affairs Commission in Nigeria (${ORG_RC_NUMBER}).`,
        icon: CheckCircle2,
      },
    ].sort((a, b) => Number(a.year) - Number(b.year))
  : JOURNEY_ENTRIES;

const VALUES = [
  { title: 'Integrity', desc: 'We promote honesty, transparency, accountability and ethical conduct in our decisions and activities.', icon: CheckCircle2 },
  { title: 'Excellence', desc: 'We strive to maintain high standards in programme design, implementation, learning and organisational management.', icon: Trophy },
  { title: 'Inclusiveness', desc: 'We recognise the importance of equal opportunities, diversity and meaningful participation.', icon: Scale },
  { title: 'Service', desc: 'We encourage individuals to use their knowledge, abilities and resources to contribute to the wellbeing of others.', icon: Heart },
  { title: 'Collaboration', desc: 'We believe that sustainable development requires cooperation, shared responsibility and collective action.', icon: Handshake },
  { title: 'Innovation', desc: 'We encourage practical thinking, learning and solutions that respond to emerging development challenges.', icon: Lightbulb },
];

const APPROACH_STEPS = [
  'Identify relevant development needs among young people and communities.',
  'Design interventions that respond to those needs.',
  'Provide opportunities for learning and practical engagement.',
  'Encourage participation and collaboration.',
  'Monitor programme implementation and results.',
  'Document lessons and improve future interventions.',
];

const SDGS = [
  'SDG 4: Quality Education',
  'SDG 5: Gender Equality',
  'SDG 8: Decent Work and Economic Growth',
  'SDG 10: Reduced Inequalities',
  'SDG 17: Partnerships for the Goals',
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[500px] flex items-center justify-center bg-cover bg-center">
        <Image
          src="/media/2025/09/WhatsApp-Image-2025-09-18-at-14.44.29_da1e90ac.jpg"
          alt="YTOP Global community gathering"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center text-white relative z-10">
          <h1 className="font-display text-4xl md:text-6xl font-black leading-tight tracking-tight mb-6">About YTOP Global</h1>
          <p className="text-xl md:text-2xl font-semibold mb-4">Developing people. Strengthening communities. Expanding opportunities.</p>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto font-medium">
            We believe that investing in young people is essential to building inclusive, resilient and sustainable communities.
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
              Empowering young people through <span className="text-primary">leadership, education and community engagement</span>
            </h2>
            <div className="prose prose-lg text-slate-600 dark:text-slate-300 max-w-none">
              <p>
                YTOP Global is committed to empowering young people through leadership development, education, capacity building, mentorship and community engagement.
              </p>
              <p>
                Our work focuses on helping young people acquire the knowledge, competencies, confidence and opportunities required to participate meaningfully in society.
              </p>
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

      {/* Mission & Vision — check against the formally approved wording before publishing (master copy 2.4). */}
      <section className="py-20 bg-slate-50 dark:bg-background-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group bg-white dark:bg-surface-dark p-10 rounded-2xl border-2 border-transparent hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Flag className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                To empower young people through leadership development, education, mentorship, capacity building and community engagement, enabling them to realise their potential and contribute meaningfully to society.
              </p>
            </div>
            <div className="group bg-white dark:bg-surface-dark p-10 rounded-2xl border-2 border-transparent hover:border-primary transition-all duration-300 shadow-sm hover:shadow-xl">
              <div className="size-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                A generation of empowered, responsible and visionary young people contributing to inclusive and sustainable communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-24 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Our history reflects a continuing commitment to youth development, meaningful participation and community impact.</p>
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
                <div
                  className={`absolute left-0 md:left-1/2 size-10 rounded-full border-4 flex items-center justify-center z-10 shadow-lg transform md:-translate-x-1/2 ${
                    i === 0 || i === JOURNEY.length - 1
                      ? 'bg-primary border-white dark:border-background-dark'
                      : 'bg-white dark:bg-surface-dark border-primary'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${i === 0 || i === JOURNEY.length - 1 ? 'text-white' : 'text-primary'}`} />
                </div>
                <div className="md:w-[calc(50%-2rem)] hidden md:block" />
              </div>
            );
          })}
        </div>
        <p className="mt-12 text-center text-slate-500 max-w-2xl mx-auto">
          Today, YTOP Global remains committed to a simple but important principle: young people should have the knowledge, opportunities and support required to participate in shaping their communities and their future.
        </p>
      </section>

      {/* Approach */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-4">Beyond Inspiration. Towards Sustainable Development.</h2>
          <p className="text-white/90 text-center max-w-2xl mx-auto mb-10">
            Effective youth development requires more than one-off activities. Our approach combines learning, practical engagement, mentorship, leadership development and opportunities for community participation.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {APPROACH_STEPS.map((step) => (
              <li key={step} className="flex gap-3 rounded-xl bg-white/10 p-4">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" aria-hidden />
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <p className="mt-10 text-center text-white/90">
            Young people are not simply recipients of development interventions. They are active participants and contributors to the development of their communities.
          </p>
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

      {/* Sustainable development */}
      <section className="py-20 bg-slate-50 dark:bg-background-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <Globe className="w-10 h-10 text-primary mx-auto mb-4" aria-hidden />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Contributing to Sustainable Development</h2>
          <p className="text-slate-600 dark:text-slate-300 mb-8">
            YTOP Global&apos;s work aligns with the broader objectives of inclusive development and the Sustainable Development Goals. Our activities contribute particularly to:
          </p>
          <ul className="flex flex-wrap justify-center gap-3 mb-8">
            {SDGS.map((g) => (
              <li key={g} className="px-4 py-2 rounded-full bg-secondary/10 text-secondary dark:text-blue-200 text-sm font-semibold">{g}</li>
            ))}
          </ul>
          <p className="text-slate-600 dark:text-slate-300">
            Alignment with the Sustainable Development Goals requires more than using their language. It requires interventions that respond to relevant development needs and produce measurable results. We therefore seek to strengthen the connection between our programme objectives, implementation activities and measurable outcomes.
          </p>
        </div>
      </section>

      {/* Founder Note */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-primary" aria-hidden />
            <Quote className="absolute top-4 right-4 w-16 h-16 text-slate-100 dark:text-slate-800 -z-0" aria-hidden />
            <div className="relative z-10">
              <h3 className="font-display text-2xl font-bold mb-6">A Note from Our Founder</h3>
              <div className="prose prose-lg text-slate-600 dark:text-slate-300 italic mb-8 max-w-none">
                <p>
                  &ldquo;We warmly welcome you to our platform, where we are committed to training, empowering, and raising Leading Leaders who leave a remarkable impact on the world. Our mission is to nurture change-makers, providing comprehensive training and mentorship to unlock their potential.&rdquo;
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
      <section className="py-24 px-4 text-center bg-slate-50 dark:bg-background-dark">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display text-4xl font-black mb-6">Join us in creating opportunities</h2>
          <p className="text-slate-500 text-lg mb-8">Whether as a volunteer, donor or partner, your contribution helps young people participate meaningfully in shaping their future.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/get-involved"
              className="bg-primary hover:bg-primary-hover text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Get Involved
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
