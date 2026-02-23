'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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

export default function Navigation() {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <nav className="flex items-center gap-1">
      {menuItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        const hasChildren = item.children && item.children.length > 0;

        return (
          <div
            key={item.label}
            className="relative"
            onMouseEnter={() => hasChildren && setOpenDropdown(item.label)}
            onMouseLeave={() => setOpenDropdown(null)}
          >
            {hasChildren ? (
              <button
                className={clsx(
                  'flex items-center gap-1 px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-lg cursor-pointer',
                  isActive
                    ? 'text-primary'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                )}
              >
                {item.label}
                <ChevronDown className={clsx(
                  'w-4 h-4 transition-transform duration-200',
                  openDropdown === item.label && 'rotate-180'
                )} />
              </button>
            ) : (
              <Link
                href={item.href}
                className={clsx(
                  'block px-4 py-2 text-sm font-semibold transition-colors duration-200 rounded-lg cursor-pointer',
                  isActive
                    ? 'text-primary'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary'
                )}
              >
                {item.label}
              </Link>
            )}

            {/* Dropdown Menu */}
            {hasChildren && openDropdown === item.label && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-surface-dark rounded-xl shadow-ytop-lg border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {item.children!.map((child) => (
                  <Link
                    key={child.label}
                    href={child.href}
                    className="block px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-surface-light dark:hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
