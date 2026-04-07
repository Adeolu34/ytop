'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@/app/generated/prisma';
import prisma from '@/lib/db';
import { checkPermission, requireAuth } from '@/lib/auth-utils';
import { slugifyValue } from '@/lib/admin-crud';
import { createAdminRedirectUrl } from '@/lib/admin-feedback';

export type TeamState = { error: string | null };

const TEAM_PATH = '/admin/team';

const SECTIONS = new Set(['core', 'faculty', 'volunteer', 'community']);

function readString(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === 'string' ? v.trim() : '';
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base || 'member';
  let n = 0;
  while (true) {
    const existing = await prisma.teamMember.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing || existing.id === excludeId) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export async function saveTeamMemberAction(
  _prev: TeamState,
  formData: FormData
): Promise<TeamState> {
  const user = await requireAuth();
  if (!checkPermission(user.role, 'EDITOR')) {
    return { error: 'You do not have permission to manage team members.' };
  }

  const id = readString(formData, 'memberId');
  const name = readString(formData, 'name');
  const position = readString(formData, 'position');
  let slugInput = readString(formData, 'slug');
  const teamSection = readString(formData, 'teamSection') || 'core';
  const bio = readString(formData, 'bio');
  const photoId = readString(formData, 'photoId');
  const email = readString(formData, 'email');
  const phone = readString(formData, 'phone');
  const linkedin = readString(formData, 'linkedin');
  const twitter = readString(formData, 'twitter');
  const facebook = readString(formData, 'facebook');
  const order = Number.parseInt(readString(formData, 'order') || '0', 10);
  const isActive = formData.get('isActive') === 'on';

  if (!name || !position) {
    return { error: 'Name and position are required.' };
  }

  if (!SECTIONS.has(teamSection)) {
    return { error: 'Invalid team section.' };
  }

  const baseSlug = slugifyValue(slugInput || name);
  const slug = await uniqueSlug(baseSlug, id || undefined);

  try {
    const data = {
      name,
      slug,
      position,
      teamSection,
      bio: bio || null,
      photoId: photoId || null,
      email: email || null,
      phone: phone || null,
      linkedin: linkedin || null,
      twitter: twitter || null,
      facebook: facebook || null,
      order: Number.isFinite(order) ? order : 0,
      isActive,
    };

    if (id) {
      await prisma.teamMember.update({
        where: { id },
        data,
      });
    } else {
      await prisma.teamMember.create({ data });
    }

    revalidatePath('/team');
    revalidatePath(TEAM_PATH);
  } catch (error) {
    return { error: getError(error) };
  }

  redirect(
    createAdminRedirectUrl(TEAM_PATH, {
      notice: id ? 'Team member updated.' : 'Team member created.',
    })
  );
}

export async function deleteTeamMemberAction(formData: FormData): Promise<void> {
  const user = await requireAuth();
  if (!checkPermission(user.role, 'EDITOR')) {
    redirect(
      createAdminRedirectUrl(TEAM_PATH, { error: 'Permission denied.' })
    );
  }

  const id = readString(formData, 'memberId');
  if (!id) {
    redirect(createAdminRedirectUrl(TEAM_PATH, { error: 'Missing id.' }));
  }

  await prisma.teamMember.delete({ where: { id } });
  revalidatePath('/team');
  revalidatePath(TEAM_PATH);

  redirect(
    createAdminRedirectUrl(TEAM_PATH, { notice: 'Team member removed.' })
  );
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
