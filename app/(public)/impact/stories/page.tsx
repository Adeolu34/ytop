import Link from 'next/link';
import { Quote } from 'lucide-react';
import { loadWithDatabaseFallback } from '@/lib/public-db';
import { mongoTestimonialsList } from '@/lib/mongo-testimonials-store';
import PageHeader from '@/components/public/PageHeader';

/** CDN ISR: stories added in the admin appear within a minute. */
export const revalidate = 60;

export const metadata = {
  title: 'Participant Stories | YTOP Global',
  description:
    'Experiences shared by people who have taken part in YTOP Global programmes, including Rise of Warriors, YTOP Conference and the Capacity Development Challenge.',
};

// Testimonials are reproduced exactly as submitted by the people named and already published on the
// YTOP website. Confirm each person's consent before keeping their name here (master copy 4.4).
const STORIES = [
  {
    name: 'Akinwande Moshood',
    programme: 'YTOP 40-day Capacity Development Challenge',
    text: 'This is one of the program that impacted me positively and connected me to so many programs on social media e.g LinkedIn, Twitter etc... Through this I had gain more knowledge and have connections in my field of specialization (Agriculture). Thank you YTOP Global.',
  },
  {
    name: 'Fasanmi Ololade Motunrayo',
    programme: 'Rise of Warriors · Obafemi Awolowo University',
    text: 'I attended ROW and I must say, it really blessed my life… i got to understand that the environment you find yourself should be an obstacle to that great cause you want to purse. Living a purpose driven life shouldn’t be optional… it is compulsory for every youth that wants to have a success story. YTOP and Friends was Also encouraging..',
  },
  {
    name: 'Mustapha Abubakry Ayinla',
    programme: 'YTOP community · Obafemi Awolowo University',
    text: 'YTOP GLOBAL as a community has tremendously helped me to realize my life purpose through her programs I have contributed to and attended. I have always been wanting to connect with young and like minds people who will gear up my life mission and fortunately, YTOP GLOBAL has sorted that out for me through their programs.',
  },
  {
    name: 'Famogbiyele Timilehin',
    programme: 'YTOP Conference, Rise of Warriors 4.0, YTOP and Friends',
    text: 'The YTOP Global Conference was a particularly noteworthy event, and I was thoroughly impressed by the guest speakers. The conference inspired me to participate in ROW 4.0, where I was fortunate enough to be part of a talented and successful team. These experiences have allowed me to form meaningful connections with like-minded individuals, and the memories remain fresh to this day.',
  },
  {
    name: 'Adeniyi Christianah',
    programme: 'YTOP Conference · Obafemi Awolowo University',
    text: 'Starting something and then stopping it, an attempt to start it again won’t be easy and I’ll like to commend YTOP Global for their tenacity in the aspect of follow up. They are a global organisation that will hold you by hand till you’re able to stand on your own.',
  },
  {
    name: 'Doris Oladotun Owoeye',
    programme: 'Webinar 2020, Rise of Warriors, YTOP and Friends',
    text: 'I’m glad I came across YTOP Global because I won’t lie I learnt a lot, grew, developed myself, challenged myself and also did task I never imagined I could do. Thanks to everyone I worked with in the team, I didn’t only learn hard skills but also soft skills as well.',
  },
];

export default async function StoriesPage() {
  // Stories managed in the admin (Stories) replace the built-in examples once any exist.
  const dbStories = await loadWithDatabaseFallback({
    load: async () =>
      (await mongoTestimonialsList({ featuredOnly: false, limit: 60 })).map((t) => ({
        name: t.name,
        programme: [t.position, t.company].filter(Boolean).join(' · '),
        text: t.content,
      })),
    fallback: [] as { name: string; programme: string; text: string }[],
    onError(error) {
      console.error('Stories page database query failed:', error);
    },
  });
  const stories = dbStories.length > 0 ? dbStories : STORIES;

  return (
    <>
      <PageHeader title="People Behind the Progress">
        <p>Every development intervention involves people with different experiences, needs and aspirations. These are experiences shared by people who have taken part in YTOP programmes, in their own words.</p>
      </PageHeader>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid gap-6 md:grid-cols-2">
        {stories.map((s) => (
          <figure key={s.name} className="relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-dark p-8 shadow-sm">
            <Quote className="w-8 h-8 text-primary/30 mb-3" aria-hidden />
            <blockquote className="text-slate-700 dark:text-slate-200 leading-relaxed">{s.text}</blockquote>
            <figcaption className="mt-6">
              <p className="font-bold text-slate-900 dark:text-white">{s.name}</p>
              {s.programme ? <p className="text-sm text-primary font-semibold">{s.programme}</p> : null}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-12 text-center">
        <Link href="/impact" className="text-primary font-semibold hover:underline">Back to our impact framework</Link>
      </div>
      </div>
    </>
  );
}
