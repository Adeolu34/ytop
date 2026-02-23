import Image from 'next/image';
import Link from 'next/link';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';

/**
 * YTOP Events – content aligned with https://ytopglobal.org/ytop-events/
 * Structure: Upcoming Events + Previous Events (Gallery > Upcoming / Previous on main site)
 */

const upcomingEvents: Array<{
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  image: string;
  cta?: string;
}> = [
  {
    id: 'coming-soon',
    title: 'More events coming soon',
    date: 'TBA',
    location: 'Watch this space',
    description: 'We are planning our next conferences, boot camps, and community outreaches. Subscribe to our newsletter or follow us on social media to be the first to know.',
    image: '/media/2021/11/20210605_080734-scaled.jpg',
    cta: 'Join our community',
  },
];

const previousEvents: Array<{
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  location?: string;
  description: string;
  description2?: string;
  image?: string;
  images?: string[];
  tags?: string[];
  sdg?: string;
}> = [
  {
    id: 'childrens-day-2024',
    title: 'Children’s Day Outreach: Special Need School',
    subtitle: 'Celebrating Special People with Special Abilities',
    date: 'May 2024',
    location: 'Special Needs School, Ile-Ife, Osun State',
    description: 'The project took place at the Special Needs School in Ile-Ife to commemorate Children’s Day 2024 under the theme “For every child, every right.” It aimed to promote inclusivity, joy, and empowerment among children with disabilities. The outreach featured motivational talks, self-affirmations, singing, dancing, and interactive interviews that encouraged the children to express their aspirations.',
    description2: 'Aligned with SDG 4 (Quality Education), the initiative addressed limited societal support and inclusiveness often experienced by children with special needs. About 150 students and teachers participated, with support from OAU Campus Ambassadors, the Volunteering Hub Team, and the More to Me Organization.',
    images: ['/media/2021/10/IMG_9658-scaled.jpg'],
    tags: ['SpecialNeedsAwareness', 'EmpowerEveryChild', 'DisabilityInclusion', 'YouthEmpowerment'],
    sdg: 'SDG 4 – Quality Education',
  },
  {
    id: 'youth-on-a-mission',
    title: 'Youth On A Mission: beCOMING',
    subtitle: 'YTOP Conference 2.0',
    date: '2024',
    location: 'Ajose Lecture Theater, Obafemi Awolowo University, Ile-Ife, Osun State',
    description: 'An annual flagship event that serves as a pivotal platform for young individuals embarking on their personal development journey. The conference addresses clarity in self-discovery, talent cultivation, career trajectory, purpose alignment, and holistic self-improvement.',
    description2: 'YTOP Conference 2.0 “Youths On A Mission – beCOMING” spanned six enriching hours with seven distinguished resource persons. Over 300 intentional changemakers attended physically and virtually from secondary schools in Ile-Ife, 32 universities, and 5 countries: Nigeria, Namibia, Zimbabwe, Zambia, and Ghana.',
    image: '/media/2021/10/IMG_9724-scaled.jpg',
    tags: ['Conference', 'Leadership', 'PersonalDevelopment'],
  },
  {
    id: 'ytop-and-friends-3',
    title: 'YTOP and Friends 3.0',
    subtitle: 'Unlocking Success: Strategies, Stories, and Secrets for Youth Empowerment',
    date: '2024',
    description: 'An annual two-day gathering uniting participants who have been part of YTOP events throughout the year. It offers a unique opportunity to reconnect with fellow participants and gain deeper insights into the broader YTOP Global community.',
    description2: 'Five distinguished changemakers shared their insights, unveiling the details of their personal journeys towards success. The session explored success stories, lessons learned, challenges, strategic steps, and invaluable resources. About 50 participants were empowered with a well-rounded perspective on success beyond academic accomplishments.',
    images: ['/media/2025/09/WhatsApp-Image-2025-09-18-at-06.39.24_e45e587e.jpg', '/media/2021/11/005.jpg'],
  },
  {
    id: 'rise-of-warriors',
    title: 'Rise of Warriors',
    subtitle: 'Boot camp for ages 16–24',
    date: 'September 8 – October 8, 2023 (5th edition)',
    location: 'Virtual (Zoom & WhatsApp)',
    description: 'A comprehensive four-week program encompassing project execution, aimed at fostering learning, interaction, networking, and enduring connections. It emphasizes leadership, communication, critical thinking, problem-solving, interpersonal, and time management skills.',
    description2: 'The fifth edition featured six facilitators, six clan coaches, and 28 Warriors. Highlights included a game night introduction and a final session on strategies for seizing global opportunities. Participants engaged in intensive training, strategic networking, collaboration, and project planning.',
    image: '/media/2021/11/006.jpg',
    tags: ['BootCamp', 'Leadership', 'Virtual'],
  },
  {
    id: 'international-youth-week',
    title: 'International Youth Week',
    subtitle: 'Empowering Youth, Transforming Tomorrow',
    date: 'August 7–13, 2023',
    description: 'The event aimed to significantly impact the global youth community by fostering awareness, recognition, and unity. YTOP Global leveraged social media and online platforms for maximum visibility and impact.',
    description2: 'The International Youth Day 2023 celebration sought to raise awareness about pressing youth issues, provide recognition to young achievers, and foster unity and gratitude—envisioned as a catalyst for inspiring, empowering, and celebrating the potential and power of youth.',
    image: '/media/2021/11/007.jpg',
  },
  {
    id: 'rise-of-100-leaders',
    title: 'The Rise of 100 Leaders',
    subtitle: 'Rise of YTOPs',
    date: '2023',
    location: 'Obafemi Awolowo University, Ile-Ife, Osun State',
    description: 'A transformative 18-week program designed to empower youth with advanced knowledge and skills to become exemplary leaders of tomorrow. The project aimed to equip participants with leadership principles, problem-solving abilities, a mentorship network, and contribution to SDGs within their communities.',
    description2: 'The project successfully enrolled 40 individuals with a 2:10 coach–participant model. Participants engaged in intensive training, strategic networking, collaboration, and strategic project planning.',
    images: ['/media/2025/09/WhatsApp-Image-2025-09-18-at-06.39.24_e45e587e.jpg', '/media/2021/11/008.jpg'],
  },
  {
    id: 'sdg-millennium-fellowship',
    title: 'United Nations SDG, Millennium Fellowship Project',
    date: '2022',
    location: 'Excel Standard College, Ọ̀pá, Ile-Ife, Osun State',
    description: 'Ekundayo Oluwadamilare, Executive Director of YTOP Global, paid a visit as a member of the Millennium Campus Network to educate students on United Nations SDG goals, career discovery, and development. Key points shared: at every decision-making point, take your time and reason rather than pleasing friends; lost interest in basic needs can be essential to moving up the ladder; ask for guidance from parents, teachers, relatives, or counselors in the same field.',
    image: '/media/2021/10/IMG_9574-scaled.jpg',
    sdg: 'SDG 4',
  },
  {
    id: 'own-a-school',
    title: 'Own A School Project',
    subtitle: 'Education for Sustainable Development',
    date: 'November 11 & 18, 2022',
    location: 'Fadehan International College, Elelyele, Lagere, Ile Ife, Osun State',
    description: 'SDG 4 aims to ensure inclusive and equitable quality education and promote lifelong learning. Ekundayo Oluwadamilare partook as an advocate for the UN Sustainable Development Solutions Network–Nigeria, helping incorporate Education for Sustainable Development (ESD) into secondary schools nationwide.',
    description2: 'Learning objectives were to define the context of SDG and introduce pedagogies for the younger generation. Over 150 secondary school students gathered for the program.',
    sdg: 'SDG 4 – Quality Education',
  },
  {
    id: 'ytop-conference-2022',
    title: 'YTOP Global Conference',
    subtitle: 'Youths On A Mission',
    date: 'March 19, 2022',
    location: 'Obafemi Awolowo University, Ile-Ife',
    description: 'The conference was held in OAU with about 300 participants. Five renowned professional speakers with global significance and three keynote panelists graced the event with a practical approach to balancing academics with personal development goals.',
    image: '/media/2021/11/005.jpg',
  },
  {
    id: 'rise-of-warriors-row',
    title: 'Rise of Warriors (ROW)',
    date: 'Launched 2020 – 4 editions',
    description: 'Rise of Warriors was launched in 2020 with the aim of raising community leaders and change-makers. The YTOP Global Community started with 5 community leaders and has continually increased in size.',
    description2: 'ROW is an intensive training program covering emotional intelligence, personal branding, mental health, effective leadership and communication, with notable experts. Since inception, the program has taken place 4 times with massive impact testimonies.',
    image: '/media/2021/10/IMG_9658-scaled.jpg',
  },
  {
    id: 'human-capital-2021',
    title: 'Human Capital Development',
    date: 'July 13, 2021',
    location: 'Comprehensive High School, Ayetoro (OOU & Beyond Attendance partnership)',
    description: 'The YTOP team in Olabisi Onabanjo University, Ogun State, partnered with the Beyond Attendance team to enlighten students on the power of a growth mindset. About 250 students participated.',
    image: '/media/2021/10/IMG_9724-scaled.jpg',
  },
  {
    id: 'talent-discovery-2021',
    title: 'Talent Discovery Program',
    date: 'May 7, 2021',
    location: 'Acada High School, Modakeke, Ile-Ife, Osun State',
    description: 'We organised students around the topic “Talent Discovery Before Career Choice.” After a general session, students were grouped by class for practical sessions on talent discovery.',
    image: '/media/2021/10/MG_9939_3-1-min-scaled.jpg',
  },
  {
    id: 'human-capital-2020',
    title: 'Human Capital Development',
    subtitle: 'Holistic Reflection on Human Capital Development: A Path to Growth',
    date: 'April–May 2020',
    location: 'Virtual (Telegram)',
    description: 'A virtual webinar with over 2,000 active participants on Telegram, lasting 10 days with 10 notable speakers who are experts in Leadership, Agriculture, Personal Branding, Corporate and Enterprise Development, and other areas relevant to personal development.',
    image: '/media/2021/11/20210605_080734-scaled.jpg',
  },
  {
    id: 'project-talent-discovery',
    title: 'Project Talent Discovery',
    subtitle: 'Talent Discovery Before Career Choice',
    date: 'January–February 2020',
    location: 'South-West Nigeria (Urban Day Secondary School Jericho Ibadan; Saint Peter Middle School Ile-Ife; Fadehan International School; Aatan Baptist Comprehensive High School, Koso; others)',
    description: 'Project talent discovery talks in various secondary schools in South-West Nigeria. We visited Urban Day Secondary School, Jericho, Ibadan, Oyo State, where over 800 students were coordinated and lectured on the importance and impact of early talent discovery.',
    image: '/media/2021/10/IMG_9586-scaled.jpg',
  },
  {
    id: 'kiddies-arts',
    title: 'Kiddies Arts Exhibition',
    subtitle: 'MY DREAM NIGERIA',
    date: 'May 27, 2020',
    description: 'In collaboration with Estelle Design, this project aimed at exploring various creative talents in children from Primary to Secondary School across South-West Nigeria. The grand exhibition and prize-giving day was held on Children’s Day, featuring talent shows, dance, drama, spoken word poetry, and games. Awards for creativity were given to all participants; winners received cash prizes.',
    image: '/media/2021/10/IMG_9574-scaled.jpg',
  },
];

export const metadata = {
  title: 'YTOP Events – Upcoming & Previous Events | YTOP Global',
  description: 'Explore YTOP Global events: conferences, Rise of Warriors boot camp, International Youth Week, talent discovery programs, and community outreaches. Join upcoming events and see our impact.',
};

export default function EventsPage() {
  return (
    <div>
      {/* Hero - stitch style */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/media/2021/10/IMG_9724-scaled.jpg"
            alt="YTOP events and community"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/75 to-primary/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_0%,rgba(0,0,0,0.5)_100%)]" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 py-20 text-center">
          <div className="max-w-3xl mx-auto rounded-2xl bg-black/50 backdrop-blur-sm px-6 py-8 md:px-10 md:py-10 border border-white/10 shadow-2xl">
            <h1 className="font-display text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
              YTOP Events
            </h1>
            <p className="text-xl md:text-2xl text-white font-semibold mb-2">
              Welcome to YTOP Global — we believe you are Young, Talented, Optimistic and full of potential.
            </p>
            <p className="text-base text-white/95 font-medium">
              Upcoming events and highlights from our previous programs
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="upcoming-events" className="py-20 md:py-24 bg-white dark:bg-background-dark scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 text-center">
            Upcoming Events
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Register now to secure your spot at our upcoming programs
          </p>

          <div className="space-y-8">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="group bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-800"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  <div className="relative h-64 lg:h-auto min-h-[200px] overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-secondary/70 to-transparent" />
                  </div>
                  <div className="lg:col-span-2 p-8 flex flex-col justify-center">
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                      {event.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                      {event.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-slate-700 dark:text-slate-300 text-sm">
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        {event.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        {event.location}
                      </span>
                    </div>
                    {event.cta && (
                      <Link
                        href="/contact"
                        className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-hover shadow-md transition-all duration-300"
                      >
                        {event.cta}
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Previous Events */}
      <section id="previous-events" className="py-20 md:py-24 bg-slate-50 dark:bg-background-dark scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2 text-center">
            Previous Events
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            Highlights from our conferences, boot camps, and community outreaches
          </p>

          <div className="space-y-12">
            {previousEvents.map((event) => (
              <article
                key={event.id}
                className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {(event.image || (event.images && event.images[0])) && (
                    <div className="md:w-80 flex-shrink-0 relative h-56 md:h-auto min-h-[220px] overflow-hidden">
                      <Image
                        src={event.image || event.images![0]}
                        alt={event.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 320px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent md:from-transparent" />
                    </div>
                  )}
                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="flex items-center gap-1.5 text-sm text-slate-500">
                        <Calendar className="w-4 h-4 text-primary" />
                        {event.date}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin className="w-4 h-4 text-secondary" />
                          {event.location}
                        </span>
                      )}
                      {event.sdg && (
                        <span className="px-2.5 py-1 bg-secondary/10 text-secondary text-xs font-semibold rounded-full">
                          {event.sdg}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">
                      {event.title}
                    </h3>
                    {event.subtitle && (
                      <p className="text-primary font-semibold text-sm md:text-base mb-3">
                        {event.subtitle}
                      </p>
                    )}
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                      {event.description}
                    </p>
                    {event.description2 && (
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                        {event.description2}
                      </p>
                    )}
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {event.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {event.images && event.images.length > 1 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 md:p-6 bg-slate-50 border-t border-slate-100">
                    {event.images.slice(1, 4).map((src, i) => (
                      <div key={i} className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={src}
                          alt={`${event.title} ${i + 2}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA – Donate */}
      <section className="py-20 md:py-24 bg-primary">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
            Your donation can help
          </h2>
          <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto">
            Every contribution, no matter the size, can go a long way. Click now to make a secure donation to support us.
          </p>
          <Link
            href="/donate"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-full hover:bg-slate-100 shadow-xl transition-all duration-300"
          >
            Donate Now
          </Link>
          <p className="mt-10 text-white/80 text-sm">
            Want to learn more? <Link href="/blog" className="underline font-semibold hover:text-white">Read our blog</Link> · <Link href="/contact" className="underline font-semibold hover:text-white">Contact us</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
