import Link from 'next/link';
import Image from 'next/image';
import FooterNewsletterForm from './FooterNewsletterForm';
import SocialIconLinks from '../SocialIconLinks';

const DEFAULT_LOGO = '/media/2023/03/YTOP-PNGGG-2022.png';

type FooterProps = {
  logoUrl?: string | null;
  siteName?: string;
  /** Kept for compatibility; the footer shows the approved organisation name. */
  siteTagline?: string;
};

// Copy: Master Website Content document, Part Twelve.
const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'About Us',
    links: [
      { href: '/about', label: 'Our Story' },
      { href: '/about#mission', label: 'Our Mission and Vision' },
      { href: '/team', label: 'Our Team' },
      { href: '/governance', label: 'Governance' },
    ],
  },
  {
    title: 'Our Work',
    links: [
      { href: '/programs', label: 'Our Programmes' },
      { href: '/impact', label: 'Our Impact' },
      { href: '/reports', label: 'Reports and Publications' },
      { href: '/events', label: 'Events' },
    ],
  },
  {
    title: 'Get Involved',
    links: [
      { href: '/get-involved/volunteer', label: 'Volunteer' },
      { href: '/get-involved/mentor', label: 'Become a Mentor' },
      { href: '/get-involved/campus-ambassadors', label: 'Campus Ambassador' },
      { href: '/get-involved/community', label: 'Join Our Community' },
    ],
  },
  {
    title: 'Support Us',
    links: [
      { href: '/donate', label: 'Make a Donation' },
      { href: '/donate#monthly-giving', label: 'Monthly Giving' },
      { href: '/get-involved/sponsor', label: 'Sponsor a Programme' },
      { href: '/get-involved/partner', label: 'Corporate Partnerships' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { href: '/contact', label: 'Contact Us' },
      { href: 'mailto:admin@ytopglobal.org', label: 'Partnership Enquiries' },
      { href: 'mailto:info@ytopglobal.org', label: 'General Enquiries' },
    ],
  },
];

const linkClass = 'text-gray-200 hover:text-white hover:underline underline-offset-4 transition-colors duration-200 inline-block';

export default function Footer({ logoUrl, siteName = 'YTOP Global' }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const logoSrc = logoUrl?.trim() || DEFAULT_LOGO;

  return (
    <footer className="bg-secondary text-gray-300">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative h-11 w-[120px] flex-shrink-0">
                <Image src={logoSrc} alt={siteName} fill className="object-contain object-left" sizes="120px" />
              </div>
              <div>
                <div className="font-bold text-white text-lg uppercase">{siteName}</div>
                <div className="text-sm text-slate-200">YTOP Youth Empowerment Foundation</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-3">
              Developing young people through leadership, education, mentorship, capacity building and community engagement.
            </p>
            <p className="text-sm leading-relaxed mb-5">
              We work to create opportunities for young people to develop their abilities, participate meaningfully in society and contribute to stronger communities.
            </p>
            <SocialIconLinks variant="footer" />
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">{col.title}</h3>
              <ul className="space-y-3 text-sm">
                {col.links.map(({ href, label }) => (
                  <li key={label}>
                    {href.startsWith('mailto:') ? (
                      <a href={href} className={linkClass}>{label}</a>
                    ) : (
                      <Link href={href} className={linkClass}>{label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 max-w-sm">
          <h3 className="text-white font-semibold mb-2 text-sm">Newsletter</h3>
          <FooterNewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5">
          <p className="text-sm text-slate-300 mb-3">Registration: CAC RC179444</p>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm">
            <div className="text-slate-300">
              © {currentYear} YTOP Youth Empowerment Foundation. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
              <Link href="/safeguarding" className="hover:text-white transition-colors">Safeguarding</Link>
              <Link href="/accessibility" className="hover:text-white transition-colors">Accessibility</Link>
              <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
