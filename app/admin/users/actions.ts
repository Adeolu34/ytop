'use server';

import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@/app/generated/prisma';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/auth-utils';
import { buildUserDraft } from '@/lib/admin-crud';
import { createAdminRedirectUrl } from '@/lib/admin-feedback';

export type UserEditorState = {
  error: string | null;
};

export const USER_EDITOR_INITIAL_STATE: UserEditorState = {
  error: null,
};

const USER_INDEX_PATH = '/admin/users';

export async function saveUserAction(
  _previousState: UserEditorState,
  formData: FormData
): Promise<UserEditorState> {
  const currentUser = await requireAdmin();
  const userId = readOptionalString(formData, 'userId');

  try {
    const draft = buildUserDraft({
      name: readOptionalString(formData, 'name') || '',
      email: readRequiredString(formData, 'email'),
      role: readRequiredString(formData, 'role'),
      bio: readOptionalString(formData, 'bio') || '',
      image: readOptionalString(formData, 'image') || '',
      password: readOptionalString(formData, 'password') || '',
    });

    if (userId === currentUser.id && draft.role !== 'ADMIN') {
      return { error: 'You cannot remove your own admin access.' };
    }

    const hashedPassword = draft.password
      ? await bcrypt.hash(draft.password, 10)
      : null;

    if (userId) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          name: draft.name,
          email: draft.email,
          role: draft.role,
          bio: draft.bio,
          image: draft.image,
          ...(hashedPassword ? { hashedPassword } : {}),
        },
      });
    } else {
      await prisma.user.create({
        data: {
          name: draft.name,
          email: draft.email,
          role: draft.role,
          bio: draft.bio,
          image: draft.image,
          hashedPassword,
        },
      });
    }

    revalidateUserSurfaces();
  } catch (error) {
    return { error: getUserActionErrorMessage(error) };
  }

  redirect(
    createAdminRedirectUrl(USER_INDEX_PATH, {
      notice: userId ? 'User updated successfully.' : 'User created successfully.',
    })
  );
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const currentUser = await requireAdmin();
  const userId = readRequiredString(formData, 'userId');

  if (userId === currentUser.id) {
    redirect(
      createAdminRedirectUrl(USER_INDEX_PATH, {
        error: 'You cannot delete your own account.',
      })
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      _count: {
        select: {
          posts: true,
          pages: true,
          comments: true,
          mediaUploads: true,
        },
      },
    },
  });

  if (!user) {
    redirect(
      createAdminRedirectUrl(USER_INDEX_PATH, {
        error: 'That user could not be found.',
      })
    );
  }

  if (hasUserDependencies(user._count)) {
    redirect(
      createAdminRedirectUrl(USER_INDEX_PATH, {
        error:
          'This user still owns content or uploads. Reassign their work before deleting the account.',
      })
    );
  }

  await prisma.user.delete({ where: { id: userId } });
  revalidateUserSurfaces();

  redirect(
    createAdminRedirectUrl(USER_INDEX_PATH, {
      notice: 'User deleted successfully.',
    })
  );
}

function hasUserDependencies(counts: {
  posts: number;
  pages: number;
  comments: number;
  mediaUploads: number;
}): boolean {
  return (
    counts.posts > 0 ||
    counts.pages > 0 ||
    counts.comments > 0 ||
    counts.mediaUploads > 0
  );
}

function revalidateUserSurfaces(): void {
  revalidatePath('/admin');
  revalidatePath(USER_INDEX_PATH);
}

function readRequiredString(formData: FormData, key: string): string {
  const value = formData.get(key);

  if (typeof value !== 'string') {
    throw new Error(`${key} is required`);
  }

  return value;
}

function readOptionalString(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === 'string' ? value : null;
}

function getUserActionErrorMessage(error: unknown): string {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    return 'A user with that email already exists.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong while saving this user.';
}
