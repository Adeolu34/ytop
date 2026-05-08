import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import {
  mongoFindActiveProgramBySlug,
  mongoListActiveProgramSlugs,
} from '@/lib/mongo-public';

/** CDN ISR — lib/public-page-config.ts */
export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const slugs = await mongoListActiveProgramSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const program = await mongoFindActiveProgramBySlug(slug);
    if (!program) return {};

    const plainDescription =
      program.shortDesc ||
      program.description.replace(/<[^>]*>/g, '').substring(0, 160);

    return {
      title: `${program.title} - YTOP Global`,
      description: plainDescription,
    };
  } catch {
    return {};
  }
}

export default async function ProgramDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = await mongoFindActiveProgramBySlug(slug);

  if (!program) {
    notFound();
  }

  return (
    <div className="bg-white dark:bg-background-dark">
      <section className="py-16 md:py-20 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Programs
          </Link>

          <h1 className="font-display text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-5">
            {program.title}
          </h1>

          {program.sdgGoals.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-8">
              {program.sdgGoals.map((sdg) => (
                <span
                  key={sdg}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary"
                >
                  SDG {sdg}
                </span>
              ))}
            </div>
          ) : null}

          <article
            className="prose prose-lg dark:prose-invert max-w-none text-slate-700 dark:text-slate-300"
            dangerouslySetInnerHTML={{ __html: program.description }}
          />
        </div>
      </section>
    </div>
  );
}
