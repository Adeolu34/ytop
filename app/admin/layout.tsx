import type { ReactNode } from 'react';
import { Inter, Manrope } from 'next/font/google';
import AdminSidebar from '@/components/admin/layout/AdminSidebar';
import AdminHeader from '@/components/admin/layout/AdminHeader';
import AdminProviders from '@/components/admin/layout/AdminProviders';
import { requireAuth } from '@/lib/auth-utils';

const adminDisplay = Manrope({
  subsets: ['latin'],
  variable: '--font-admin-display',
  display: 'swap',
});

const adminBody = Inter({
  subsets: ['latin'],
  variable: '--font-admin-body',
  display: 'swap',
});

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAuth();

  return (
    <div
      className={`${adminDisplay.variable} ${adminBody.variable} admin-theme min-h-screen bg-[#fbf9f8] text-[#1b1c1c]`}
    >
      <AdminProviders>
        <div className="min-h-screen bg-[#fbf9f8]">
          <AdminSidebar />
          <AdminHeader />
          <main className="min-h-screen bg-[#fbf9f8] pt-16 lg:ml-64">
            {children}
          </main>
        </div>
      </AdminProviders>
    </div>
  );
}
