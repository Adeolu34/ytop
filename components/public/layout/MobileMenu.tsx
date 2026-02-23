'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { label: 'About', href: '/about' },
  {
    label: 'Programs',
    href: '/programs',
    children: [
      { label: 'All Programs', href: '/programs' },
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
      { label: 'Get Involved', href: '/get-involved' },
      { label: 'Campus Ambassadors', href: '/get-involved/campus-ambassadors' },
      { label: 'Become a Sponsor', href: '/get-involved/sponsor' },
      { label: 'Partner With Us', href: '/get-involved/partner' },
    ],
  },
  { label: 'Donate', href: '/donate' },
  { label: 'Contact', href: '/contact' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-700 dark:text-gray-200 hover:text-primary transition"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={clsx(
          'fixed top-0 right-0 bottom-0 w-80 bg-background dark:bg-background-dark shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={closeMenu}
            className="absolute top-4 right-4 p-2 text-gray-700 dark:text-gray-200 hover:text-primary transition"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Logo */}
          <div className="mb-8">
            <div className="font-display font-bold text-xl text-gray-900 dark:text-white">YTOP Global</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Young Talented Optimistic and Potential Org.</div>
          </div>

          {/* Menu Items */}
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
                        onClick={() =>
                          setExpandedItem(isExpanded ? null : item.label)
                        }
                        className={clsx(
                          'flex items-center justify-between w-full px-4 py-3 text-left font-semibold rounded-lg transition',
                          isActive
                            ? 'text-primary'
                            : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-surface-light dark:hover:bg-white/10'
                        )}
                      >
                        {item.label}
                        <ChevronDown
                          className={clsx(
                            'w-5 h-5 transition-transform',
                            isExpanded && 'rotate-180'
                          )}
                        />
                      </button>

                      {/* Submenu */}
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

          {/* CTA Buttons */}
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

          {/* Social Links */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://facebook.com/ytopglobal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary transition"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/ytopglobal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary transition"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a
                href="https://linkedin.com/company/ytopglobal"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-primary transition"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
