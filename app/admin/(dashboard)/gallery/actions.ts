'use server';

import { randomUUID } from 'crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { checkPermission, requireAuth } from '@/lib/auth-utils';
import {
  buildMediaDraft,
  sanitizeStoredFilename,
} from '@/lib/admin-crud';
import {
  isCloudinaryConfigured,
  uploadBufferToCloudinary,
  destroyCloudinaryAsset,
} from '@/lib/cloudinary';
import { createAdminRedirectUrl } from '@/lib/admin-feedback';
import { countMongoMediaReferences } from '@/lib/mongo-media-usage';
import {
  mongoMediaDelete,
  mongoMediaDeleteMany,
  mongoMediaFindById,
  mongoMediaInsert,
  mongoMediaSetFolderMany,
  mongoMediaUpdate,
} from '@/lib/mongo-media';

type MediaEditorState = {
  error: string | null;
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
    const persisted = await persistUploadedFile(fileEntry, mediaDraft.filename);

    await mongoMediaInsert({
      id: randomUUID(),
      filename: mediaDraft.filename,
      originalName: mediaDraft.originalName,
      url: persisted.url,
      thumbnailUrl: null,
      mimeType: mediaDraft.mimeType,
      fileSize: mediaDraft.fileSize,
      type: mediaDraft.type,
      width:
        readOptionalInteger(formData, 'width') ??
        persisted.width ??
        null,
      height:
        readOptionalInteger(formData, 'height') ??
        persisted.height ??
        null,
      altText: mediaDraft.altText,
      caption: mediaDraft.caption,
      description: mediaDraft.description,
      wordpressId: null,
      cloudinaryPublicId: persisted.cloudinaryPublicId,
      folder: normalizeFolderField(formData, 'folder'),
      uploadedById: currentUser.id,
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
    await mongoMediaUpdate(mediaId, {
      altText: nullableField(formData, 'altText'),
      caption: nullableField(formData, 'caption'),
      description: nullableField(formData, 'description'),
      folder: normalizeFolderField(formData, 'folder'),
      width: readOptionalInteger(formData, 'width'),
      height: readOptionalInteger(formData, 'height'),
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

  if (media.usage > 0) {
    redirect(
      createAdminRedirectUrl(GALLERY_INDEX_PATH, {
        error:
          'This media item is still attached to published content. Remove those references before deleting it.',
      })
    );
  }

  await mongoMediaDelete(mediaId);
  await deleteStoredAsset({
    url: media.url,
    cloudinaryPublicId: media.cloudinaryPublicId,
  });
  revalidateGallerySurfaces();

  redirect(
    createAdminRedirectUrl(GALLERY_INDEX_PATH, {
      notice: 'Media deleted successfully.',
    })
  );
}

export async function moveSelectedMediaToFolderAction(
  formData: FormData
): Promise<void> {
  const currentUser = await requireAuth();

  if (!checkPermission(currentUser.role, 'AUTHOR')) {
    redirect(
      createAdminRedirectUrl(GALLERY_INDEX_PATH, {
        error: 'You do not have permission to move media.',
      })
    );
  }

  const mediaIds = parseSelectedMediaIds(readOptionalString(formData, 'mediaIds'));
  const targetFolderRaw = readOptionalString(formData, 'targetFolder');

  if (mediaIds.length === 0) {
    redirect(
      createAdminRedirectUrl(GALLERY_INDEX_PATH, {
        error: 'Select at least one item to move.',
      })
    );
  }

  const folder =
    targetFolderRaw == null || targetFolderRaw.trim() === ''
      ? null
      : targetFolderRaw.trim();

  await mongoMediaSetFolderMany(mediaIds, folder);

  revalidateGallerySurfaces();

  redirect(
    createAdminRedirectUrl(GALLERY_INDEX_PATH, {
      notice:
        mediaIds.length === 1
          ? 'Moved 1 item to the selected folder.'
          : `Moved ${mediaIds.length} items to the selected folder.`,
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

  const mediaItems = (
    await Promise.all(
      mediaIds.map(async (id) => {
        const doc = await mongoMediaFindById(id);
        if (!doc) return null;
        const usage = await countMongoMediaReferences(id);
        return {
          id: doc.id,
          url: doc.url,
          cloudinaryPublicId: doc.cloudinaryPublicId,
          usage,
        };
      })
    )
  ).filter(
    (m): m is { id: string; url: string; cloudinaryPublicId: string | null; usage: number } =>
      m != null
  );

  if (mediaItems.length !== mediaIds.length) {
    redirect(
      createAdminRedirectUrl(GALLERY_INDEX_PATH, {
        error: 'One or more selected media items could not be found.',
      })
    );
  }

  const blockedItem = mediaItems.find((mediaItem) => mediaItem.usage > 0);

  if (blockedItem) {
    redirect(
      createAdminRedirectUrl(GALLERY_INDEX_PATH, {
        error:
          'One of the selected media items is still attached to content. Remove those references before deleting it.',
      })
    );
  }

  await mongoMediaDeleteMany(mediaIds);

  await Promise.all(
    mediaItems.map((mediaItem) =>
      deleteStoredAsset({
        url: mediaItem.url,
        cloudinaryPublicId: mediaItem.cloudinaryPublicId,
      })
    )
  );
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
  const doc = await mongoMediaFindById(mediaId);
  if (!doc) return null;
  const usage = await countMongoMediaReferences(mediaId);
  return {
    url: doc.url,
    cloudinaryPublicId: doc.cloudinaryPublicId,
    usage,
  };
}

type PersistedUpload = {
  url: string;
  cloudinaryPublicId: string | null;
  width?: number | null;
  height?: number | null;
};

async function persistUploadedFile(
  file: File,
  suggestedFilename: string
): Promise<PersistedUpload> {
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  if (isCloudinaryConfigured()) {
    const safeStem = `${Date.now()}-${sanitizeStoredFilename(suggestedFilename)}`;
    const publicId = safeStem.replace(/[^a-zA-Z0-9_-]/g, '_');
    const uploaded = await uploadBufferToCloudinary(fileBuffer, {
      publicId,
    });
    return {
      url: uploaded.secureUrl,
      cloudinaryPublicId: uploaded.publicId,
      width: uploaded.width ?? null,
      height: uploaded.height ?? null,
    };
  }

  const uploadDirectory = path.join(process.cwd(), 'public', 'uploads', 'admin');
  await mkdir(uploadDirectory, { recursive: true });

  const uniqueFilename = `${Date.now()}-${sanitizeStoredFilename(suggestedFilename)}`;
  const destinationPath = path.join(uploadDirectory, uniqueFilename);

  await writeFile(destinationPath, fileBuffer);

  return {
    url: `/uploads/admin/${uniqueFilename}`,
    cloudinaryPublicId: null,
  };
}

async function deleteStoredAsset(media: {
  url: string;
  cloudinaryPublicId: string | null;
}): Promise<void> {
  if (media.cloudinaryPublicId && isCloudinaryConfigured()) {
    await destroyCloudinaryAsset(media.cloudinaryPublicId);
    return;
  }

  if (!media.url.startsWith('/uploads/admin/')) {
    return;
  }

  const filePath = path.join(
    process.cwd(),
    'public',
    ...media.url.split('/').filter(Boolean)
  );

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

function normalizeFolderField(formData: FormData, key: string): string | null {
  const value = readOptionalString(formData, key);
  if (!value?.trim()) {
    return null;
  }
  return value.trim();
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
  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong while saving this media item.';
}
