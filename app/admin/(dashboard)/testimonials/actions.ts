'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-utils';
import { createAdminRedirectUrl } from '@/lib/admin-feedback';
import {
  readCheckbox,
  readImageUrl,
  readNumber,
  readOptionalText,
  readText,
} from '@/lib/admin-form';
import { mongoTestimonialDelete, mongoTestimonialUpsert } from '@/lib/mongo-testimonials-store';

const INDEX_PATH = '/admin/testimonials';

function revalidateTestimonialSurfaces() {
  revalidatePath('/');
  revalidatePath('/impact/stories');
}

export async function saveTestimonialAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = readOptionalText(formData, 'id', 80);
  const name = readText(formData, 'name', 150);
  const content = readText(formData, 'content', 4000);

  if (!name || !content) {
    redirect(createAdminRedirectUrl(INDEX_PATH, { error: 'Name and the story text are required.' }));
  }
  if (!readCheckbox(formData, 'consent')) {
    redirect(
      createAdminRedirectUrl(INDEX_PATH, {
        error: 'Confirm that this person agreed to be named and quoted before saving.',
      })
    );
  }

  await mongoTestimonialUpsert(id, {
    name,
    content,
    position: readOptionalText(formData, 'position', 200),
    company: readOptionalText(formData, 'company', 200),
    photoUrl: readImageUrl(formData, 'photoUrl'),
    isFeatured: readCheckbox(formData, 'isFeatured'),
    order: readNumber(formData, 'order') ?? 0,
  });

  revalidateTestimonialSurfaces();
  redirect(createAdminRedirectUrl(INDEX_PATH, { notice: id ? 'Story updated.' : 'Story added.' }));
}

export async function deleteTestimonialAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = readText(formData, 'id', 80);
  if (id) await mongoTestimonialDelete(id);
  revalidateTestimonialSurfaces();
  redirect(createAdminRedirectUrl(INDEX_PATH, { notice: 'Story deleted.' }));
}
