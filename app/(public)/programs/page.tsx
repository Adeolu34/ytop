import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { loadWithDatabaseFallback } from '@/lib/public-db';
import { mongoListActivePrograms } from '@/lib/mongo-public';
import { generateSEOMetadata } from '@/components/SEOHead';
import PageHeader from '@/components/public/PageHeader';

/** CDN ISR — lib/public-page-config.ts */
export const revalidate = 60;

export function generateMetadata() {
  return generateSEOMetadata({
    title: 'Youth Development Programmes | YTOP Global',
    description:
      "Explore YTOP Global's leadership, mentorship, school outreach, education and community development programmes.",
    url: '/programs',
    image: '/media/2021/11/005.jpg',
    type: 'website',
    keywords: 'youth development programmes, Rise of Warriors, Project 300, leadership programmes for young people',
  });
}

// Copy: Master Website Content document, 3.1 and 1.6. These six programmes always show; any extra
// programmes created in the admin (Programs) are listed below them.
const OFFICIAL = [
  { slug: 'rise-of-warriors', title: 'Rise of Warriors', desc: 'A leadership and personal development initiative designed to encourage young people to recognise their potential, strengthen their leadership abilities and take responsibility for positive change.', cta: 'Explore Rise of Warriors', image: '/media/2021/11/006.jpg' },
  { slug: 'rise-of-100-leaders', title: 'Rise of 100 Leaders', desc: 'An initiative focused on developing young leaders through structured learning, mentorship, professional exposure and leadership development opportunities.', cta: 'Explore Rise of 100 Leaders', image: '/media/2021/11/008.jpg' },
  { slug: 'youth-on-a-mission', title: 'Youth on a Mission', desc: 'A youth development initiative that encourages young people to identify their strengths, pursue purposeful development, and contribute positively to society.', cta: 'Explore Youth on a Mission', image: '/media/2025/10/DSC0289.jpg' },
  { slug: 'project-300', title: 'Project 300', desc: 'A school outreach initiative aimed at expanding access to leadership education, career guidance, and personal development opportunities among secondary school students.', cta: 'Explore Project 300', image: '/media/2021/10/IMG_9622-scaled.jpg' },
  { slug: 'food4all', title: 'Food4All', desc: 'A community-focused initiative that contributes to food security and support for vulnerable populations through targeted interventions.', cta: 'Explore Food4All', image: '/media/2025/08/AAAA.jpg' },
  { slug: 'ytop-conference', title: 'YTOP Conference', desc: 'A platform for bringing together young people, development practitioners and institutional stakeholders to exchange knowledge, discuss emerging challenges and explore opportunities for collaboration.', cta: 'Explore Our Conference', image: '/media/2025/04/DSC0326-scaled.jpg' },
];
const OFFICIAL_SLUGS = new Set(OFFICIAL.map((p) => p.slug));

export default async function ProgramsPage() {
  const dbPrograms = await loadWithDatabaseFallback({
    load: async () => mongoListActivePrograms(),
    fallback: [],
    onError(error) {
      console.error('Programs page database query failed after retry:', error);
    },
  });
  const extra = dbPrograms.filter((p) => !OFFICIAL_SLUGS.has(p.slug));

  return (
    <div>
      <PageHeader title="Creating Opportunities Through Action.">
        <p>YTOP Global implements programmes that support leadership development, education, capacity building, mentorship and community participation.</p>
        <p>Our initiatives respond to different needs and provide opportunities for young people to develop their abilities, expand their knowledge and contribute to positive change.</p>
        <p>Explore our programmes and find out how you can participate or support their implementation.</p>
      </PageHeader>

      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {OFFICIAL.map((p) => (
            <article key={p.slug} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark shadow-sm hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <Image src={p.image} alt="" fill className="object-cover" sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white mb-2">{p.title}</h2>
                <p className="flex-1 text-slate-600 dark:text-slate-400 mb-5">{p.desc}</p>
                <Link href={`/programs/${p.slug}`} className="inline-flex items-center font-semibold text-primary hover:underline">
                  {p.cta} <ArrowRight className="ml-2 w-4 h-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {extra.length > 0 ? (
        <section className="pb-20 bg-white dark:bg-background-dark">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-8">More programmes</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {extra.map((program) => (
                <article key={program.id} className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
                  <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">{program.title}</h3>
                  <div className="prose prose-sm dark:prose-invert flex-1 line-clamp-4" dangerouslySetInnerHTML={{ __html: program.description }} />
                  <Link href={`/programs/${program.slug}`} className="mt-4 inline-flex items-center font-semibold text-primary hover:underline">
                    Explore {program.title} <ArrowRight className="ml-2 w-4 h-4" aria-hidden />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="py-20 bg-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">Take part. Or help someone else take part.</h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/get-involved" className="px-8 py-4 bg-white text-secondary rounded-full font-bold hover:shadow-2xl transition-all">
              Get Involved
            </Link>
            <Link href="/donate" className="px-8 py-4 bg-primary text-white rounded-full font-bold border-2 border-primary hover:bg-primary-hover transition-all">
              Support Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
