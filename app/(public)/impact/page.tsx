import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Briefcase, Handshake, Users, Heart, Leaf, ArrowDown, CheckCircle2 } from 'lucide-react';

const SDG_GOALS = [
  { num: 4, title: 'Quality Education', desc: 'Ensuring inclusive and equitable quality education and promoting lifelong learning opportunities for all.', color: '#C5192D', icon: BookOpen, contributions: ['Project Discovery Walk: Visiting schools to mentor over 5,000 students annually.', 'Scholarship matching for underprivileged youth.'] },
  { num: 8, title: 'Decent Work & Economic Growth', desc: 'Promoting sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.', color: '#A21942', icon: Briefcase, contributions: ['Career Awareness: Connecting young graduates with internships.', 'CV review workshops and employability training sessions.'] },
  { num: 17, title: 'Partnerships for the Goals', desc: 'Strengthening the means of implementation and revitalizing the Global Partnership for Sustainable Development.', color: '#19486A', icon: Handshake, contributions: ['Collaborating with 15+ NGOs and local government bodies.', 'Joint advocacy campaigns for youth policy reform.'] },
  { num: 1, title: 'No Poverty', desc: 'Ending poverty in all its forms everywhere by ensuring equal rights to economic resources.', color: '#E5243B', icon: Users, contributions: ['Community outreach providing basic supplies to rural areas.', 'Financial literacy workshops for low-income families.'] },
  { num: 5, title: 'Gender Equality', desc: 'Achieving gender equality and empowering all women and girls to take leadership roles.', color: '#FF3A21', icon: Heart, contributions: ['She Leads: A specialized program mentoring young women in STEM.'] },
  { num: 13, title: 'Climate Action', desc: 'Taking urgent action to combat climate change and its impacts through education.', color: '#3F7E44', icon: Leaf, contributions: ['Youth-led environmental awareness campaigns.', 'Green skills workshops in schools.'] },
];

export const metadata = {
  title: 'Impact & SDG Alignment - YTOP Global',
  description: 'How YTOP Global aligns with the UN Sustainable Development Goals and creates measurable impact.',
};

export default function ImpactPage() {
  return (
    <div>
      <section className="w-full px-4 py-12 md:py-20 lg:py-24 bg-white dark:bg-background-dark relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" aria-hidden />
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center relative z-10">
          <div className="flex-1 flex flex-col gap-6 text-center md:text-left">
            <span className="inline-flex items-center justify-center md:justify-start gap-2 text-primary font-bold uppercase tracking-wider text-xs">
              The 2030 Agenda
            </span>
            <h1 className="font-display text-slate-900 dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
              Aligning Passion with <span className="text-primary">Purpose</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto md:mx-0">
              We are committed to the United Nations Sustainable Development Goals, ensuring our youth empowerment initiatives drive real-world progress and leave no one behind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
              <a href="#goals" className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold transition-all shadow-lg shadow-primary/20">
                See Our Impact <ArrowDown className="w-5 h-5" />
              </a>
              <Link href="/about" className="inline-flex items-center justify-center gap-2 h-12 px-8 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-medium transition-all">
                Learn about us
              </Link>
            </div>
          </div>
          <div className="flex-1 w-full max-w-md">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-2xl bg-slate-200 dark:bg-slate-800">
              <Image src="/media/2021/10/IMG_9724-scaled.jpg" alt="YTOP impact" fill className="object-cover" sizes="500px" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur rounded-xl border border-slate-100 dark:border-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 dark:text-white">Impact Metric</h3>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-primary">15,000+</span>
                  <span className="text-sm font-medium text-slate-500 mb-1">Youth Impacted</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-primary w-[75%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display text-slate-900 dark:text-white text-3xl font-bold mb-6">Our Commitment to the Goals</h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          The Sustainable Development Goals (SDGs) are a universal call to action to end poverty, protect the planet, and ensure that by 2030 all people enjoy peace and prosperity. YTOP aligns its core mission directly with these global targets.
        </p>
      </section>

      <section id="goals" className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SDG_GOALS.map((goal) => {
            const Icon = goal.icon;
            return (
              <div
                key={goal.num}
                className="group bg-white dark:bg-background-dark border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="size-16 rounded-lg flex items-center justify-center text-white shadow-md" style={{ backgroundColor: goal.color }}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-primary text-xs font-bold uppercase tracking-wider">Goal {goal.num}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary transition-colors">{goal.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 flex-grow">{goal.desc}</p>
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-3">YTOP Contribution</p>
                  <div className="flex flex-col gap-3">
                    {goal.contributions.map((c, i) => (
                      <div key={i} className="flex gap-3 items-start">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-700 dark:text-slate-300">{c}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
