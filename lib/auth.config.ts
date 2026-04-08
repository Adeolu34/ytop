import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * Shared Auth.js config without Prisma/Node-only imports.
 * Used by middleware (`NextAuth(authConfig)`) so the Edge bundle never loads `pg`/Prisma.
 * Real `authorize` + adapter live in `lib/auth.ts`.
 */
const authConfig = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      /** Stub — login uses the full `auth.ts` instance with Prisma. Middleware only decodes JWT. */
      authorize: async () => null,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export default authConfig;
