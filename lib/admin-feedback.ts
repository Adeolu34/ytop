export type SearchParamRecord = Record<
  string,
  string | string[] | undefined
>;

export type AdminFlashMessage =
  | {
      type: 'notice' | 'error';
      message: string;
    }
  | null;

export function getSearchParamValue(
  value: string | string[] | undefined
): string | null {
  if (Array.isArray(value)) {
    return value[0] || null;
  }

  return value || null;
}

export function createAdminRedirectUrl(
  pathname: string,
  message: Partial<Record<'notice' | 'error', string>>
): string {
  const searchParams = new URLSearchParams();

  if (message.notice) {
    searchParams.set('notice', message.notice);
  }

  if (message.error) {
    searchParams.set('error', message.error);
  }

  const queryString = searchParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function readAdminFlashMessage(
  searchParams: SearchParamRecord
): AdminFlashMessage {
  const errorMessage = getSearchParamValue(searchParams.error);
  if (errorMessage) {
    return { type: 'error', message: errorMessage };
  }

  const noticeMessage = getSearchParamValue(searchParams.notice);
  if (noticeMessage) {
    return { type: 'notice', message: noticeMessage };
  }

  return null;
}
