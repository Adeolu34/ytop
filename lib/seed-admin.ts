type SeedAdminCredentials = {
  email: string;
  password: string;
  name: string;
};

export function resolveSeedAdminCredentials(
  env: NodeJS.ProcessEnv
): SeedAdminCredentials | null {
  const email = env.ADMIN_EMAIL?.trim();
  const password = env.ADMIN_PASSWORD?.trim();
  const name = env.ADMIN_NAME?.trim() || 'Admin User';
  const isProduction = env.NODE_ENV === 'production';

  if (!email && !password) {
    if (isProduction) {
      throw new Error(
        'ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding in production.'
      );
    }

    return null;
  }

  if (!email || !password) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must both be set to seed an admin user.'
    );
  }

  return {
    email,
    password,
    name,
  };
}
