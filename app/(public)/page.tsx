import Link from 'next/link';
import HomeHeroSlideshow from '@/components/public/HomeHeroSlideshow';
import { loadWithDatabaseFallback } from '@/lib/public-db';
import { mongoTestimonialsList } from '@/lib/mongo-testimonials-store';
import { generateSEOMetadata } from '@/components/SEOHead';
import FooterNewsletterForm from '@/components/public/layout/FooterNewsletterForm';
import { getSiteContent } from '@/lib/site-content';
import { ArrowRight, Quote } from 'lucide-react';

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
    keywords:
      'Youth empowerment organisation Nigeria, youth leadership development, youth development NGO, leadership programmes for young people, community development Nigeria',
  });
}

// Copy: Master Website Content document, Part One (1.1 to 1.11), in the document's order.

const CHALLENGES = [
  'Unequal access to practical learning and development opportunities.',
  'Limited exposure to mentorship and professional guidance.',
  'Skills gaps between education and employment requirements.',
  'Inadequate opportunities for youth leadership and participation.',
  'Limited access to professional networks and development resources.',
  "Barriers to young people's involvement in community decision-making.",
];

const APPROACH = [
  { num: '01', title: 'Leadership Development', description: 'We create opportunities for young people to develop leadership competencies, ethical decision-making, responsibility, and the ability to contribute to their communities.' },
  { num: '02', title: 'Capacity Building', description: 'We support the development of practical knowledge and skills through training, workshops, learning sessions, and structured development activities.' },
  { num: '03', title: 'Education and Career Development', description: 'We promote learning, career awareness, professional readiness and access to information that helps young people make informed decisions about their futures.' },
  { num: '04', title: 'Mentorship and Guidance', description: 'We connect young people with experienced individuals who can provide guidance, professional perspectives and support for personal and career development.' },
  { num: '05', title: 'Community Development', description: 'We mobilise young people to participate in initiatives that respond to local needs and strengthen community wellbeing.' },
  { num: '06', title: 'Youth Participation and Advocacy', description: 'We encourage young people to contribute to conversations, decisions and actions that affect their lives and communities.' },
];

const FEATURED_PROGRAMMES = [
  { title: 'Rise of Warriors', desc: 'A leadership and personal development initiative designed to encourage young people to recognise their potential, strengthen their leadership abilities and take responsibility for positive change.', cta: 'Explore Rise of Warriors', href: '/programs/rise-of-warriors' },
  { title: 'Rise of 100 Leaders', desc: 'An initiative focused on developing young leaders through structured learning, mentorship, professional exposure and leadership development opportunities.', cta: 'Explore Rise of 100 Leaders', href: '/programs/rise-of-100-leaders' },
  { title: 'Youth on a Mission', desc: 'A youth development initiative that encourages young people to identify their strengths, pursue purposeful development, and contribute positively to society.', cta: 'Explore Youth on a Mission', href: '/programs/youth-on-a-mission' },
  { title: 'Project 300', desc: 'A school outreach initiative aimed at expanding access to leadership education, career guidance, and personal development opportunities among secondary school students.', cta: 'Explore Project 300', href: '/programs/project-300' },
  { title: 'Food4All', desc: 'A community-focused initiative that contributes to food security and support for vulnerable populations through targeted interventions.', cta: 'Explore Food4All', href: '/programs/food4all' },
  { title: 'YTOP Conference', desc: 'A platform for bringing together young people, development practitioners and institutional stakeholders to exchange knowledge, discuss emerging challenges and explore opportunities for collaboration.', cta: 'Explore Our Conference', href: '/programs/ytop-conference' },
];

// Used until stories are added in the admin (Stories). Excerpts are verbatim from the people named.
const FALLBACK_STORIES = [
  { quote: 'If you are looking for a community to grow in, YTOP has your back.', name: 'Oluwadamilotun Bonita Falola', role: 'Programme participant' },
  { quote: 'They are a global organisation that will hold you by hand till you’re able to stand on your own.', name: 'Adeniyi Christianah', role: 'Obafemi Awolowo University' },
  { quote: 'I learnt a lot, grew, developed myself, challenged myself and also did task I never imagined I could do.', name: 'Doris Oladotun Owoeye', role: 'Participant and team member' },
];

const outlineButton =
  'inline-flex items-center justify-center px-8 py-3 border-2 border-secondary text-secondary dark:border-white dark:text-white font-bold rounded-full hover:bg-secondary hover:text-white transition-colors';
const solidButton =
  'inline-flex items-center justify-center px-8 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-full transition-colors';

export default async function HomePage() {
  const { impactFigures: IMPACT_FIGURES } = await getSiteContent();
  const dbStories = await loadWithDatabaseFallback({
    load: async () =>
      (await mongoTestimonialsList({ featuredOnly: true, limit: 3 })).map((t) => ({
        quote: t.content,
        name: t.name,
        role: [t.position, t.company].filter(Boolean).join(' · ') || 'Participant',
      })),
    fallback: [] as { quote: string; name: string; role: string }[],
    onError(error) {
      console.error('Homepage stories unavailable, using built-in examples:', error);
    },
  });
  const stories = dbStories.length > 0 ? dbStories : FALLBACK_STORIES;

  return (
    <>
      {/* 1.1 Hero */}
      <HomeHeroSlideshow />

      {/* 1.2 Organisational Introduction */}
      <section className="py-20 bg-white dark:bg-background-dark" aria-labelledby="who-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="who-heading" className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-4">Who We Are</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-8" />
          <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>YTOP Global is a youth-focused development organisation committed to strengthening young people&apos;s capacity to contribute meaningfully to society.</p>
            <p>We believe that youth development requires more than occasional training or motivational activities. It requires sustained investment in knowledge, practical skills, leadership, mentorship, opportunities, and supportive institutions.</p>
            <p>Our work focuses on creating platforms where young people can learn, build their skills, engage with experienced professionals, and contribute to community development.</p>
            <p>We work with individuals, institutions, volunteers and development partners to expand opportunities for young people and support locally relevant solutions to development challenges.</p>
          </div>
          <Link href="/about" className={`mt-8 ${solidButton}`}>
            Learn More About YTOP
          </Link>
        </div>
      </section>

      {/* 1.3 Impact at a Glance */}
      {IMPACT_FIGURES.length > 0 ? (
        <section className="py-20 bg-secondary text-white" aria-labelledby="reach-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <h2 id="reach-heading" className="font-display text-3xl md:text-4xl font-bold mb-4">Our Work. Our Reach. Our Results.</h2>
              <p className="text-blue-100 text-lg">
                Our commitment to youth development is reflected in the programmes we implement, the institutions we engage and the communities we serve.
              </p>
            </div>
            <dl className="grid grid-cols-2 lg:grid-cols-3 gap-8 text-center">
              {IMPACT_FIGURES.map((f) => (
                <div key={f.label}>
                  <dd className="font-display text-4xl md:text-6xl font-extrabold text-primary">{f.value}</dd>
                  <dt className="mt-2 font-semibold text-white first-letter:uppercase">{f.label}</dt>
                  {f.period || f.source ? (
                    <p className="mt-1 text-sm text-blue-100">{[f.period, f.source].filter(Boolean).join(' · ')}</p>
                  ) : null}
                </div>
              ))}
            </dl>
            <p className="mt-10 text-center text-blue-100 max-w-3xl mx-auto">
              These figures reflect our documented activities and organisational records. We continue to strengthen our monitoring and evaluation systems to measure not only participation but also the outcomes of our interventions.
            </p>
            <div className="mt-8 text-center">
              <Link href="/impact" className="inline-flex items-center justify-center px-8 py-3 bg-white text-secondary font-bold rounded-full hover:bg-slate-100 transition-colors">
                Explore Our Impact
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* 1.4 The Challenge We Address */}
      <section className="py-20 bg-surface-light dark:bg-surface-dark" aria-labelledby="challenge-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="challenge-heading" className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white text-center mb-4">
            Opportunity Should Not Depend on Where a Young Person Starts.
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            Across many communities, young people face barriers that limit their ability to develop their potential and participate fully in society.
          </p>
          <p className="text-center font-semibold text-gray-800 dark:text-gray-100 mb-6">These challenges include:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHALLENGES.map((c) => (
              <li key={c} className="rounded-xl bg-white dark:bg-gray-800 border-l-4 border-primary p-5 shadow-sm text-gray-700 dark:text-gray-200">{c}</li>
            ))}
          </ul>
          <div className="mt-10 space-y-3 text-center text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            <p>Addressing these challenges requires deliberate investment in people, institutions and community-based development.</p>
            <p>YTOP Global contributes to this effort by creating opportunities for learning, leadership, collaboration and practical engagement.</p>
          </div>
        </div>
      </section>

      {/* 1.5 Our Development Approach */}
      <section className="py-20 bg-background dark:bg-background-dark" aria-labelledby="approach-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 id="approach-heading" className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-4">How We Create Opportunities for Change</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">We approach youth development through six interconnected areas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {APPROACH.map((item) => (
              <div key={item.num} className="p-8 bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow">
                <span className="font-display text-3xl font-extrabold text-primary">{item.num}.</span>
                <h3 className="font-display text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 1.6 Featured Programmes */}
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
                  {p.cta} <ArrowRight className="ml-2 w-4 h-4" aria-hidden />
                </Link>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/programs" className="inline-flex items-center font-semibold underline underline-offset-4 hover:text-primary">
              Discover Our Programmes <ArrowRight className="ml-1 w-5 h-5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* 1.7 Impact Stories */}
      <section className="py-20 bg-blue-50 dark:bg-slate-900/50" aria-labelledby="stories-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 id="stories-heading" className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white">Behind Every Programme Is a Human Story.</h2>
            <p className="text-gray-600 dark:text-gray-300">The value of youth development is best understood through the experiences of the people involved.</p>
            <p className="text-gray-600 dark:text-gray-300">Our impact stories document how participation in learning, mentorship, and community initiatives influences individuals and their communities.</p>
            <p className="text-gray-600 dark:text-gray-300">Through these stories, we highlight the experiences, contributions and progress of young people who have engaged with YTOP programmes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((t) => (
              <figure key={t.name} className="bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 relative">
                <Quote className="w-12 h-12 text-gray-100 dark:text-gray-700 absolute top-4 right-4" aria-hidden />
                <blockquote className="text-gray-600 dark:text-gray-300 mb-6 italic relative z-10">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="flex items-center">
                  <div className="w-12 h-12 rounded-full mr-4 flex-shrink-0 bg-secondary text-white flex items-center justify-center font-bold" aria-hidden>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{t.name}</p>
                    <p className="text-xs text-primary font-semibold uppercase">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/impact/stories" className={solidButton}>
              Read Their Stories
            </Link>
          </div>
        </div>
      </section>

      {/* 1.8 Institutional Partnerships */}
      <section className="py-20 bg-white dark:bg-background-dark" aria-labelledby="partners-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="partners-heading" className="font-display text-3xl md:text-4xl font-bold text-secondary dark:text-white mb-6">Progress Requires Collaboration.</h2>
          <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>Sustainable youth development requires the combined efforts of communities, institutions, businesses, development organisations and individuals.</p>
            <p>YTOP Global welcomes partnerships with organisations that share a commitment to education, leadership development, youth participation and community transformation.</p>
            <p>We work to establish collaborations that combine resources, expertise, networks and implementation capacity to address relevant development priorities.</p>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact?subject=Partnership%20enquiry" className={solidButton}>
              Partner With YTOP
            </Link>
            <Link href="/get-involved/partner" className={outlineButton}>
              Explore Partnership Opportunities
            </Link>
          </div>
        </div>
      </section>

      {/* 1.9 Fundraising Section */}
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
            <Link href="/donate" className={solidButton}>Make a Donation</Link>
            <Link href="/get-involved/sponsor" className={outlineButton}>Sponsor a Programme</Link>
            <Link href="/donate#monthly-giving" className={outlineButton}>Become a Monthly Supporter</Link>
          </div>
        </div>
      </section>

      {/* 1.10 Newsletter Section */}
      <section className="py-16 bg-secondary text-white" aria-labelledby="newsletter-heading">
        <div className="max-w-xl mx-auto px-4 text-center">
          <h2 id="newsletter-heading" className="font-display text-3xl font-bold mb-3">Stay Connected to the Work We Do.</h2>
          <p className="text-blue-100 mb-6">Receive updates on our programmes, community initiatives, development insights, and opportunities to support young people.</p>
          <FooterNewsletterForm />
          <p className="mt-3 text-sm text-blue-100">By subscribing, you agree to receive relevant updates from YTOP Global. You may unsubscribe at any time.</p>
        </div>
      </section>

      {/* 1.11 Final Homepage Call to Action */}
      <section className="py-20 md:py-24 bg-primary" aria-labelledby="final-cta-heading">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 id="final-cta-heading" className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-6">
            The Future of Our Communities Depends on the Opportunities We Create Today.
          </h2>
          <div className="space-y-3 text-white/95 text-lg mb-10 max-w-2xl mx-auto">
            <p>Every young person deserves an opportunity to learn, develop, and contribute.</p>
            <p>Join YTOP Global in supporting initiatives that strengthen young people and create pathways for meaningful community participation.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate" className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-gray-100 shadow-xl transition-all text-lg">
              Support Our Mission
            </Link>
            <Link href="/get-involved/volunteer" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-primary transition-all text-lg">
              Become a Volunteer
            </Link>
            <Link href="/get-involved/partner" className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-primary transition-all text-lg">
              Partner With Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
