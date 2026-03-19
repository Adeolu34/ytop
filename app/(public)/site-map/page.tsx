import Link from 'next/link';

const SITE_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/programs/project-300', label: 'Project 300' },
  { href: '/programs/rise-of-warriors', label: 'Rise of Warriors' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/blog', label: 'Blog' },
  { href: '/team', label: 'Team' },
  { href: '/impact', label: 'Impact' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/get-involved/partner', label: 'Partner With Us' },
  { href: '/get-involved/sponsor', label: 'Become a Sponsor' },
  {
    href: '/get-involved/campus-ambassadors',
    label: 'Campus Ambassadors',
  },
  { href: '/donate', label: 'Donate' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Use' },
];

export const metadata = {
  title: 'Site Map - YTOP Global',
  description: 'Browse the main pages available on the YTOP Global website.',
};

export default function SiteMapPage() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Sitemap
        </p>
        <h1 className="mt-4 font-display text-4xl font-extrabold text-slate-900">
          Explore the site
        </h1>
        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {SITE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-slate-200 px-5 py-4 text-sm font-semibold text-slate-800 transition-colors hover:border-primary hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
