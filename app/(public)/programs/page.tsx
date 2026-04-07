import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getPrisma } from '@/lib/db';
import { loadWithDatabaseFallback } from '@/lib/public-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Our Programs - YTOP Global',
  description: 'Discover YTOP Global\'s six core programs empowering youth through leadership, career guidance, and community impact.',
};

export default async function ProgramsPage() {
  let isUsingFallbackPrograms = false;

  const programs = await loadWithDatabaseFallback({
    load: async () =>
      getPrisma().program.findMany({
        where: {
          isActive: true,
        },
        include: {
          image: {
            select: {
              url: true,
              altText: true,
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      }),
    fallback: [],
    onError(error) {
      isUsingFallbackPrograms = true;
      console.error('Programs page database query failed after retry:', error);
    },
  });

  return (
    <div>
      {isUsingFallbackPrograms ? (
        <section className="border-b border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-900">
          <div className="mx-auto max-w-6xl">
            Program records are temporarily unavailable. Static program highlights
            are still available while the database reconnects.
          </div>
        </section>
      ) : null}

      {/* Hero - stitch style */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-secondary text-white py-20">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} aria-hidden />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-6xl font-extrabold mb-6">Our Programs</h1>
            <p className="text-xl text-white/95">
              Six pillars of youth empowerment and development
            </p>
          </div>
        </div>
      </section>

      {/* Project 300 highlight */}
      <section className="py-12 bg-surface-light dark:bg-surface-dark border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-[1.4fr_minmax(0,1fr)] gap-8 items-center rounded-2xl bg-white dark:bg-background-dark shadow-sm border border-slate-200 dark:border-slate-800 p-6 md:p-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">
                New Nationwide Initiative
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                Project 300 – Secondary School Outreach
              </h2>
              <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 mb-4 max-w-xl">
                A nationwide secondary school mentorship and identity development program reaching 300 schools and
                over 100,000 students across Nigeria.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/programs/project-300"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition shadow-md"
                >
                  Learn More About Project 300
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="https://forms.gle/s9DnAf5aZsivRm7a6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-300 dark:border-slate-600 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-primary hover:text-primary transition"
                >
                  Apply to Volunteer
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="relative h-40 sm:h-48 rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/media/2021/10/IMG_9622-scaled.jpg"
                  alt="Students during a Project 300 outreach session"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 240px, 50vw"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-secondary/5 dark:bg-secondary/20 p-4">
                  <p className="text-2xl font-black text-secondary mb-1">300+</p>
                  <p className="text-xs text-slate-700 dark:text-slate-200">Secondary schools nationwide</p>
                </div>
                <div className="rounded-xl bg-primary/5 dark:bg-primary/20 p-4">
                  <p className="text-2xl font-black text-primary mb-1">100k+</p>
                  <p className="text-xs text-slate-700 dark:text-slate-200">Students empowered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {programs.length > 0 ? (
            <div className="space-y-16">
              {programs.map((program, index) => (
                <div
                  key={program.id}
                  className={`flex flex-col ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } gap-12 items-center max-w-6xl mx-auto`}
                >
                  {/* Image */}
                  {program.image ? (
                    <div className="w-full lg:w-1/2">
                      <div className="group relative h-96 bg-slate-200 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer">
                        <Image
                          src={program.image.url}
                          alt={program.image.altText || program.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full lg:w-1/2">
                      <div className="group h-96 bg-gradient-to-br from-secondary to-secondary rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer transform hover:scale-[1.02]">
                        <span className="text-6xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                          {program.title.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="w-full lg:w-1/2">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 hover:text-primary transition-colors duration-200">
                      {program.title}
                    </h2>
                    <div
                      className="prose prose-lg dark:prose-invert max-w-none mb-6 text-slate-700 dark:text-slate-300"
                      dangerouslySetInnerHTML={{ __html: program.description }}
                    />
                    {program.sdgGoals && program.sdgGoals.length > 0 && (
                      <div className="mb-6">
                        <p className="text-sm font-semibold text-slate-700 mb-3">
                          UN SDG Alignment:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {program.sdgGoals.map((sdg, idx) => (
                            <span
                              key={sdg}
                              className="px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold hover:bg-secondary hover:text-white transition-all duration-300 cursor-pointer"
                              style={{
                                transitionDelay: `${idx * 50}ms`
                              }}
                            >
                              SDG {sdg}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Program information coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA - stitch style */}
      <section className="py-20 md:py-24 bg-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Involved?
          </h2>
          <p className="text-xl mb-10 text-white/95 max-w-2xl mx-auto">
            Join us in making a difference in the lives of young people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get-involved"
              className="group px-8 py-4 bg-white text-secondary rounded-full hover:shadow-2xl transition-all font-bold inline-flex items-center justify-center gap-2"
            >
              Get Involved
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <Link
              href="/donate"
              className="group px-8 py-4 bg-primary text-white rounded-full hover:bg-primary-hover border-2 border-primary transition-all font-bold inline-flex items-center justify-center gap-2"
            >
              Support Our Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
