import Link from 'next/link';
import Image from 'next/image';
import HomeHeroSlideshow from '@/components/public/HomeHeroSlideshow';
import {
  GraduationCap,
  Megaphone,
  Users,
  Sparkles,
  Globe,
  Lightbulb,
  ArrowRight,
  Calendar,
  MapPin,
  Quote,
} from 'lucide-react';

const GOALS = [
  {
    icon: GraduationCap,
    title: 'Quality Education',
    description: 'Providing access to mentorship and learning resources to bridge the knowledge gap.',
    color: 'secondary' as const,
  },
  {
    icon: Megaphone,
    title: 'Leadership Development',
    description: 'Cultivating the next generation of ethical and visionary leaders for society.',
    color: 'primary' as const,
  },
  {
    icon: Users,
    title: 'Community Impact',
    description: 'Driving social change through volunteerism and localized community projects.',
    color: 'secondary' as const,
  },
  {
    icon: Sparkles,
    title: 'Personal Growth',
    description: 'Encouraging self-discovery and confidence building among youths.',
    color: 'primary' as const,
  },
  {
    icon: Globe,
    title: 'Global Networking',
    description: 'Connecting minds across borders to foster collaboration and innovation.',
    color: 'secondary' as const,
  },
  {
    icon: Lightbulb,
    title: 'Innovation Support',
    description: 'Supporting creative solutions to tackle pressing societal challenges.',
    color: 'primary' as const,
  },
];

const WHAT_WE_DO = [
  { num: '01', title: 'Advocacy & Awareness', desc: 'Raising voices on critical issues affecting youth and development.' },
  { num: '02', title: 'Capacity Building', desc: 'Workshops and trainings designed to equip individuals with practical skills.' },
  { num: '03', title: 'Mentorship Programs', desc: 'Direct guidance from industry experts to emerging leaders.' },
];

const TIMELINE = [
  { year: '2016', text: 'YTOP Global was founded with a vision to empower youth.', side: 'right' as const, dot: 'secondary' as const },
  { year: '2018', text: 'Launched first major regional summit reaching 500+ attendees.', side: 'left' as const, dot: 'primary' as const },
  { year: '2021', text: 'Officially registered as an NGO (Rc179444) expanding operations.', side: 'right' as const, dot: 'secondary' as const },
  { year: '2024', text: 'Celebrating 8 years of impact with new global initiatives.', side: 'left' as const, dot: 'primary' as const },
];

const TESTIMONIALS = [
  { quote: 'YTOP Global gave me the platform to express my leadership potential. The mentorship I received was invaluable.', name: 'Sarah Adebayo', role: 'Volunteer', image: '/media/2021/10/IMG_9574-scaled.jpg' },
  { quote: 'The RISE conference changed my perspective on career growth. I highly recommend their programs.', name: 'David Okon', role: 'Partner', image: '/media/2021/10/Akin-ALABI-1-min-1-scaled.jpg' },
  { quote: 'Being part of the ROW initiative allowed me to give back to my community in a structured, impactful way.', name: 'N Ngozi', role: 'Beneficiary', image: '/media/2021/10/Stella-Sikemi-Arowolo-1.webp' },
];

export default function HomePage() {
  return (
    <>
      <HomeHeroSlideshow />

      {/* Goals & Objectives */}
      <section className="py-20 bg-background dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-4">Our Goals & Objectives</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Driven by a clear vision to redefine youth engagement and development.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {GOALS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-8 bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow group"
                >
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${
                    item.color === 'primary' ? 'bg-red-100 dark:bg-red-900/50' : 'bg-blue-100 dark:bg-blue-900/50'
                  }`}>
                    <Icon className={`w-8 h-8 ${item.color === 'primary' ? 'text-primary dark:text-red-300' : 'text-secondary dark:text-blue-300'}`} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Do - navy section */}
      <section className="py-20 bg-secondary dark:bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} aria-hidden />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">What We Do</h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Through strategic interventions and consistent effort, we are building a legacy of impact. Our approach is holistic and focused on sustainable development.
              </p>
              <Link
                href="/programs"
                className="inline-flex items-center text-white font-bold border-b-2 border-primary hover:text-primary transition-colors pb-1"
              >
                View Our Programs <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
            <div className="space-y-6">
              {WHAT_WE_DO.map((item) => (
                <div key={item.num} className="flex group">
                  <div className="mr-6 flex-shrink-0">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary text-primary font-bold text-xl group-hover:bg-primary group-hover:text-white transition-all">
                      {item.num}
                    </span>
                  </div>
                  <div className="bg-white/5 p-6 rounded-lg w-full group-hover:bg-white/10 transition-colors">
                    <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                    <p className="text-blue-100 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our 8 Years Journey - timeline */}
      <section className="py-24 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white">Our 8 Years Journey</h2>
            <p className="mt-2 text-primary font-bold uppercase tracking-wider">A Legacy of Impact</p>
          </div>
          <div className="relative timeline-line max-w-3xl mx-auto">
            {TIMELINE.map((item) => (
              <div
                key={item.year}
                className={`mb-8 flex justify-between items-center w-full ${item.side === 'left' ? 'flex-row-reverse' : ''}`}
              >
                <div className="order-1 w-5/12" />
                <div className={`z-20 flex items-center justify-center order-1 shadow-xl w-8 h-8 rounded-full ${item.dot === 'primary' ? 'bg-primary' : 'bg-secondary'}`} aria-hidden />
                <div className={`order-1 bg-white dark:bg-gray-800 rounded-lg shadow-md w-5/12 px-6 py-4 ${item.side === 'right' ? 'border-l-4 border-secondary' : 'border-r-4 border-primary text-right'}`}>
                  <h3 className="mb-1 font-bold text-gray-800 dark:text-white text-xl">{item.year}</h3>
                  <p className="text-sm leading-snug tracking-wide text-gray-600 dark:text-gray-300">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20 bg-background dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-2">Featured Events</h2>
              <p className="text-gray-600 dark:text-gray-400">Join our upcoming impactful gatherings.</p>
            </div>
            <Link href="/events" className="inline-flex text-primary font-semibold hover:opacity-90 items-center">
              See All Events <ArrowRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/events" className="group relative overflow-hidden rounded-xl shadow-lg h-96 block">
              <Image
                src="/media/2021/10/IMG_9724-scaled.jpg"
                alt="Conference"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block">Upcoming</span>
                <h3 className="text-3xl font-bold text-white mb-2">RISE Conference</h3>
                <p className="text-gray-300 mb-4 line-clamp-2">Our annual flagship leadership summit designed to ignite the spark within young professionals.</p>
                <div className="flex items-center text-white/80 text-sm font-medium flex-wrap gap-x-3 gap-y-1">
                  <span className="flex items-center"><Calendar className="mr-2 w-4 h-4" /> Oct 12, 2024</span>
                  <span className="flex items-center"><MapPin className="mr-2 w-4 h-4" /> Lagos, Nigeria</span>
                </div>
              </div>
            </Link>
            <Link href="/events" className="group relative overflow-hidden rounded-xl shadow-lg h-96 block">
              <Image
                src="/media/2021/11/005.jpg"
                alt="ROW event"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="bg-white text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block">Register Now</span>
                <h3 className="text-3xl font-bold text-white mb-2">ROW 7.0</h3>
                <p className="text-blue-100 mb-4 line-clamp-2">Reaching Out to the World (ROW) - A community service marathon creating tangible change.</p>
                <div className="flex items-center text-white/80 text-sm font-medium flex-wrap gap-x-3 gap-y-1">
                  <span className="flex items-center"><Calendar className="mr-2 w-4 h-4" /> Nov 05, 2024</span>
                  <span className="flex items-center"><MapPin className="mr-2 w-4 h-4" /> Virtual & Physical</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link href="/events" className="inline-flex text-primary font-semibold hover:opacity-90 items-center">
              See All Events <ArrowRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Voices of Impact - testimonials */}
      <section className="py-20 bg-blue-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center text-secondary dark:text-white mb-12">Voices of Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative">
                <Quote className="w-12 h-12 text-gray-100 dark:text-gray-700 absolute top-4 right-4" aria-hidden />
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic relative z-10">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                    <Image src={t.image} alt="" fill className="object-cover" sizes="48px" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{t.name}</h4>
                    <p className="text-xs text-primary font-semibold uppercase">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="py-20 md:py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">
            Fundraising For The People And Causes You Care About!
          </h2>
          <p className="text-white/95 text-lg mb-10 max-w-2xl mx-auto">
            Your donation powers youth programs, mentorship, and community impact.
          </p>
          <Link
            href="/donate"
            className="inline-flex items-center justify-center px-10 py-5 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
          >
            DONATE NOW
          </Link>
        </div>
      </section>
    </>
  );
}
