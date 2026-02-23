import Image from 'next/image';
import Link from 'next/link';
import { Users, Award } from 'lucide-react';

/**
 * Team page content aligned with https://ytopglobal.org/team/
 * Structure: Meet our team members (core) + Faculty & mentors + Team in action + Join CTA
 */

const CORE_TEAM: Array<{ name: string; position: string; photo?: string }> = [
  { name: 'Ekundayo Oluwadamilare', position: 'Executive Director', photo: '/media/2023/02/DSC_1209.jpga-min-e1677764390481.jpg' },
  { name: 'Oluwadamilola Ayo-Ajakaiye', position: 'Director of Strategy' },
  { name: 'Alagbe John Adeolu', position: 'Director of Technical Operations' },
  { name: 'Cornelius Ilori', position: 'Program Director' },
  { name: 'Caroline Olasupo', position: 'Administration Officer' },
  { name: 'Olamide Alagbe', position: 'Alumni Relations Officer' },
  { name: 'Ayomide Adeoti', position: 'Community Manager', photo: '/media/2021/10/Ayomide-Adekola-min-scaled.jpg' },
  { name: 'Tolulope Keshinro', position: 'Media Head' },
  { name: 'Peace Popoola', position: 'Volunteering Hub Team Lead' },
];

const FACULTY_MENTORS: Array<{ name: string; role?: string; photo?: string }> = [
  { name: 'Rtn Pradeep Pahalwani' },
  { name: 'Prof. Bukola Oyebanji' },
  { name: 'Prof. Jacob Duinstra' },
  { name: 'Olugbemiga Ojubanire', role: 'Farm Help' },
  { name: 'Ifeoluwa Oyeyemi', role: 'Rise of Warriors' },
  { name: 'Oghenekefe Ettoh' },
  { name: 'Akin Alabi', role: 'Mentor', photo: '/media/2021/10/Akin-ALABI-1-min-1-scaled.jpg' },
  { name: 'Dr. Adenike Adeyemi' },
  { name: 'Samuel Agunbiade' },
  { name: 'Segun Fagorusi' },
  { name: 'Dr. Olufunmilayo Adetola' },
  { name: 'Dr. Temitope Ojo' },
  { name: 'Abayomi Adewumi', role: 'Operations and Strategy' },
  { name: 'Racheal Omoruyi' },
  { name: 'Modupeoluwa Akande' },
  { name: 'Fashoranti Damilola', role: 'Rise of Warriors' },
  { name: 'Ruhama Ifere' },
  { name: 'Joseph Adeosun' },
];

const TEAM_IN_ACTION_IMAGES = [
  { src: '/media/2021/10/IMG_9586-scaled.jpg', alt: 'YTOP team in action' },
  { src: '/media/2021/10/IMG_9622-scaled.jpg', alt: 'YTOP community event' },
  { src: '/media/2021/10/IMG_9658-scaled.jpg', alt: 'YTOP program' },
  { src: '/media/2021/11/20210605_080734-scaled.jpg', alt: 'YTOP team' },
  { src: '/media/2021/11/20210605_082337-scaled.jpg', alt: 'YTOP event' },
  { src: '/media/2021/11/2-scaled.jpg', alt: 'YTOP community' },
];

export const metadata = {
  title: 'Our Team – YTOP Global',
  description: 'Meet the dedicated team and faculty behind YTOP Global. We are a happy team and we believe we can create a community of great minds.',
};

export default function TeamPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/2021/10/IMG_1777cfd-scaled.jpg"
            alt="YTOP team"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/75 to-ytop-red/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 py-20 text-center">
          <div className="max-w-3xl mx-auto rounded-2xl bg-black/50 backdrop-blur-sm px-6 py-8 md:px-10 md:py-10 border border-white/10 shadow-2xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight [text-shadow:0_2px_20px_rgba(0,0,0,0.6),0_0_40px_rgba(0,0,0,0.4)]">
              Our Team
            </h1>
            <p className="text-xl md:text-2xl text-white font-semibold [text-shadow:0_1px_12px_rgba(0,0,0,0.8)]">
              We are a happy team. We love what we do and we believe we can create a community of great minds.
            </p>
          </div>
        </div>
      </section>

      {/* Intro + Meet our team members */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Meet our team members
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We are proud to introduce you to the dedicated and passionate individuals behind YTOP Global. They are the heart of our organization, and we are grateful for their tireless efforts to make a difference in the world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {CORE_TEAM.map((member) => (
              <div
                key={member.name}
                className="group bg-white rounded-2xl shadow-ytop overflow-hidden border border-slate-100 hover:shadow-ytop-lg hover:border-ytop-blue/20 transition-all duration-300"
              >
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ytop-blue-light to-slate-100">
                      <span className="text-5xl font-bold text-ytop-blue/80 group-hover:text-ytop-blue transition-colors">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <span className="text-xs font-semibold text-white/90 uppercase tracking-wider">
                      {member.position}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-ytop-blue transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-ytop-blue font-medium text-sm">
                    {member.position}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty & mentors */}
      <section className="py-20 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-ytop-blue text-white mb-4">
              <Award className="w-7 h-7" />
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
              Faculty & mentors
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Part of YTOP Global faculty and mentors who support our programs and the Rise of Warriors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {FACULTY_MENTORS.map((person) => (
              <div
                key={person.name}
                className="bg-white rounded-xl p-4 md:p-5 shadow-sm border border-slate-100 hover:shadow-md hover:border-ytop-blue/20 transition-all duration-300 text-center"
              >
                {person.photo ? (
                  <div className="relative w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-ytop-blue/20">
                    <Image
                      src={person.photo}
                      alt={person.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-ytop-blue-light flex items-center justify-center">
                    <Users className="w-8 h-8 text-ytop-blue" />
                  </div>
                )}
                <p className="font-semibold text-slate-900 text-sm md:text-base leading-tight">
                  {person.name}
                </p>
                {person.role && (
                  <p className="text-xs text-ytop-blue font-medium mt-1">
                    {person.role}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team in action */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 text-center">
            Team in action
          </h2>
          <p className="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto">
            We are a happy team. We love what we do and we believe we can create a community of great minds.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TEAM_IN_ACTION_IMAGES.map(({ src, alt }) => (
              <div
                key={src}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-ytop hover:shadow-ytop-lg transition-all duration-300"
              >
                <Image
                  src={src}
                  alt={alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ytop-blue-dark/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join our team CTA – copy from ytopglobal.org/team */}
      <section className="py-20 md:py-24 bg-ytop-red">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
            We&apos;re always looking to expand our family
          </h2>
          <p className="text-xl text-white/95 mb-10 max-w-2xl mx-auto leading-relaxed">
            If you think YTOP is for you, send us your CV — we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-ytop-red font-bold rounded-xl hover:bg-slate-100 shadow-xl transition-all duration-300"
            >
              Join our team now
            </Link>
            <Link
              href="/volunteer"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/20 text-white font-bold rounded-xl border-2 border-white/50 hover:bg-white/30 transition-all duration-300"
            >
              Rise of Warriors
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
