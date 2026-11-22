'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth-utils';
import { createAdminRedirectUrl } from '@/lib/admin-feedback';
import { mongoFormSubmissionSetState } from '@/lib/mongo-forms-store';

const INDEX_PATH = '/admin/enquiries';

export async function updateEnquiryAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = String(formData.get('id') ?? '').trim();
  const intent = String(formData.get('intent') ?? '');
  const allowed = ['read', 'unread', 'processed', 'reopen'];

  if (!id || !allowed.includes(intent)) {
    redirect(createAdminRedirectUrl(INDEX_PATH, { error: 'That update was not valid.' }));
  }

  const state =
    intent === 'read'
      ? { isRead: true }
      : intent === 'unread'
        ? { isRead: false }
        : intent === 'processed'
          ? { isRead: true, isProcessed: true }
          : { isProcessed: false };

  const found = await mongoFormSubmissionSetState(id, state);
  if (!found) {
    redirect(createAdminRedirectUrl(INDEX_PATH, { error: 'That enquiry could not be found.' }));
  }

  revalidatePath(INDEX_PATH);
  redirect(createAdminRedirectUrl(INDEX_PATH, { notice: 'Enquiry updated.' }));
}
