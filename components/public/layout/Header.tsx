import Link from 'next/link';
import Navigation from './Navigation';
import MobileMenu from './MobileMenu';
import Logo from './Logo';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Logo />

          <div className="hidden lg:block">
            <Navigation />
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/get-involved"
              className="px-5 py-2.5 text-secondary font-semibold hover:bg-secondary/10 rounded-full transition-all duration-200 cursor-pointer"
            >
              Get Involved
            </Link>
            <Link
              href="/donate"
              className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-primary/30 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
            >
              Donate Now
            </Link>
          </div>

          <div className="lg:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
