const POST_STATUS_VALUES = ['DRAFT', 'PUBLISHED', 'SCHEDULED'] as const;
const USER_ROLE_VALUES = ['ADMIN', 'EDITOR', 'AUTHOR', 'SUBSCRIBER'] as const;
const MEDIA_TYPE_VALUES = ['IMAGE', 'VIDEO', 'DOCUMENT', 'OTHER'] as const;

export type PostStatusValue = (typeof POST_STATUS_VALUES)[number];
export type UserRoleValue = (typeof USER_ROLE_VALUES)[number];
export type MediaTypeValue = (typeof MEDIA_TYPE_VALUES)[number];

type PostDraftInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: string;
  authorId: string;
  categories: string;
  tags: string;
  featuredImageId: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  publishedAt: string;
};

type UserDraftInput = {
  name: string;
  email: string;
  role: string;
  bio: string;
  image: string;
  password: string;
};

type MediaDraftInput = {
  altText: string;
  caption: string;
  description: string;
  fileSize: number;
  mimeType: string;
  originalName: string;
};

export type PostDraft = {
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  status: PostStatusValue;
  authorId: string;
  categoryNames: string[];
  tagNames: string[];
  featuredImageId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  publishedAt: Date | null;
};

export type UserDraft = {
  name: string | null;
  email: string;
  role: UserRoleValue;
  bio: string | null;
  image: string | null;
  password: string | null;
};

export type MediaDraft = {
  filename: string;
  originalName: string;
  mimeType: string;
  type: MediaTypeValue;
  fileSize: number;
  altText: string | null;
  caption: string | null;
  description: string | null;
};

export function buildPostDraft(
  raw: PostDraftInput,
  now: Date = new Date()
): PostDraft {
  const title = requireValue(raw.title, 'Post title');
  const content = requireValue(raw.content, 'Post content');
  const authorId = requireValue(raw.authorId, 'Post author');
  const status = parseEnumValue(raw.status, POST_STATUS_VALUES, 'Post status');
  const slug = buildSlug(raw.slug, title);

  return {
    title,
    slug,
    excerpt: optionalValue(raw.excerpt),
    content,
    status,
    authorId,
    categoryNames: splitUniqueValues(raw.categories),
    tagNames: splitUniqueValues(raw.tags),
    featuredImageId: optionalValue(raw.featuredImageId),
    metaTitle: optionalValue(raw.metaTitle),
    metaDescription: optionalValue(raw.metaDescription),
    metaKeywords: optionalValue(raw.metaKeywords),
    publishedAt: resolvePublishedAt(status, raw.publishedAt, now),
  };
}

export function buildUserDraft(raw: UserDraftInput): UserDraft {
  const email = requireValue(raw.email, 'User email').toLowerCase();
  const role = parseEnumValue(raw.role, USER_ROLE_VALUES, 'User role');

  return {
    name: optionalValue(raw.name),
    email,
    role,
    bio: optionalValue(raw.bio),
    image: optionalValue(raw.image),
    password: optionalValue(raw.password),
  };
}

export function buildMediaDraft(raw: MediaDraftInput): MediaDraft {
  const originalName = requireValue(raw.originalName, 'Media file name');
  const mimeType = optionalValue(raw.mimeType) || 'application/octet-stream';

  return {
    filename: sanitizeStoredFilename(originalName),
    originalName,
    mimeType,
    type: resolveMediaType(mimeType, originalName),
    fileSize: normalizeFileSize(raw.fileSize),
    altText: optionalValue(raw.altText),
    caption: optionalValue(raw.caption),
    description: optionalValue(raw.description),
  };
}

export function sanitizeStoredFilename(filename: string): string {
  const trimmedFilename = requireValue(filename, 'Media file name');
  const extension = extractExtension(trimmedFilename);
  const stem = extension
    ? trimmedFilename.slice(0, -(extension.length + 1))
    : trimmedFilename;
  const sanitizedStem = slugifyValue(stem);

  if (!extension) {
    return sanitizedStem;
  }

  return `${sanitizedStem}.${extension}`;
}

export function slugifyValue(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

export function resolveMediaType(
  mimeType: string,
  originalName: string
): MediaTypeValue {
  const normalizedMimeType = mimeType.toLowerCase();

  if (normalizedMimeType.startsWith('image/')) {
    return 'IMAGE';
  }

  if (normalizedMimeType.startsWith('video/')) {
    return 'VIDEO';
  }

  if (
    normalizedMimeType.includes('pdf') ||
    normalizedMimeType.includes('document') ||
    normalizedMimeType.includes('msword') ||
    normalizedMimeType.includes('officedocument')
  ) {
    return 'DOCUMENT';
  }

  const extension = extractExtension(originalName);

  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'avif'].includes(extension)) {
    return 'IMAGE';
  }

  if (['mp4', 'webm', 'mov', 'm4v'].includes(extension)) {
    return 'VIDEO';
  }

  if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(extension)) {
    return 'DOCUMENT';
  }

  return 'OTHER';
}

function buildSlug(rawSlug: string, title: string): string {
  const slug = slugifyValue(optionalValue(rawSlug) || title);

  if (!slug) {
    throw new Error('Post slug is required');
  }

  return slug;
}

function splitUniqueValues(value: string): string[] {
  const uniqueValues = new Set<string>();

  for (const part of value.split(',')) {
    const trimmedPart = part.trim();
    if (!trimmedPart) {
      continue;
    }

    const dedupeKey = trimmedPart.toLowerCase();
    if (uniqueValues.has(dedupeKey)) {
      continue;
    }

    uniqueValues.add(dedupeKey);
  }

  return Array.from(uniqueValues).map((key) =>
    value
      .split(',')
      .map((part) => part.trim())
      .find((part) => part.toLowerCase() === key) as string
  );
}

function resolvePublishedAt(
  status: PostStatusValue,
  rawPublishedAt: string,
  now: Date
): Date | null {
  if (status === 'DRAFT') {
    return null;
  }

  const normalizedPublishedAt = optionalValue(rawPublishedAt);

  if (!normalizedPublishedAt) {
    return status === 'PUBLISHED' ? now : null;
  }

  const parsedPublishedAt = new Date(normalizedPublishedAt);

  if (Number.isNaN(parsedPublishedAt.getTime())) {
    throw new Error('Published date is invalid');
  }

  return parsedPublishedAt;
}

function parseEnumValue<T extends readonly string[]>(
  value: string,
  allowedValues: T,
  label: string
): T[number] {
  const trimmedValue = requireValue(value, label);

  if (allowedValues.includes(trimmedValue as T[number])) {
    return trimmedValue as T[number];
  }

  throw new Error(`${label} is invalid`);
}

function requireValue(value: string, label: string): string {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    throw new Error(`${label} is required`);
  }

  return normalizedValue;
}

function optionalValue(value: string): string | null {
  const normalizedValue = value.trim();
  return normalizedValue ? normalizedValue : null;
}

function normalizeFileSize(fileSize: number): number {
  if (!Number.isFinite(fileSize) || fileSize < 0) {
    throw new Error('Media file size is invalid');
  }

  return Math.round(fileSize);
}

function extractExtension(filename: string): string {
  const normalizedFilename = filename.trim().toLowerCase();
  const filenameParts = normalizedFilename.split('.');
  return filenameParts.length > 1 ? filenameParts.pop() || '' : '';
}
