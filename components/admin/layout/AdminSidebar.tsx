'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ExternalLink,
  FileText,
  Images,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  UsersRound,
  Layers,
} from 'lucide-react';
import clsx from 'clsx';
import {
  ADMIN_NAV_ITEMS,
  type AdminIconKey,
  isAdminNavItemActive,
} from '@/lib/admin-shell';

const iconMap: Record<AdminIconKey, typeof LayoutDashboard> = {
  dashboard: LayoutDashboard,
  users: Users,
  posts: FileText,
  gallery: Images,
  settings: Settings,
  team: UsersRound,
  programs: Layers,
  comments: MessageSquare,
};

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="admin-surface-panel fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col bg-[#f5f3f3] py-6 lg:flex">
        <div className="px-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-[#ba0013] to-[#e31e24] text-white shadow-lg shadow-[#ba0013]/20">
              <span className="admin-font-display text-lg font-extrabold">YG</span>
            </div>
            <div>
              <div className="admin-font-display text-xl font-bold tracking-tight text-[#1b1c1c]">
                YTOP Global
              </div>
              <div className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#5d3f3c]">
                Admin Console
              </div>
            </div>
          </Link>
        </div>

        <nav className="mt-10 flex-1 space-y-1">
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = isAdminNavItemActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors duration-200',
                  isActive
                    ? 'border-l-4 border-[#e31e24] bg-[#ffdad6] font-semibold text-[#e31e24]'
                    : 'text-[#5d3f3c] hover:bg-[#e4e2e2] hover:text-[#e31e24]'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto px-6">
          <Link
            href="/"
            target="_blank"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-[#5d3f3c] shadow-sm transition-colors hover:bg-[#efeded] hover:text-[#1b1c1c]"
          >
            View Website
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </aside>

      <nav className="admin-surface-panel fixed inset-x-0 bottom-0 z-40 flex max-h-[5.5rem] flex-wrap justify-center gap-1 overflow-y-auto border-t border-[#e7bdb8]/40 bg-[#fbf9f8]/95 px-1 py-2 backdrop-blur lg:hidden">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = isAdminNavItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-[0.6875rem] font-semibold transition-colors',
                isActive
                  ? 'bg-[#ffdad6] text-[#e31e24]'
                  : 'text-[#5d3f3c] hover:bg-[#efeded]'
              )}
            >
              <Icon className="h-4 w-4" />
              <span className="text-center leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
