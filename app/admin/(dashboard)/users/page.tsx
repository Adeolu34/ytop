import Link from 'next/link';
import { Mail, Shield, UserPlus } from 'lucide-react';
import AdminFlashBanner from '@/components/admin/forms/AdminFlashBanner';
import { requireAdmin } from '@/lib/auth-utils';
import {
  getSearchParamValue,
  readAdminFlashMessage,
  type SearchParamRecord,
} from '@/lib/admin-feedback';
import { deleteUserAction } from '@/app/admin/(dashboard)/users/actions';
import { getMongoDb } from '@/lib/mongodb';

type AdminUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  hashedPassword?: string | null;
  image?: string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

function buildRoleHref(role: string, searchQuery: string): string {
  const searchParams = new URLSearchParams();

  if (role !== 'ALL') {
    searchParams.set('role', role);
  }

  if (searchQuery) {
    searchParams.set('q', searchQuery);
  }

  const queryString = searchParams.toString();
  return queryString ? `/admin/users?${queryString}` : '/admin/users';
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamRecord>;
}) {
  const currentUser = await requireAdmin();
  const resolvedSearchParams = await searchParams;
  const flashMessage = readAdminFlashMessage(resolvedSearchParams);
  const searchQuery = getSearchParamValue(resolvedSearchParams.q)?.trim() || '';
  const roleFilter =
    getSearchParamValue(resolvedSearchParams.role)?.toUpperCase() || 'ALL';

  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(now.getDate() - 60);

  const db = await getMongoDb();
  const usersCollection = db.collection<AdminUser>('users');
  const asDate = (value: unknown): Date => {
    if (value instanceof Date) return value;
    const parsed = new Date(String(value ?? ''));
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
  };

  const where: Record<string, unknown> = {};
  if (roleFilter !== 'ALL') where.role = roleFilter;
  if (searchQuery) {
    where.$or = [
      { name: { $regex: searchQuery, $options: 'i' } },
      { email: { $regex: searchQuery, $options: 'i' } },
    ];
  }

  const [users, totalUsers, adminUsers, contentUsers, newUsersThisMonth] =
    await Promise.all([
      usersCollection.find(where).sort({ createdAt: -1 }).limit(20).toArray(),
      usersCollection.countDocuments(),
      usersCollection.countDocuments({ role: 'ADMIN' }),
      usersCollection.countDocuments({
        role: {
          $in: ['ADMIN', 'EDITOR', 'AUTHOR'],
        },
      }),
      usersCollection.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    ]);

  const roleFilters = ['ALL', 'ADMIN', 'EDITOR', 'AUTHOR', 'SUBSCRIBER'];

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 px-4 pb-24 pt-6 sm:px-8 lg:pb-10 lg:pt-10">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="mb-3 block text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-[#5d3f3c]">
            Access & Roles
          </span>
          <h1 className="admin-font-display text-4xl font-extrabold tracking-tight text-[#1b1c1c] sm:text-5xl">
            User Management
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[#5d3f3c] sm:text-base">
            Oversee administrators, editorial access, and team members who
            power the YTOP content platform.
          </p>
        </div>

        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-[#ba0013] to-[#e31e24] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#ba0013]/20 transition-transform hover:scale-[1.02]"
        >
          <UserPlus className="h-4 w-4" />
          Add New User
        </Link>
      </section>

      {flashMessage ? (
        <AdminFlashBanner
          type={flashMessage.type}
          message={flashMessage.message}
        />
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1.9fr)]">
        <div className="admin-surface-card relative overflow-hidden rounded-xl p-8">
          <div className="relative z-10">
            <p className="admin-font-display text-6xl font-extrabold leading-none tracking-tighter text-[#1b1c1c]">
              {totalUsers.toLocaleString()}
            </p>
            <p className="mt-3 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
              Total Accounts
            </p>
          </div>
          <div className="absolute right-6 top-6 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
            +{newUsersThisMonth}
          </div>
        </div>

        <div className="admin-surface-card flex flex-wrap items-center justify-between gap-6 rounded-xl p-8">
          <div>
            <p className="admin-font-display text-3xl font-bold text-[#ba0013]">
              {adminUsers}
            </p>
            <p className="mt-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
              Administrators
            </p>
          </div>
          <div>
            <p className="admin-font-display text-3xl font-bold text-[#1b1c1c]">
              {contentUsers}
            </p>
            <p className="mt-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
              Content Roles
            </p>
          </div>
          <div>
            <p className="admin-font-display text-3xl font-bold text-[#1b1c1c]">
              {newUsersThisMonth}
            </p>
            <p className="mt-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-[#5d3f3c]">
              New This Month
            </p>
          </div>
          <div className="flex h-16 w-32 items-end gap-1">
            <div className="h-1/2 flex-1 rounded-t-sm bg-[#ffdad6]" />
            <div className="h-3/4 flex-1 rounded-t-sm bg-[#f5d0d4]" />
            <div className="h-2/3 flex-1 rounded-t-sm bg-[#ef9a9f]" />
            <div className="h-full flex-1 rounded-t-sm bg-[#ba0013]" />
            <div className="h-5/6 flex-1 rounded-t-sm bg-[#e31e24]" />
          </div>
        </div>
      </section>

      <section className="admin-surface-card rounded-xl p-6">
        <form method="get" className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {roleFilter !== 'ALL' ? (
            <input type="hidden" name="role" value={roleFilter} />
          ) : null}
          <input
            type="search"
            name="q"
            defaultValue={searchQuery}
            className="rounded-lg border border-[#e7bdb8]/30 bg-white px-4 py-3 text-sm text-[#1b1c1c] outline-none transition-colors focus:border-[#ba0013]"
            placeholder="Search names or email addresses"
          />

          <div className="flex flex-wrap gap-2">
            {roleFilters.map((role) => (
              <Link
                key={role}
                href={buildRoleHref(role, searchQuery)}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  roleFilter === role
                    ? 'bg-[#ba0013] text-white'
                    : 'border border-[#e7bdb8]/30 bg-white text-[#1b1c1c] hover:bg-[#efeded]'
                }`}
              >
                {role === 'ALL' ? 'All Roles' : role}
              </Link>
            ))}
          </div>
        </form>
      </section>

      <section className="admin-surface-card overflow-hidden rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7bdb8]/20 px-8 py-6">
          <div>
            <h2 className="admin-font-display text-xl font-bold text-[#1b1c1c]">
              Directory
            </h2>
            <p className="mt-1 text-xs text-[#5d3f3c]">
              Current admin and editorial accounts from the database.
            </p>
          </div>
          <div className="text-xs font-medium text-[#5d3f3c]">
            Showing {users.length} filtered account{users.length === 1 ? '' : 's'}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-[#f5f3f3]/80">
                <th className="px-8 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#5d3f3c]">
                  Name & Account
                </th>
                <th className="px-8 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#5d3f3c]">
                  Role
                </th>
                <th className="px-8 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#5d3f3c]">
                  Status
                </th>
                <th className="px-8 py-4 text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#5d3f3c]">
                  Joined Date
                </th>
                <th className="px-8 py-4 text-right text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-[#5d3f3c]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const initials =
                  user.name
                    ?.split(/\s+/)
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase() || 'YT';
                const status = !user.hashedPassword
                  ? 'Pending setup'
                  : asDate(user.updatedAt) >= sixtyDaysAgo
                    ? 'Active'
                    : 'Quiet';
                const canDelete =
                  user.id !== currentUser.id;

                return (
                  <tr
                    key={user.id}
                    className="group border-t border-[#efeded] transition-colors hover:bg-[#f5f3f3]"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || user.email}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ffdad6] text-sm font-bold text-[#ba0013]">
                            {initials}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-[#1b1c1c]">
                            {user.name || 'Unnamed user'}
                          </p>
                          <p className="text-xs text-[#5d3f3c]">{user.email}</p>
                          <p className="mt-1 text-[0.6875rem] text-[#5d3f3c]">
                            Mongo-managed account
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex rounded-full bg-[#efeded] px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.12em] text-[#5d3f3c]">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`inline-flex items-center gap-2 text-sm font-medium ${
                          status === 'Active'
                            ? 'text-emerald-700'
                            : status === 'Pending setup'
                              ? 'text-[#ba0013]'
                              : 'text-[#5d3f3c]'
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            status === 'Active'
                              ? 'bg-emerald-500'
                              : status === 'Pending setup'
                                ? 'bg-[#ba0013]'
                                : 'bg-[#926f6b]'
                          }`}
                        />
                        {status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-[#5d3f3c]">
                      {asDate(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap justify-end gap-2">
                        <a
                          href={`mailto:${user.email}`}
                          className="inline-flex items-center gap-2 rounded-md bg-[#efeded] px-3 py-2 text-xs font-semibold text-[#1b1c1c] transition-colors hover:bg-[#e4e2e2]"
                        >
                          <Mail className="h-3.5 w-3.5" />
                          Email
                        </a>
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          className="inline-flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-semibold text-[#1b1c1c] transition-colors hover:bg-[#efeded]"
                        >
                          <Shield className="h-3.5 w-3.5" />
                          Edit
                        </Link>
                        {canDelete ? (
                          <form action={deleteUserAction}>
                            <input type="hidden" name="userId" value={user.id} />
                            <button
                              type="submit"
                              className="rounded-md bg-[#fff1ef] px-3 py-2 text-xs font-semibold text-[#93000d] transition-colors hover:bg-[#ffdad6]"
                            >
                              Delete
                            </button>
                          </form>
                        ) : (
                          <span className="inline-flex rounded-md bg-[#f5f3f3] px-3 py-2 text-xs font-semibold text-[#5d3f3c]">
                            Reassign first
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {users.length === 0 ? (
          <div className="px-8 py-10 text-sm text-[#5d3f3c]">
            No users match the current filters yet.
          </div>
        ) : null}
      </section>
    </div>
  );
}
