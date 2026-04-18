'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { checkPermission, requireAuth } from '@/lib/auth-utils';
import { slugifyValue } from '@/lib/admin-crud';
import { createAdminRedirectUrl } from '@/lib/admin-feedback';
import { isMongoDuplicateKeyError } from '@/lib/mongo-media';
import {
  mongoProgramDelete,
  mongoProgramUniqueSlug,
  mongoProgramUpsert,
} from '@/lib/mongo-program-store';

export type ProgramState = { error: string | null };

const PROG_PATH = '/admin/programs';

function readString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

export async function saveProgramAction(
  _prev: ProgramState,
  formData: FormData
): Promise<ProgramState> {
  const user = await requireAuth();
  if (!checkPermission(user.role, 'EDITOR')) {
    return { error: 'You do not have permission to manage programs.' };
  }

  const id = readString(formData, 'programId');
  const title = readString(formData, 'title');
  let slugInput = readString(formData, 'slug');
  const description = readString(formData, 'description');
  const shortDesc = readString(formData, 'shortDesc');
  const imageId = readString(formData, 'imageId');
  const sdgRaw = readString(formData, 'sdgGoals');
  const order = Number.parseInt(readString(formData, 'order') || '0', 10);
  const isActive = formData.get('isActive') === 'on';

  if (!title || !description) {
    return { error: 'Title and description are required.' };
  }

  const sdgGoals = sdgRaw
    ? sdgRaw
        .split(/[,\s]+/)
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const baseSlug = slugifyValue(slugInput || title);
  const slug = await mongoProgramUniqueSlug(baseSlug, id || undefined);

  try {
    await mongoProgramUpsert({
      id: id || undefined,
      title,
      slug,
      description,
      shortDesc: shortDesc || null,
      imageId: imageId || null,
      sdgGoals,
      order: Number.isFinite(order) ? order : 0,
      isActive,
    });

    revalidatePath('/programs');
    revalidatePath(PROG_PATH);
  } catch (error) {
    return { error: getError(error) };
  }

  redirect(
    createAdminRedirectUrl(PROG_PATH, {
      notice: id ? 'Program updated.' : 'Program created.',
    })
  );
}

export async function deleteProgramAction(formData: FormData): Promise<void> {
  const user = await requireAuth();
  if (!checkPermission(user.role, 'EDITOR')) {
    redirect(
      createAdminRedirectUrl(PROG_PATH, { error: 'Permission denied.' })
    );
  }

  const id = readString(formData, 'programId');
  if (!id) {
    redirect(createAdminRedirectUrl(PROG_PATH, { error: 'Missing id.' }));
  }

  await mongoProgramDelete(id);
  revalidatePath('/programs');
  revalidatePath(PROG_PATH);

  redirect(createAdminRedirectUrl(PROG_PATH, { notice: 'Program deleted.' }));
}

function getError(error: unknown): string {
  if (isMongoDuplicateKeyError(error)) {
    return 'Slug must be unique.';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
}
