import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Become a Sponsor - Get Involved | YTOP Global',
  description: 'Sponsor YTOP Global programs and events. Your support fuels youth empowerment.',
};

export default function SponsorPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <Link href="/get-involved" className="inline-flex items-center text-primary font-medium hover:underline">
          ← Get Involved
        </Link>
      </div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Become a Sponsor</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Fund programs that change lives</p>
        </div>
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Sponsors are vital to our mission. Your contribution can fund leadership boot camps, mentorship sessions, community outreaches, and capacity-building workshops. We offer visibility and impact reporting so you can see the difference your support makes.
        </p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
          Whether you represent a company, foundation, or give as an individual, we welcome the opportunity to discuss sponsorship tiers and benefits.
        </p>
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        <Link
          href="/donate"
          className="inline-flex items-center px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/30 transition"
        >
          Donate Now <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center px-6 py-3 border-2 border-secondary text-secondary dark:border-gray-500 dark:text-white font-bold rounded-full hover:bg-secondary hover:text-white transition"
        >
          Contact for Sponsorship
        </Link>
      </div>
    </div>
  );
}
