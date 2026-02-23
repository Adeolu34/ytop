import Link from 'next/link';
import { GraduationCap, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Campus Ambassadors - Get Involved | YTOP Global',
  description: 'Represent YTOP Global on your campus. Join our Campus Ambassadors program.',
};

export default function CampusAmbassadorsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <Link href="/get-involved" className="inline-flex items-center text-primary font-medium hover:underline">
          ← Get Involved
        </Link>
      </div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <GraduationCap className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Campus Ambassadors</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Represent YTOP on your campus</p>
        </div>
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Our Campus Ambassadors program empowers students to lead YTOP initiatives at their universities and colleges. As an ambassador, you will organize events, spread awareness, and connect your peers with mentorship and development opportunities.
        </p>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
          We work with campus ambassadors across Nigeria and beyond. If you are passionate about youth empowerment and want to create impact in your community, we would love to hear from you.
        </p>
      </div>
      <div className="mt-12">
        <Link
          href="/contact"
          className="inline-flex items-center px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover shadow-lg shadow-primary/30 transition"
        >
          Apply or Inquire <ArrowRight className="w-5 h-5 ml-2" />
        </Link>
      </div>
    </div>
  );
}
