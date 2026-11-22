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
import { mongoCampaignDelete, mongoCampaignUpsert } from '@/lib/mongo-campaigns-store';

const INDEX_PATH = '/admin/campaigns';

export async function saveCampaignAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = readOptionalText(formData, 'id', 80);
  const title = readText(formData, 'title', 200);
  const description = readText(formData, 'description', 3000);
  const goalAmount = readNumber(formData, 'goalAmount');
  const raisedAmount = readNumber(formData, 'raisedAmount') ?? 0;
  const startDate = readDate(formData, 'startDate');
  const endDate = readDate(formData, 'endDate');
  const currency = readText(formData, 'currency', 3).toUpperCase() || 'NGN';

  if (!title || !description || !goalAmount || goalAmount <= 0 || !startDate || !endDate) {
    redirect(
      createAdminRedirectUrl(INDEX_PATH, {
        error: 'Title, description, a goal above zero, and start and end dates are required.',
      })
    );
  }
  if (raisedAmount < 0) {
    redirect(createAdminRedirectUrl(INDEX_PATH, { error: 'Amount raised cannot be negative.' }));
  }
  if (endDate < startDate) {
    redirect(createAdminRedirectUrl(INDEX_PATH, { error: 'The end date is before the start date.' }));
  }

  await mongoCampaignUpsert(id, {
    title,
    description,
    goalAmount,
    raisedAmount,
    currency,
    startDate,
    endDate,
    isActive: readCheckbox(formData, 'isActive'),
    imageUrl: readImageUrl(formData, 'imageUrl'),
    paymentUrl: readHttpsUrl(formData, 'paymentUrl'),
  });

  revalidatePath('/donate');
  redirect(createAdminRedirectUrl(INDEX_PATH, { notice: id ? 'Campaign updated.' : 'Campaign created.' }));
}

export async function deleteCampaignAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = readText(formData, 'id', 80);
  if (id) await mongoCampaignDelete(id);
  revalidatePath('/donate');
  redirect(createAdminRedirectUrl(INDEX_PATH, { notice: 'Campaign deleted.' }));
}
