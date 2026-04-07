import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone } from 'lucide-react';
import FooterNewsletterForm from './FooterNewsletterForm';
import SocialIconLinks from '../SocialIconLinks';

const DEFAULT_LOGO = '/media/2023/03/YTOP-PNGGG-2022.png';

type FooterProps = {
  logoUrl?: string | null;
  siteName?: string;
  siteTagline?: string;
};

export default function Footer({
  logoUrl,
  siteName = 'YTOP Global',
  siteTagline = 'Young Talented Optimistic and Potential Org.',
}: FooterProps) {
  const currentYear = new Date().getFullYear();
  const logoSrc = logoUrl?.trim() || DEFAULT_LOGO;

  return (
    <footer className="bg-secondary text-gray-300">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="relative h-11 w-[120px] flex-shrink-0">
                <Image
                  src={logoSrc}
                  alt={siteName}
                  fill
                  className="object-contain object-left"
                  sizes="120px"
                />
              </div>
              <div>
                <div className="font-bold text-white text-lg">{siteName}</div>
                <div className="text-xs text-slate-400">{siteTagline}</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-5">
              Empowering young people through leadership development, career guidance,
              and community impact initiatives.
            </p>
            <SocialIconLinks variant="footer" />
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/programs', label: 'Our Programs' },
                { href: '/team', label: 'Our Team' },
                { href: '/events', label: 'Events' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/blog', label: 'Blog' },
                { href: '/get-involved', label: 'Get Involved' },
                { href: '/donate', label: 'Donate' },
                { href: '/impact', label: 'Impact' },
                { href: '/contact', label: 'Contact' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-primary hover:pl-2 transition-all duration-200 cursor-pointer inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Get Involved</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/get-involved" className="hover:text-primary hover:pl-2 transition-all duration-200 cursor-pointer inline-block">Get Involved</Link>
              </li>
              <li>
                <Link href="/get-involved/campus-ambassadors" className="hover:text-primary hover:pl-2 transition-all duration-200 cursor-pointer inline-block">Campus Ambassadors</Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-primary hover:pl-2 transition-all duration-200 cursor-pointer inline-block">Make a Donation</Link>
              </li>
              <li>
                <Link href="/get-involved/partner" className="hover:text-primary hover:pl-2 transition-all duration-200 cursor-pointer inline-block">Partner With Us</Link>
              </li>
              <li>
                <Link href="/get-involved/sponsor" className="hover:text-primary hover:pl-2 transition-all duration-200 cursor-pointer inline-block">Become a Sponsor</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary hover:pl-2 transition-all duration-200 cursor-pointer inline-block">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm mb-6">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 text-primary mt-0.5" />
                <span className="hover:text-white transition-colors duration-200">H6, Omole line 4, Omisore Street, Modakeke, Osun State, Nigeria</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+2348012345678" className="hover:text-white transition-colors duration-200 cursor-pointer">+234 801 234 5678</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:info@ytopglobal.org" className="hover:text-white transition-colors duration-200 cursor-pointer">info@ytopglobal.org</a>
              </li>
            </ul>
            <div>
              <h4 className="text-white font-semibold mb-2 text-sm">Newsletter</h4>
              <FooterNewsletterForm />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="text-slate-400">
              © {currentYear} {siteName}. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors duration-200 cursor-pointer">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-200 cursor-pointer">Terms</Link>
              <Link href="/site-map" className="hover:text-white transition-colors duration-200 cursor-pointer">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
