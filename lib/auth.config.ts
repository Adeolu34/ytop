import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

/**
 * Shared Auth.js config without Node-only database imports.
 * Used by middleware (`NextAuth(authConfig)`) so the Edge bundle never loads `pg`/Prisma.
 * Real `authorize` logic lives in `lib/auth.ts`.
 */
const authConfig = {
  // Required behind proxies/platform routers (Render/Netlify) so Auth.js trusts request host headers.
  trustHost: true,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      /** Stub — login uses the full `auth.ts` instance. Middleware only decodes JWT. */
      authorize: async () => null,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/yadmin/login',
    error: '/yadmin/login',
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
