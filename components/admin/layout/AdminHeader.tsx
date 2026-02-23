'use client';

import { useSession, signOut } from 'next-auth/react';
import { Bell, LogOut, User as UserIcon } from 'lucide-react';

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management System</h1>
          <p className="text-sm text-gray-600">Manage your website content</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-gray-900 transition">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                {session?.user?.name || 'Admin'}
              </div>
              <div className="text-xs text-gray-600">{session?.user?.role || 'ADMIN'}</div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white">
              <UserIcon className="w-5 h-5" />
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="p-2 text-gray-600 hover:text-red-600 transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
