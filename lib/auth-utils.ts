import { auth } from './auth';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/admin/login');
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') {
    redirect('/admin');
  }
  return user;
}

export function checkPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy: Record<string, number> = {
    SUBSCRIBER: 1,
    AUTHOR: 2,
    EDITOR: 3,
    ADMIN: 4,
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}
