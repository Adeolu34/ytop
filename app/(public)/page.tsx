import Link from 'next/link';
import Image from 'next/image';
import HomeHeroSlideshow from '@/components/public/HomeHeroSlideshow';
import { loadWithDatabaseFallback } from '@/lib/public-db';
import { mongoListPublishedPosts, useMongoForPublicBlog } from '@/lib/mongo-blog';
import { mongoListActiveTeamMembers } from '@/lib/mongo-public';
import { generateSEOMetadata } from '@/components/SEOHead';
import FooterNewsletterForm from '@/components/public/layout/FooterNewsletterForm';
import { ORG_FOUNDED_YEAR, ORG_REGISTRATION_YEAR, ORG_RC_NUMBER, IMPACT_FIGURES, yearsOfOperation, journeyTitle } from '@/lib/org';
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
  Heart,
  Handshake,
} from 'lucide-react';
/** CDN ISR: 60s (see lib/public-page-config.ts). Must be a literal for Next.js. */
export const revalidate = 60;

export function generateMetadata() {
  return generateSEOMetadata({
    title: 'YTOP Global | Youth Empowerment, Leadership and Community Development',
    description:
      'YTOP Global empowers young people through leadership development, education, mentorship, capacity building and community engagement in Nigeria and beyond.',
    url: '/',
    image: '/media/2025/10/DSC0289.jpg',
    type: 'website',
    keywords: 'Youth empowerment organisation Nigeria, youth leadership development, youth development NGO, leadership programmes for young people, community development Nigeria',
  });
}

// Copy: Master Website Content document, sections 1.4–1.6.
const CHALLENGES = [
  'Unequal access to practical learning and development opportunities.',
  'Limited exposure to mentorship and professional guidance.',
  'Skills gaps between education and employment requirements.',
  'Inadequate opportunities for youth leadership and participation.',
  'Limited access to professional networks and development resources.',
  'Barriers to young people’s involvement in community decision-making.',
];

const APPROACH = [
  { icon: Megaphone, title: 'Leadership Development', description: 'We create opportunities for young people to develop leadership competencies, ethical decision-making, responsibility, and the ability to contribute to their communities.', color: 'primary' as const },
  { icon: Lightbulb, title: 'Capacity Building', description: 'We support the development of practical knowledge and skills through training, workshops, learning sessions and structured development activities.', color: 'secondary' as const },
  { icon: GraduationCap, title: 'Education and Career Development', description: 'We promote learning, career awareness, professional readiness and access to information that helps young people make informed decisions about their futures.', color: 'primary' as const },
  { icon: Sparkles, title: 'Mentorship and Guidance', description: 'We connect young people with experienced individuals who can provide guidance, professional perspectives and support for personal and career development.', color: 'secondary' as const },
  { icon: Users, title: 'Community Development', description: 'We mobilise young people to participate in initiatives that respond to local needs and strengthen community wellbeing.', color: 'primary' as const },
  { icon: Globe, title: 'Youth Participation and Advocacy', description: 'We encourage young people to contribute to conversations, decisions and actions that affect their lives and communities.', color: 'secondary' as const },
];

const FEATURED_PROGRAMMES = [
  { title: 'Rise of Warriors', desc: 'A leadership and personal development initiative designed to encourage young people to recognise their potential, strengthen their leadership abilities and take responsibility for positive change.', cta: 'Explore Rise of Warriors', href: '/programs/rise-of-warriors' },
  { title: 'Rise of 100 Leaders', desc: 'An initiative focused on developing young leaders through structured learning, mentorship, professional exposure and leadership development opportunities.', cta: 'Explore Rise of 100 Leaders', href: '/programs/rise-of-100-leaders' },
  { title: 'Youth on a Mission', desc: 'A youth development initiative that encourages young people to identify their strengths, pursue purposeful development and contribute positively to society.', cta: 'Explore Youth on a Mission', href: '/programs/youth-on-a-mission' },
  { title: 'Project 300', desc: 'A school outreach initiative aimed at expanding access to leadership education, career guidance and personal development opportunities among secondary school students.', cta: 'Explore Project 300', href: '/programs/project-300' },
  { title: 'Food4All', desc: 'A community-focused initiative that contributes to food security and support for vulnerable populations through targeted interventions.', cta: 'Explore Food4All', href: '/programs/food4all' },
  { title: 'YTOP Conference', desc: 'A platform for bringing together young people, development practitioners and institutional stakeholders to exchange knowledge, discuss emerging challenges and explore opportunities for collaboration.', cta: 'Explore Our Conference', href: '/programs/ytop-conference' },
];

// Milestones are confirmed facts only. The registration entry appears once ORG_REGISTRATION_YEAR is set in lib/org.ts.
const TIMELINE_ENTRIES: { year: string; text: string }[] = [
  { year: '2015', text: 'YTOP Global was conceived from a recognition that young people needed more opportunities to lead and contribute.' },
  { year: String(ORG_FOUNDED_YEAR), text: 'YTOP Global began its activities in youth engagement, personal development and leadership.' },
  ...(ORG_REGISTRATION_YEAR
    ? [{ year: String(ORG_REGISTRATION_YEAR), text: `Registered with the Corporate Affairs Commission (${ORG_RC_NUMBER}).` }]
    : []),
  { year: String(new Date().getFullYear()), text: `Celebrating ${yearsOfOperation()} years of work with young people and communities.` },
];

const TIMELINE = TIMELINE_ENTRIES.map((entry, i) => ({
  ...entry,
  side: (i % 2 === 0 ? 'right' : 'left') as 'right' | 'left',
  dot: (i % 2 === 0 ? 'secondary' : 'primary') as 'secondary' | 'primary',
}));

const PATHWAYS = [
  { icon: Heart, title: 'I want to support', desc: 'Donate, sponsor a programme or become a monthly supporter.', cta: 'Support our work', href: '/donate' },
  { icon: Users, title: 'I want to participate', desc: 'Join our programmes, volunteer, or become a campus ambassador.', cta: 'Get involved', href: '/get-involved' },
  { icon: Handshake, title: 'I want to collaborate', desc: 'Partner with us through CSR, institutional or programme collaborations.', cta: 'Partner with us', href: '/get-involved/partner' },
];

// Figures copied from app/(public)/events/page.tsx. Update both together; add organisation-wide totals only once verified against records.
const HIGHLIGHTS = [
  { value: '2,000+', label: 'participants in our 2020 ten-day development webinar' },
  { value: '800+', label: 'students at one Talent Discovery school visit, Ibadan (2020)' },
  { value: '300+', label: 'changemakers at Conference 2.0 (2024), from 32 universities' },
  { value: '5', label: 'countries represented at Conference 2.0 (2024)' },
];

// Excerpts are verbatim from testimonials submitted by the people named.
const TESTIMONIALS = [
  { quote: 'If you are looking for a community to grow in, YTOP has your back.', name: 'Oluwadamilotun Bonita Falola', role: 'Programme participant' },
  { quote: 'They are a global organisation that will hold you by hand till you’re able to stand on your own.', name: 'Adeniyi Christianah', role: 'Obafemi Awolowo University' },
  { quote: 'I learnt a lot, grew, developed myself, challenged myself and also did task I never imagined I could do.', name: 'Doris Oladotun Owoeye', role: 'Participant and team member' },
];

function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export default async function HomePage() {
  let isUsingFallbackData = false;

  const [teamMembers, latestPosts] = await loadWithDatabaseFallback({
    load: async () => {
      const teamMembers = (await mongoListActiveTeamMembers())
        .slice(0, 3)
        .map((m) => ({
          id: m.id,
          name: m.name,
          position: m.position,
          bio: m.bio,
          photo: m.photo
            ? { url: m.photo.url, altText: m.photo.altText }
            : null,
        }));

      let latestPosts: Awaited<ReturnType<typeof mongoListPublishedPosts>>['posts'];
      if (useMongoForPublicBlog()) {
        const { posts } = await mongoListPublishedPosts({
          page: 1,
          limit: 3,
        });
        latestPosts = posts;
      } else {
        latestPosts = [];
      }

      return [teamMembers, latestPosts] as const;
    },
    fallback: [[], []],
    onError(error) {
      isUsingFallbackData = true;
      console.error('Homepage database queries failed after retry:', error);
    },
  });

  return (
    <>
      <HomeHeroSlideshow />

      {isUsingFallbackData ? (
        <section className="border-b border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <div className="mx-auto max-w-7xl">
            Live homepage content is temporarily unavailable. Core site content is
            still online while the database reconnects.
          </div>
        </section>
      ) : null}

      {/* Three pathways: support / participate / collaborate */}
      <section className="py-16 bg-white dark:bg-background-dark" aria-labelledby="pathways-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="pathways-heading" className="sr-only">How you can be part of YTOP Global</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PATHWAYS.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="group flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-surface-light dark:bg-surface-dark p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <p.icon className="w-10 h-10 text-primary mb-4" aria-hidden />
                <h3 className="font-display text-2xl font-bold text-secondary dark:text-white mb-2">{p.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1">{p.desc}</p>
                <span className="inline-flex items-center font-semibold text-primary">
                  {p.cta} <ArrowRight className="ml-1 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Organisation-wide impact: shown only when verified figures (with period and source) are set in lib/org.ts */}
      {IMPACT_FIGURES.length > 0 ? (
        <section className="py-16 bg-white dark:bg-background-dark" aria-labelledby="reach-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 id="reach-heading" className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white">Our Work. Our Reach. Our Results.</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                These figures reflect our documented activities and organisational records. We continue to strengthen our monitoring and evaluation systems to measure not only participation, but also the outcomes of our interventions.
              </p>
            </div>
            <dl className="grid grid-cols-2 lg:grid-cols-3 gap-8 text-center">
              {IMPACT_FIGURES.map((f) => (
                <div key={f.label}>
                  <dd className="font-display text-4xl md:text-5xl font-extrabold text-primary">{f.value}</dd>
                  <dt className="mt-2 font-semibold text-gray-800 dark:text-gray-100">{f.label}</dt>
                  <p className="mt-1 text-xs text-gray-500">{f.period} · {f.source}</p>
                </div>
              ))}
            </dl>
            <div className="mt-10 text-center">
              <Link href="/impact" className="inline-flex items-center font-semibold text-primary">
                Explore Our Impact <ArrowRight className="ml-1 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* Programme highlights – every figure below is taken from the Events page */}
      <section className="py-16 bg-secondary text-white" aria-labelledby="highlights-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 id="highlights-heading" className="font-display text-3xl md:text-4xl font-bold">Programme Highlights</h2>
            <p className="mt-2 text-white/80">Results from our programmes, as documented on our events page.</p>
          </div>
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {HIGHLIGHTS.map((h) => (
              <div key={h.label}>
                <dt className="sr-only">{h.label}</dt>
                <dd className="font-display text-4xl md:text-5xl font-extrabold text-primary">{h.value}</dd>
                <p className="mt-2 text-sm text-white/85">{h.label}</p>
              </div>
            ))}
          </dl>
          <div className="mt-10 text-center">
            <Link href="/events#previous-events" className="inline-flex items-center font-semibold text-white underline underline-offset-4 hover:text-primary">
              See the full record <ArrowRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20 bg-white dark:bg-background-dark" aria-labelledby="who-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="who-heading" className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-4">Who We Are</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8" />
          <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>YTOP Global is a youth-focused development organisation committed to strengthening the capacity of young people to contribute meaningfully to society.</p>
            <p>We believe that youth development requires more than occasional training or motivational activities. It requires sustained investment in knowledge, practical skills, leadership, mentorship, opportunities and supportive institutions.</p>
            <p>We work with individuals, institutions, volunteers and development partners to expand opportunities for young people and support locally relevant solutions to development challenges.</p>
          </div>
          <Link href="/about" className="mt-8 inline-flex items-center font-semibold text-primary">
            Learn More About YTOP <ArrowRight className="ml-1 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* The challenge we address */}
      <section className="py-20 bg-surface-light dark:bg-surface-dark" aria-labelledby="challenge-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="challenge-heading" className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white text-center mb-4">
            Opportunity Should Not Depend on Where a Young Person Starts.
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Across many communities, young people face barriers that limit their ability to develop their potential and participate fully in society.
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHALLENGES.map((c) => (
              <li key={c} className="rounded-xl bg-white dark:bg-gray-800 border-l-4 border-primary p-5 shadow-sm text-gray-700 dark:text-gray-200">{c}</li>
            ))}
          </ul>
          <p className="mt-10 text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            YTOP Global contributes to this effort by creating opportunities for learning, leadership, collaboration and practical engagement.
          </p>
        </div>
      </section>

      {/* Our development approach */}
      <section className="py-20 bg-background dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-4">How We Create Opportunities for Change</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">We approach youth development through six interconnected areas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {APPROACH.map((item) => {
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

      {/* Featured programmes */}
      <section className="py-20 bg-secondary dark:bg-slate-900 text-white" aria-labelledby="programmes-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 id="programmes-heading" className="font-display text-3xl md:text-4xl font-bold mb-3">Programmes That Turn Development Priorities into Action</h2>
            <p className="text-blue-100 max-w-2xl mx-auto">Our programmes provide structured opportunities for young people to learn, lead, participate and contribute.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_PROGRAMMES.map((p) => (
              <div key={p.title} className="flex flex-col rounded-xl bg-white/5 hover:bg-white/10 transition-colors p-6">
                <h3 className="font-bold text-xl mb-2">{p.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed mb-6 flex-1">{p.desc}</p>
                <Link href={p.href} className="inline-flex items-center font-semibold text-white border-b-2 border-primary self-start hover:text-primary transition-colors pb-1">
                  {p.cta} <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/programs" className="inline-flex items-center font-semibold underline underline-offset-4 hover:text-primary">
              Discover Our Programmes <ArrowRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Our 8 Years Journey - timeline */}
      <section className="py-24 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white">{journeyTitle()}</h2>
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

      {/* Featured Team */}
      {teamMembers.length > 0 && (
        <section className="py-20 bg-surface-light dark:bg-surface-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-2">
                  Meet Our Team
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  The people leading youth empowerment and mentorship across Nigeria and beyond.
                </p>
              </div>
              <Link
                href="/team"
                className="inline-flex items-center text-primary font-semibold hover:opacity-90"
              >
                View Full Team <ArrowRight className="ml-1 w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center"
                >
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 bg-secondary/10 dark:bg-secondary/30 flex items-center justify-center">
                    {member.photo?.url ? (
                      <Image
                        src={member.photo.url}
                        alt={member.photo.altText || member.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-secondary">
                        {member.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  {member.position && (
                    <p className="text-xs uppercase tracking-wide text-primary font-semibold mt-1">
                      {member.position}
                    </p>
                  )}
                  {member.bio && (
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                      {stripHtml(member.bio)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest from the Blog */}
      {latestPosts.length > 0 && (
        <section className="py-20 bg-white dark:bg-background-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-10">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-2">
                  Latest from the Blog
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Insights on identity, leadership, career growth, and youth development.
                </p>
              </div>
              <Link
                href="/blog"
                className="inline-flex items-center text-primary font-semibold hover:opacity-90"
              >
                View All Posts <ArrowRight className="ml-1 w-5 h-5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col"
                >
                  <div className="relative h-52 bg-gray-200">
                    {post.featuredImage?.url && (
                      <Image
                        src={post.featuredImage.url}
                        alt={post.featuredImage.altText || post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    {post.categories && post.categories.length > 0 && (
                      <p className="text-xs font-semibold text-primary mb-1">
                        {post.categories[0].name}
                      </p>
                    )}
                    <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                        {stripHtml(post.excerpt)}
                      </p>
                    )}
                    <span className="mt-auto inline-flex items-center text-sm font-semibold text-primary group-hover:underline">
                      Read Article <ArrowRight className="ml-1 w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Events */}
      <section className="py-20 bg-background dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-2">Flagship Programmes</h2>
              <p className="text-gray-600 dark:text-gray-400">Recent editions of our signature events. Next dates are announced on the events page.</p>
            </div>
            <Link href="/events" className="inline-flex text-primary font-semibold hover:opacity-90 items-center">
              See All Events <ArrowRight className="ml-1 w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link href="/events" className="group relative overflow-hidden rounded-xl shadow-lg h-96 block">
              <Image
                src="/media/2025/10/DSC0289.jpg"
                alt="YTOP Global conference"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block">Past edition</span>
                <h3 className="text-3xl font-bold text-white mb-2">Youth On A Mission: beCOMING</h3>
                <p className="text-gray-300 mb-4 line-clamp-2">YTOP Conference 2.0, our annual flagship event on self-discovery, talent, career direction and purpose.</p>
                <div className="flex items-center text-white/80 text-sm font-medium flex-wrap gap-x-3 gap-y-1">
                  <span className="flex items-center"><Calendar className="mr-2 w-4 h-4" /> 2024</span>
                  <span className="flex items-center"><MapPin className="mr-2 w-4 h-4" /> Obafemi Awolowo University, Ile-Ife</span>
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
                <span className="bg-white text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase mb-3 inline-block">Past edition</span>
                <h3 className="text-3xl font-bold text-white mb-2">Rise of Warriors</h3>
                <p className="text-blue-100 mb-4 line-clamp-2">A four-week boot camp for ages 16–24 on leadership, communication, critical thinking and project execution.</p>
                <div className="flex items-center text-white/80 text-sm font-medium flex-wrap gap-x-3 gap-y-1">
                  <span className="flex items-center"><Calendar className="mr-2 w-4 h-4" /> Sep 8 – Oct 8, 2023 (5th edition)</span>
                  <span className="flex items-center"><MapPin className="mr-2 w-4 h-4" /> Virtual</span>
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
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-4">Behind Every Programme Is a Human Story.</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Our impact stories document how participation in learning, mentorship and community initiatives influences individuals and their communities.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative">
                <Quote className="w-12 h-12 text-gray-100 dark:text-gray-700 absolute top-4 right-4" aria-hidden />
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic relative z-10">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full mr-4 flex-shrink-0 bg-secondary text-white flex items-center justify-center font-bold" aria-hidden>
                    {t.name.charAt(0)}
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

      <div className="bg-blue-50 dark:bg-slate-900/50 pb-16 text-center">
        <Link href="/impact/stories" className="inline-flex items-center font-semibold text-primary">
          Read Their Stories <ArrowRight className="ml-1 w-5 h-5" />
        </Link>
      </div>

      {/* Institutional partnerships */}
      <section className="py-20 bg-white dark:bg-background-dark" aria-labelledby="partners-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="partners-heading" className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-6">Progress Requires Collaboration.</h2>
          <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>Sustainable youth development requires the combined efforts of communities, institutions, businesses, development organisations and individuals.</p>
            <p>YTOP Global welcomes partnerships with organisations that share a commitment to education, leadership development, youth participation and community transformation.</p>
            <p>We work to establish collaborations that combine resources, expertise, networks and implementation capacity to address relevant development priorities.</p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-involved/partner" className="inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-colors">
              Partner With YTOP
            </Link>
            <Link href="/get-involved/sponsor" className="inline-flex items-center justify-center px-8 py-3 border-2 border-secondary text-secondary dark:border-white dark:text-white font-bold rounded-full hover:bg-secondary hover:text-white transition-colors">
              Explore Partnership Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* Fundraising */}
      <section className="py-20 bg-surface-light dark:bg-surface-dark" aria-labelledby="fundraising-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="fundraising-heading" className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-6">
            Invest in Young People. Support the Work That Creates Opportunities.
          </h2>
          <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>Many young people have the willingness and ability to contribute to society but lack access to the opportunities and resources that support their development.</p>
            <p>Your support helps YTOP expand its programmes, reach underserved communities and provide more young people with access to learning, mentorship and leadership development.</p>
            <p>Whether you are an individual donor, corporate organisation, foundation or member of the diaspora, you can contribute to this work.</p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate" className="inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-colors">
              Make a Donation
            </Link>
            <Link href="/get-involved/sponsor" className="inline-flex items-center justify-center px-8 py-3 border-2 border-secondary text-secondary dark:border-white dark:text-white font-bold rounded-full hover:bg-secondary hover:text-white transition-colors">
              Sponsor a Programme
            </Link>
            <Link href="/donate" className="inline-flex items-center justify-center px-8 py-3 border-2 border-secondary text-secondary dark:border-white dark:text-white font-bold rounded-full hover:bg-secondary hover:text-white transition-colors">
              Become a Monthly Supporter
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-secondary text-white" aria-labelledby="newsletter-heading">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 id="newsletter-heading" className="font-display text-3xl font-bold mb-3">Stay Connected to the Work We Do.</h2>
          <p className="text-blue-100 mb-6">Receive updates on our programmes, community initiatives, development insights, and opportunities to support young people.</p>
          <FooterNewsletterForm />
          <p className="mt-3 text-xs text-blue-200">By subscribing, you agree to receive relevant updates from YTOP Global. You may unsubscribe at any time.</p>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="py-20 md:py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">
            The Future of Our Communities Depends on the Opportunities We Create Today.
          </h2>
          <p className="text-white/95 text-lg mb-10 max-w-2xl mx-auto">
            Every young person deserves an opportunity to learn, develop and contribute. Join YTOP Global in supporting initiatives that strengthen young people and create pathways for meaningful community participation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/donate"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 shadow-xl transition-all duration-300 text-lg"
            >
              Support Our Mission
            </Link>
            <Link
              href="/get-involved"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-primary transition-all duration-300 text-lg"
            >
              Become a Volunteer
            </Link>
            <Link
              href="/get-involved/partner"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-primary transition-all duration-300 text-lg"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
