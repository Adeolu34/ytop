'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import SocialIconLinks from '../SocialIconLinks';

const menuItems = [
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
            <SocialIconLinks variant="mobile" />
          </div>
        </div>
      </div>
    </>
  );
}
