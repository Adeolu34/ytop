'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { Bell, Headset, LogOut, Search } from 'lucide-react';
import { getAdminPageMeta } from '@/lib/admin-shell';

function getSearchAction(pathname: string): string {
  if (pathname.startsWith('/admin/users')) {
    return '/admin/users';
  }

  if (pathname.startsWith('/admin/posts')) {
    return '/admin/posts';
  }

  if (
    pathname.startsWith('/admin/gallery') ||
    pathname.startsWith('/admin/media')
  ) {
    return '/admin/gallery';
  }

  if (pathname.startsWith('/admin/comments')) {
    return '/admin/comments';
  }

  if (pathname.startsWith('/admin/settings')) {
    return '/admin/settings';
  }

  if (pathname.startsWith('/admin/team')) {
    return '/admin/team';
  }

  if (pathname.startsWith('/admin/programs')) {
    return '/admin/programs';
  }

  return '/admin';
}

function shouldPreserveParam(pathname: string, key: string): boolean {
  if (['q', 'notice', 'error'].includes(key)) {
    return false;
  }

  if (pathname.startsWith('/admin/users')) {
    return key === 'role';
  }

  if (pathname.startsWith('/admin/posts')) {
    return key === 'status';
  }

  if (
    pathname.startsWith('/admin/gallery') ||
    pathname.startsWith('/admin/media')
  ) {
    return key === 'type' || key === 'folder';
  }

  return false;
}

export default function AdminHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const meta = getAdminPageMeta(pathname);
  const searchAction = getSearchAction(pathname);
  const preservedParams = Array.from(searchParams.entries()).filter(([key]) =>
    shouldPreserveParam(pathname, key)
  );
  const initials =
    session?.user?.name
      ?.split(/\s+/)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AD';

  return (
    <header className="admin-glass fixed inset-x-0 top-0 z-30 border-b border-white/40 bg-[#fbf9f8]/85 shadow-[0_32px_32px_rgba(27,28,28,0.04)] lg:left-64">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <form method="get" action={searchAction} className="relative flex-1">
          {preservedParams.map(([key, value]) => (
            <input key={`${key}-${value}`} type="hidden" name={key} value={value} />
          ))}
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5d3f3c]" />
          <input
            type="search"
            name="q"
            defaultValue={searchParams.get('q') || ''}
            placeholder={meta.searchPlaceholder}
            className="w-full rounded-full border-none bg-[#f5f3f3] py-2.5 pl-11 pr-24 text-sm text-[#1b1c1c] outline-none ring-0 transition-all placeholder:text-[#5d3f3c]/70 focus:bg-white focus:ring-2 focus:ring-[#ba0013]/20"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-[#ba0013] transition-colors hover:bg-[#ffdad6]"
          >
            Search
          </button>
        </form>

        <div className="hidden items-center gap-2 sm:flex">
          <a
            href="mailto:info@ytopglobal.org?subject=YTOP%20Admin%20Support"
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-[#5d3f3c] transition-colors hover:bg-white hover:text-[#ba0013]"
          >
            <Headset className="h-4 w-4" />
            Support
          </a>
        </div>

        <Link
          href={session?.user?.role === 'ADMIN' ? '/admin/comments' : '/admin'}
          className="relative rounded-full p-2 text-[#5d3f3c] transition-colors hover:bg-white hover:text-[#ba0013]"
          title="Open moderation queue"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ba0013]" />
        </Link>

        <div className="flex items-center gap-3 border-l border-[#e7bdb8]/40 pl-3 sm:pl-4">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-bold text-[#1b1c1c]">
              {session?.user?.name || 'Admin User'}
            </div>
            <div className="text-[0.625rem] uppercase tracking-[0.16em] text-[#5d3f3c]">
              {session?.user?.role || 'Administrator'}
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ba0013] to-[#e31e24] text-sm font-bold text-white shadow-lg shadow-[#ba0013]/15">
            {initials}
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="rounded-full p-2 text-[#5d3f3c] transition-colors hover:bg-white hover:text-[#ba0013]"
            title={`Sign out from ${meta.title}`}
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
