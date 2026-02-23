'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  File,
  Users,
  Image,
  Star,
  Briefcase,
  Calendar,
  DollarSign,
  Settings,
  Menu as MenuIcon,
  Tag,
} from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: FileText, label: 'Posts', href: '/admin/posts' },
  { icon: File, label: 'Pages', href: '/admin/pages' },
  { icon: Image, label: 'Media', href: '/admin/media' },
  { icon: Tag, label: 'Categories', href: '/admin/categories' },
  { icon: Users, label: 'Team', href: '/admin/team' },
  { icon: Star, label: 'Testimonials', href: '/admin/testimonials' },
  { icon: Briefcase, label: 'Programs', href: '/admin/programs' },
  { icon: Calendar, label: 'Events', href: '/admin/events' },
  { icon: DollarSign, label: 'Campaigns', href: '/admin/campaigns' },
  { icon: MenuIcon, label: 'Menus', href: '/admin/menus' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden lg:block">
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold">YG</span>
          </div>
          <div>
            <div className="font-bold text-lg">YTOP Global</div>
            <div className="text-xs text-gray-400">Admin Panel</div>
          </div>
        </Link>
      </div>

      <nav className="p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 mt-auto">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition text-sm"
        >
          View Website →
        </Link>
      </div>
    </aside>
  );
}
