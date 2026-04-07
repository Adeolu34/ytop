'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@/app/generated/prisma';
import prisma from '@/lib/db';
import { checkPermission, requireAuth } from '@/lib/auth-utils';
import { slugifyValue } from '@/lib/admin-crud';
import { createAdminRedirectUrl } from '@/lib/admin-feedback';

export type ProgramState = { error: string | null };

const PROG_PATH = '/admin/programs';

function readString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

async function uniqueProgramSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base || 'program';
  let n = 0;
  while (true) {
    const existing = await prisma.program.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
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
  const slug = await uniqueProgramSlug(baseSlug, id || undefined);

  try {
    const data = {
      title,
      slug,
      description,
      shortDesc: shortDesc || null,
      imageId: imageId || null,
      sdgGoals,
      order: Number.isFinite(order) ? order : 0,
      isActive,
    };

    if (id) {
      await prisma.program.update({ where: { id }, data });
    } else {
      await prisma.program.create({ data });
    }

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

  await prisma.program.delete({ where: { id } });
  revalidatePath('/programs');
  revalidatePath(PROG_PATH);

  redirect(createAdminRedirectUrl(PROG_PATH, { notice: 'Program deleted.' }));
}

function getError(error: unknown): string {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    return 'Slug must be unique.';
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong.';
}
