import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export type ProgrammeContent = {
  name: string;
  image?: { src: string; alt: string };
  headline: string;
  intro: string[];
  objectivesHeading?: string;
  objectives: string[];
  extraSections?: { heading: string; note?: string; items?: string[]; body?: string }[];
  callToAction: { heading: string; body: string };
  buttons: { label: string; href: string; primary?: boolean }[];
};

/** Shared layout for programme pages whose copy comes from the Master Website Content document. */
export default function ProgrammeTemplate({ content }: { content: ProgrammeContent }) {
  return (
    <div>
      <section className="bg-secondary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/programs" className="inline-flex items-center text-blue-100 hover:text-white mb-6 text-sm">
            ← All programmes
          </Link>
          <p className="text-primary font-bold uppercase tracking-wider text-sm mb-3">{content.name}</p>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold leading-tight">{content.headline}</h1>
        </div>
      </section>

      {content.image ? (
        <div className="relative h-56 sm:h-72 md:h-96 w-full">
          <Image src={content.image.src} alt={content.image.alt} fill className="object-cover" sizes="100vw" priority />
        </div>
      ) : null}

      <section className="py-16 bg-white dark:bg-background-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {content.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      <section className="py-16 bg-slate-50 dark:bg-surface-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-6">
            {content.objectivesHeading ?? 'Programme objectives'}
          </h2>
          <ul className="grid gap-3 md:grid-cols-2">
            {content.objectives.map((o) => (
              <li key={o} className="flex gap-3 rounded-xl bg-white dark:bg-background-dark p-4 border border-slate-200 dark:border-slate-700">
                <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" aria-hidden />
                <span className="text-slate-700 dark:text-slate-200">{o}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {content.extraSections?.map((s) => (
        <section key={s.heading} className="py-16 bg-white dark:bg-background-dark">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-4">{s.heading}</h2>
            {s.note ? <p className="text-slate-500 mb-4">{s.note}</p> : null}
            {s.body ? <p className="text-lg text-slate-600 dark:text-slate-300">{s.body}</p> : null}
            {s.items ? (
              <ul className="grid gap-3 md:grid-cols-2">
                {s.items.map((i) => (
                  <li key={i} className="rounded-xl border-l-4 border-primary bg-slate-50 dark:bg-slate-800 p-4 text-slate-700 dark:text-slate-200">{i}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ))}

      <section className="py-20 bg-primary text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">{content.callToAction.heading}</h2>
          <p className="text-white/95 text-lg mb-8">{content.callToAction.body}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {content.buttons.map((b) => (
              <Link
                key={b.label}
                href={b.href}
                className={
                  b.primary
                    ? 'inline-flex items-center justify-center px-8 py-3 bg-white text-primary font-bold rounded-full hover:bg-slate-100 transition'
                    : 'inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-primary transition'
                }
              >
                {b.label} <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
