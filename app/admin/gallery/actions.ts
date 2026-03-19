'use server';

import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@/app/generated/prisma';
import prisma from '@/lib/db';
import { checkPermission, requireAuth } from '@/lib/auth-utils';
import {
  buildMediaDraft,
  sanitizeStoredFilename,
} from '@/lib/admin-crud';
import { createAdminRedirectUrl } from '@/lib/admin-feedback';

export type MediaEditorState = {
  error: string | null;
};

export const MEDIA_EDITOR_INITIAL_STATE: MediaEditorState = {
  error: null,
};

const GALLERY_INDEX_PATH = '/admin/gallery';

export async function createMediaAction(
  _previousState: MediaEditorState,
  formData: FormData
): Promise<MediaEditorState> {
  const currentUser = await requireAuth();

  if (!checkPermission(currentUser.role, 'AUTHOR')) {
    return { error: 'You do not have permission to upload media.' };
  }

  const fileEntry = formData.get('file');
  if (!(fileEntry instanceof File) || fileEntry.size === 0) {
    return { error: 'Choose a file to upload.' };
  }

  try {
    const mediaDraft = buildMediaDraft({
      altText: readOptionalString(formData, 'altText') || '',
      caption: readOptionalString(formData, 'caption') || '',
      description: readOptionalString(formData, 'description') || '',
      fileSize: fileEntry.size,
      mimeType: fileEntry.type,
      originalName: fileEntry.name,
    });
    const url = await persistUploadedFile(fileEntry, mediaDraft.filename);

    await prisma.media.create({
      data: {
        filename: path.basename(url),
        originalName: mediaDraft.originalName,
        url,
        mimeType: mediaDraft.mimeType,
        fileSize: mediaDraft.fileSize,
        type: mediaDraft.type,
        altText: mediaDraft.altText,
        caption: mediaDraft.caption,
        description: mediaDraft.description,
        width: readOptionalInteger(formData, 'width'),
        height: readOptionalInteger(formData, 'height'),
        uploadedBy: { connect: { id: currentUser.id } },
      },
    });

    revalidateGallerySurfaces();
  } catch (error) {
    return { error: getMediaActionErrorMessage(error) };
  }

  redirect(
    createAdminRedirectUrl(GALLERY_INDEX_PATH, {
      notice: 'Media uploaded successfully.',
    })
  );
}

export async function updateMediaAction(
  _previousState: MediaEditorState,
  formData: FormData
): Promise<MediaEditorState> {
  const currentUser = await requireAuth();

  if (!checkPermission(currentUser.role, 'AUTHOR')) {
    return { error: 'You do not have permission to edit media.' };
  }

  const mediaId = readRequiredString(formData, 'mediaId');

  try {
    await prisma.media.update({
      where: { id: mediaId },
      data: {
        altText: nullableField(formData, 'altText'),
        caption: nullableField(formData, 'caption'),
        description: nullableField(formData, 'description'),
        width: readOptionalInteger(formData, 'width'),
        height: readOptionalInteger(formData, 'height'),
      },
    });

    revalidateGallerySurfaces();
  } catch (error) {
    return { error: getMediaActionErrorMessage(error) };
  }

  redirect(
    createAdminRedirectUrl(GALLERY_INDEX_PATH, {
      notice: 'Media details updated successfully.',
    })
  );
}

export async function deleteMediaAction(formData: FormData): Promise<void> {
  const currentUser = await requireAuth();

  if (!checkPermission(currentUser.role, 'AUTHOR')) {
    redirect(
      createAdminRedirectUrl(GALLERY_INDEX_PATH, {
        error: 'You do not have permission to delete media.',
      })
    );
  }

  const mediaId = readRequiredString(formData, 'mediaId');
  const media = await findMediaForDeletion(mediaId);

  if (!media) {
    redirect(
      createAdminRedirectUrl(GALLERY_INDEX_PATH, {
        error: 'That media item could not be found.',
      })
    );
  }

  const mediaUsageCount = countMediaDependencies(media._count);
  if (mediaUsageCount > 0) {
    redirect(
      createAdminRedirectUrl(GALLERY_INDEX_PATH, {
        error:
          'This media item is still attached to published content. Remove those references before deleting it.',
      })
    );
  }

  await prisma.media.delete({ where: { id: mediaId } });
  await deleteStoredFileIfManaged(media.url);
  revalidateGallerySurfaces();

  redirect(
    createAdminRedirectUrl(GALLERY_INDEX_PATH, {
      notice: 'Media deleted successfully.',
    })
  );
}

export async function deleteSelectedMediaAction(formData: FormData): Promise<void> {
  const currentUser = await requireAuth();

  if (!checkPermission(currentUser.role, 'AUTHOR')) {
    redirect(
      createAdminRedirectUrl(GALLERY_INDEX_PATH, {
        error: 'You do not have permission to delete media.',
      })
    );
  }

  const mediaIds = parseSelectedMediaIds(readOptionalString(formData, 'mediaIds'));

  if (mediaIds.length === 0) {
    redirect(
      createAdminRedirectUrl(GALLERY_INDEX_PATH, {
        error: 'Select at least one item to delete.',
      })
    );
  }

  const mediaItems = await prisma.media.findMany({
    where: { id: { in: mediaIds } },
    select: {
      id: true,
      url: true,
      _count: {
        select: {
          posts: true,
          teamMembers: true,
          testimonials: true,
          programs: true,
          events: true,
          campaigns: true,
        },
      },
    },
  });

  if (mediaItems.length !== mediaIds.length) {
    redirect(
      createAdminRedirectUrl(GALLERY_INDEX_PATH, {
        error: 'One or more selected media items could not be found.',
      })
    );
  }

  const blockedItem = mediaItems.find(
    (mediaItem) => countMediaDependencies(mediaItem._count) > 0
  );

  if (blockedItem) {
    redirect(
      createAdminRedirectUrl(GALLERY_INDEX_PATH, {
        error:
          'One of the selected media items is still attached to content. Remove those references before deleting it.',
      })
    );
  }

  await prisma.media.deleteMany({
    where: { id: { in: mediaIds } },
  });

  await Promise.all(mediaItems.map((mediaItem) => deleteStoredFileIfManaged(mediaItem.url)));
  revalidateGallerySurfaces();

  redirect(
    createAdminRedirectUrl(GALLERY_INDEX_PATH, {
      notice:
        mediaIds.length === 1
          ? 'Media deleted successfully.'
          : `${mediaIds.length} media items deleted successfully.`,
    })
  );
}

async function findMediaForDeletion(mediaId: string) {
  return prisma.media.findUnique({
    where: { id: mediaId },
    select: {
      url: true,
      _count: {
        select: {
          posts: true,
          teamMembers: true,
          testimonials: true,
          programs: true,
          events: true,
          campaigns: true,
        },
      },
    },
  });
}

function countMediaDependencies(counts: {
  posts: number;
  teamMembers: number;
  testimonials: number;
  programs: number;
  events: number;
  campaigns: number;
}): number {
  return (
    counts.posts +
    counts.teamMembers +
    counts.testimonials +
    counts.programs +
    counts.events +
    counts.campaigns
  );
}

async function persistUploadedFile(
  file: File,
  suggestedFilename: string
): Promise<string> {
  const uploadDirectory = path.join(process.cwd(), 'public', 'uploads', 'admin');
  await mkdir(uploadDirectory, { recursive: true });

  const uniqueFilename = `${Date.now()}-${sanitizeStoredFilename(suggestedFilename)}`;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const destinationPath = path.join(uploadDirectory, uniqueFilename);

  await writeFile(destinationPath, fileBuffer);

  return `/uploads/admin/${uniqueFilename}`;
}

async function deleteStoredFileIfManaged(url: string): Promise<void> {
  if (!url.startsWith('/uploads/admin/')) {
    return;
  }

  const filePath = path.join(process.cwd(), 'public', ...url.split('/').filter(Boolean));

  try {
    await unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

function parseSelectedMediaIds(value: string | null): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function nullableField(formData: FormData, key: string): string | null {
  const value = readOptionalString(formData, key);
  return value?.trim() ? value.trim() : null;
}

function readOptionalInteger(formData: FormData, key: string): number | null {
  const value = readOptionalString(formData, key);

  if (!value?.trim()) {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    throw new Error(`${key} must be a positive number`);
  }

  return parsedValue;
}

function revalidateGallerySurfaces(): void {
  revalidatePath('/admin');
  revalidatePath(GALLERY_INDEX_PATH);
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

function getMediaActionErrorMessage(error: unknown): string {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2025'
  ) {
    return 'That media item could not be found.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong while saving this media item.';
}
