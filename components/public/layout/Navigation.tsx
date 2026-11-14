'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

import { menuItems } from './menu-items';

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
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
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
              </Link>
            ) : (
              <Link
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
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
              <div className="absolute top-full left-0 w-56 bg-white dark:bg-surface-dark rounded-xl shadow-ytop-lg border border-gray-100 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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
