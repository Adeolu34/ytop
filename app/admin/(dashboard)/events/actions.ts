'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-utils';
import { createAdminRedirectUrl } from '@/lib/admin-feedback';
import {
  readCheckbox,
  readDate,
  readHttpsUrl,
  readImageUrl,
  readNumber,
  readOptionalText,
  readText,
} from '@/lib/admin-form';
import { mongoEventDelete, mongoEventUpsert } from '@/lib/mongo-events-store';

const INDEX_PATH = '/admin/events';

export async function saveEventAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = readOptionalText(formData, 'id', 80);
  const title = readText(formData, 'title', 200);
  const description = readText(formData, 'description', 5000);
  const startDate = readDate(formData, 'startDate');
  const endDate = readDate(formData, 'endDate');

  if (!title || !description || !startDate) {
    redirect(
      createAdminRedirectUrl(INDEX_PATH, {
        error: 'Title, description and start date are required.',
      })
    );
  }
  if (endDate && endDate < startDate) {
    redirect(createAdminRedirectUrl(INDEX_PATH, { error: 'The end date is before the start date.' }));
  }

  await mongoEventUpsert(id, {
    title,
    description,
    startDate,
    endDate,
    location: readOptionalText(formData, 'location', 300),
    isOnline: readCheckbox(formData, 'isOnline'),
    registrationUrl: readHttpsUrl(formData, 'registrationUrl'),
    imageUrl: readImageUrl(formData, 'imageUrl'),
    maxParticipants: readNumber(formData, 'maxParticipants'),
    speakers: readOptionalText(formData, 'speakers', 500),
    programmeName: readOptionalText(formData, 'programmeName', 200),
  });

  revalidatePath('/events');
  revalidatePath('/');
  redirect(createAdminRedirectUrl(INDEX_PATH, { notice: id ? 'Event updated.' : 'Event created.' }));
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = readText(formData, 'id', 80);
  if (id) await mongoEventDelete(id);
  revalidatePath('/events');
  revalidatePath('/');
  redirect(createAdminRedirectUrl(INDEX_PATH, { notice: 'Event deleted.' }));
}
