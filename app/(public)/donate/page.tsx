import Image from 'next/image';
import Link from 'next/link';
import DonateWidget from './DonateWidget';

export const metadata = {
  title: 'Donate - YTOP Global',
  description: 'Your contribution fuels the future of youth. Support YTOP Global programs through a secure donation.',
};

export default function DonatePage() {
  return (
    <div>
      {/* Hero */}
      <section className="w-full relative">
        <div className="absolute inset-0 bg-slate-900/50 z-10" aria-hidden />
        <div className="relative w-full h-[400px] md:h-[500px]">
          <Image
            src="/media/2021/11/1-scaled.jpg"
            alt="YTOP programs"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 z-20 flex items-center justify-center px-4">
          <div className="max-w-4xl w-full text-center flex flex-col items-center gap-6">
            <h1 className="font-display text-white text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-lg">
              Empower a Dream Today
            </h1>
            <p className="text-white/90 text-lg sm:text-xl font-medium max-w-2xl leading-relaxed drop-shadow-md">
              Your contribution fuels the future of African youth. Join us in making a lasting impact through education and capacity building.
            </p>
            <a href="#donate-widget" className="mt-4 inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold rounded-full shadow-lg transition-transform hover:scale-105">
              Start Donating
            </a>
          </div>
        </div>
      </section>

      {/* Donation widget - structure only; Stripe/payment later */}
      <section id="donate-widget" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 z-30 relative mb-16">
        <DonateWidget />
      </section>

      {/* Why Donate */}
      <section className="py-20 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-6">Why Donate?</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            Every gift supports mentorship, leadership programs, and community initiatives. We are a registered nonprofit (RC179444) and use your donation to create measurable impact.
          </p>
          <p className="mt-6 text-slate-500 dark:text-slate-500 text-sm">
            Prefer to give via bank transfer or have questions? <Link href="/contact" className="text-primary font-semibold hover:underline">Contact us</Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
