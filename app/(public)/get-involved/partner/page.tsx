import Link from 'next/link';
import { Handshake, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Partner With Us - Get Involved | YTOP Global',
  description: 'Partner with YTOP Global to amplify youth empowerment and community impact.',
};

export default function PartnerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <Link href="/get-involved" className="inline-flex items-center text-primary font-medium hover:underline">
          ← Get Involved
        </Link>
      </div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Handshake className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Partner With Us</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Align your organization with youth empowerment</p>
        </div>
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          We collaborate with NGOs, educational institutions, and corporates to deliver programs that equip young people with skills, mentorship, and opportunities. Partnerships can include joint events, resource sharing, and co-designed initiatives.
        </p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
          If your organization shares our vision of a world where every young person can thrive, we would love to explore a partnership.
        </p>
      </div>
      <div className="mt-12">
        <Link
          href="/contact"
          className="inline-flex items-center px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/30 transition"
        >
          Propose a Partnership <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </div>
  );
}
