import { auth } from './auth';
import { redirect } from 'next/navigation';

type AuthenticatedUser = {
  id: string;
  role: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();
  if (!user?.id || !user.role) {
    redirect('/admin/login');
  }

  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    image: user.image,
  };
}

export async function requireAdmin(): Promise<AuthenticatedUser> {
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
