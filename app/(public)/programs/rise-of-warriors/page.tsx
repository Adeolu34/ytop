import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Shield, Users, Target, Calendar } from 'lucide-react';

export const metadata = {
  title: 'Rise of Warriors (ROW) - Programs | YTOP Global',
  description: 'Rise of Warriors: A high-energy program cultivating resilience, emotional intelligence, and leadership in the next generation of changemakers.',
};

export default function RiseOfWarriorsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative w-full min-h-[500px] md:min-h-[600px] overflow-hidden flex items-center justify-center bg-gray-900">
        <Image
          src="/media/2021/11/006.jpg"
          alt="Rise of Warriors"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white py-20">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider uppercase bg-primary rounded-full">Project Spotlight</span>
            <h1 className="font-display text-5xl md:text-7xl font-black leading-tight tracking-tight mb-6">
              Rise of Warriors <span className="text-primary">(ROW)</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 font-medium max-w-2xl mb-8 leading-relaxed">
              Unleashing the potential within. A high-energy journey to cultivate resilience, emotional intelligence, and leadership in the next generation of changemakers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="h-12 px-8 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-all shadow-lg flex items-center gap-2"
              >
                Join the Movement <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/events"
                className="h-12 px-8 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 font-bold rounded-lg transition-all"
              >
                See Events
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About the program */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-background-dark">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Forging Resilient Leaders</h2>
            <div className="w-16 h-1 bg-primary rounded-full" />
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Rise of Warriors is an intensive boot camp for ages 16–24. Over four weeks, participants build leadership, communication, critical thinking, and time management skills through project execution, networking, and mentorship. Each edition brings together facilitators, clan coaches, and Warriors in a supportive community.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The program has run multiple editions with game nights, final sessions on global opportunities, and lasting connections. Whether virtual or in-person, ROW is designed to unlock potential and create the next wave of changemakers.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <Image src="/media/2021/11/005.jpg" alt="ROW participants" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-20 bg-surface-light dark:bg-surface-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">What You Gain</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">Leadership & Communication</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Build confidence and clarity to lead and collaborate effectively.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">Community & Networking</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Join a global network of Warriors and mentors.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-2">Project Experience</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm">Execute real projects and add impact to your portfolio.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to Rise?</h2>
          <p className="text-white/90 text-lg mb-8">
            Registrations open for each cohort. Contact us to join the next Rise of Warriors or to get updates on dates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-white text-primary font-bold rounded-full hover:bg-gray-100 transition"
            >
              Register / Inquire <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/30 transition"
            >
              <Calendar className="w-5 h-5" /> View Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
