'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import SocialIconLinks from '../SocialIconLinks';

const menuItems = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  {
    label: 'Programs',
    href: '/programs',
    children: [
      { label: 'All Programs', href: '/programs' },
      { label: 'Project 300', href: '/programs/project-300' },
      { label: 'Rise of Warriors', href: '/programs/rise-of-warriors' },
      { label: 'Leadership Development', href: '/programs#leadership' },
      { label: 'Career Guidance', href: '/programs#career' },
      { label: 'Community Impact', href: '/programs#community' },
    ],
  },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Blog', href: '/blog' },
  {
    label: 'Get Involved',
    href: '/get-involved',
    children: [
      { label: 'Campus Ambassadors', href: '/get-involved/campus-ambassadors' },
      { label: 'Become a Sponsor', href: '/get-involved/sponsor' },
      { label: 'Partner With Us', href: '/get-involved/partner' },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMounted(true); }, []);

  const closeMenu = () => { setIsOpen(false); setExpandedItem(null); };

  // Close on route change
  useEffect(() => { closeMenu(); }, [pathname]);

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const portal = (
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 bg-black/50 z-[200] transition-opacity duration-300',
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeMenu}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        className={clsx(
          'fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-background dark:bg-background-dark shadow-2xl z-[210] transform transition-transform duration-300 ease-in-out overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="p-6">
          <button
            onClick={closeMenu}
            className="absolute top-4 right-4 p-2 text-gray-700 dark:text-gray-200 hover:text-primary transition"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="mb-8">
            <div className="font-display font-bold text-xl text-gray-900 dark:text-white">YTOP Global</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Young Talented Optimistic and Potential Org.</div>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedItem === item.label;

              return (
                <div key={item.label}>
                  {hasChildren ? (
                    <>
                      <button
                        onClick={() => setExpandedItem(isExpanded ? null : item.label)}
                        className={clsx(
                          'flex items-center justify-between w-full px-4 py-3 text-left font-semibold rounded-lg transition',
                          isActive
                            ? 'text-primary'
                            : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-surface-light dark:hover:bg-white/10'
                        )}
                      >
                        {item.label}
                        <ChevronDown className={clsx('w-5 h-5 transition-transform', isExpanded && 'rotate-180')} />
                      </button>
                      {isExpanded && (
                        <div className="ml-4 mt-2 space-y-1">
                          {item.children!.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={closeMenu}
                              className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-surface-light dark:hover:bg-white/10 rounded-lg transition"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={clsx(
                        'block px-4 py-3 font-semibold rounded-lg transition',
                        isActive
                          ? 'text-primary'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-surface-light dark:hover:bg-white/10'
                      )}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mt-8 space-y-3">
            <Link
              href="/get-involved"
              onClick={closeMenu}
              className="block w-full px-6 py-3 text-center text-secondary border-2 border-secondary rounded-full hover:bg-secondary/10 transition font-bold"
            >
              Get Involved
            </Link>
            <Link
              href="/donate"
              onClick={closeMenu}
              className="block w-full px-6 py-3 text-center bg-primary text-white rounded-full hover:bg-primary-hover shadow-lg shadow-primary/30 transition font-bold"
            >
              Donate Now
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <SocialIconLinks variant="mobile" />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="p-2 text-gray-700 dark:text-gray-200 hover:text-primary transition"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {mounted ? createPortal(portal, document.body) : null}
    </>
  );
}
