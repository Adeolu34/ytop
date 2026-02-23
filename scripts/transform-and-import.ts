/**
 * WordPress to Prisma Data Transformation and Import Script
 *
 * Transforms WordPress exports to Prisma models and imports to PostgreSQL
 *
 * Usage: npm run import-wordpress
 *
 * Prerequisites:
 * 1. Run wordpress-exporter.js to create exports
 * 2. Set up DATABASE_URL in .env
 * 3. Run prisma migrate dev
 */

import { PrismaClient, PostStatus, UserRole, MediaType, FormType } from '@/app/generated/prisma';
import * as fs from 'fs-extra';
import * as path from 'path';
import { decode } from 'html-entities';

const prisma = new PrismaClient();

const EXPORTS_DIR = path.join(__dirname, '..', 'exports');

interface WordPressPost {
  id: number;
  date: string;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  yoast_head_json?: {
    title?: string;
    description?: string;
    keywords?: string;
  };
}

interface WordPressPage {
  id: number;
  date: string;
  slug: string;
  status: string;
  title: { rendered: string };
  content: { rendered: string };
  author: number;
  parent: number;
  menu_order: number;
  yoast_head_json?: {
    title?: string;
    description?: string;
  };
}

interface WordPressMedia {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  source_url: string;
  alt_text: string;
  caption: { rendered: string };
  description: { rendered: string };
  mime_type: string;
  media_details?: {
    width?: number;
    height?: number;
    filesize?: number;
  };
}

interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface WordPressTag {
  id: number;
  name: string;
  slug: string;
}

interface WordPressUser {
  id: number;
  name: string;
  email: string;
  description: string;
  avatar_urls?: { [key: string]: string };
}

interface WordPressComment {
  id: number;
  post: number;
  parent: number;
  author: number;
  author_name: string;
  author_email: string;
  date: string;
  content: { rendered: string };
  status: string;
}

// ID mapping objects
const idMappings = {
  users: new Map<number, string>(),
  posts: new Map<number, string>(),
  pages: new Map<number, string>(),
  categories: new Map<number, string>(),
  tags: new Map<number, string>(),
  media: new Map<number, string>(),
  comments: new Map<number, string>(),
};

/**
 * Clean HTML content
 */
function cleanHtmlContent(html: string): string {
  if (!html) return '';

  let cleaned = html;

  // Remove Elementor-specific markup
  cleaned = cleaned.replace(/<div[^>]*class="[^"]*elementor[^"]*"[^>]*>.*?<\/div>/gis, '');

  // Remove empty paragraphs
  cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '');

  // Remove WordPress shortcodes (basic)
  cleaned = cleaned.replace(/\[([^\]]+)\]/g, '');

  // Decode HTML entities
  cleaned = decode(cleaned);

  return cleaned.trim();
}

/**
 * Convert WordPress status to Prisma PostStatus
 */
function convertStatus(wpStatus: string): PostStatus {
  switch (wpStatus) {
    case 'publish':
      return 'PUBLISHED';
    case 'draft':
      return 'DRAFT';
    case 'future':
      return 'SCHEDULED';
    default:
      return 'DRAFT';
  }
}

/**
 * Determine media type from MIME type
 */
function getMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith('image/')) return 'IMAGE';
  if (mimeType.startsWith('video/')) return 'VIDEO';
  if (mimeType.includes('pdf') || mimeType.includes('document')) return 'DOCUMENT';
  return 'OTHER';
}

/**
 * Load JSON file
 */
async function loadExport<T>(filename: string): Promise<T[]> {
  const filepath = path.join(EXPORTS_DIR, filename);
  if (!(await fs.pathExists(filepath))) {
    console.warn(`Warning: ${filename} not found, skipping.`);
    return [];
  }
  return await fs.readJSON(filepath);
}

/**
 * Import Users
 */
async function importUsers() {
  console.log('\n[1/7] Importing Users...');
  const wpUsers = await loadExport<WordPressUser>('users.json');

  for (const wpUser of wpUsers) {
    try {
      const user = await prisma.user.create({
        data: {
          email: wpUser.email || `user${wpUser.id}@ytopglobal.org`,
          name: wpUser.name,
          bio: wpUser.description || null,
          role: wpUser.id === 1 ? UserRole.ADMIN : UserRole.AUTHOR,
          image: wpUser.avatar_urls?.['96'] || null,
        },
      });

      idMappings.users.set(wpUser.id, user.id);
      console.log(`  ✓ Created user: ${user.name} (WP ID: ${wpUser.id} → ${user.id})`);
    } catch (error: any) {
      console.error(`  ✗ Failed to create user ${wpUser.name}:`, error.message);
    }
  }

  console.log(`  Imported ${idMappings.users.size}/${wpUsers.length} users`);
}

/**
 * Import Categories
 */
async function importCategories() {
  console.log('\n[2/7] Importing Categories...');
  const wpCategories = await loadExport<WordPressCategory>('categories.json');

  for (const wpCat of wpCategories) {
    try {
      // Skip "Uncategorized"
      if (wpCat.slug === 'uncategorized') {
        console.log(`  ⊘ Skipped: Uncategorized`);
        continue;
      }

      const category = await prisma.category.create({
        data: {
          name: wpCat.name,
          slug: wpCat.slug,
          description: wpCat.description || null,
        },
      });

      idMappings.categories.set(wpCat.id, category.id);
      console.log(`  ✓ Created category: ${category.name}`);
    } catch (error: any) {
      console.error(`  ✗ Failed to create category ${wpCat.name}:`, error.message);
    }
  }

  console.log(`  Imported ${idMappings.categories.size}/${wpCategories.length} categories`);
}

/**
 * Import Tags
 */
async function importTags() {
  console.log('\n[3/7] Importing Tags...');
  const wpTags = await loadExport<WordPressTag>('tags.json');

  for (const wpTag of wpTags) {
    try {
      const tag = await prisma.tag.create({
        data: {
          name: wpTag.name,
          slug: wpTag.slug,
        },
      });

      idMappings.tags.set(wpTag.id, tag.id);
      console.log(`  ✓ Created tag: ${tag.name}`);
    } catch (error: any) {
      console.error(`  ✗ Failed to create tag ${wpTag.name}:`, error.message);
    }
  }

  console.log(`  Imported ${idMappings.tags.size}/${wpTags.length} tags`);
}

/**
 * Import Media
 */
async function importMedia() {
  console.log('\n[4/7] Importing Media...');
  const wpMedia = await loadExport<WordPressMedia>('media.json');

  for (const wpMed of wpMedia) {
    try {
      const filename = path.basename(wpMed.source_url.split('?')[0]);
      const date = new Date(wpMed.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');

      // New media URL (relative to /media directory)
      const newUrl = `/media/${year}/${month}/${filename}`;

      const media = await prisma.media.create({
        data: {
          filename: filename,
          originalName: wpMed.title?.rendered || filename,
          url: newUrl,
          thumbnailUrl: newUrl, // Could generate thumbnails later
          mimeType: wpMed.mime_type,
          fileSize: wpMed.media_details?.filesize || 0,
          type: getMediaType(wpMed.mime_type),
          width: wpMed.media_details?.width || null,
          height: wpMed.media_details?.height || null,
          altText: wpMed.alt_text || null,
          caption: cleanHtmlContent(wpMed.caption?.rendered || ''),
          description: cleanHtmlContent(wpMed.description?.rendered || ''),
          wordpressId: wpMed.id,
        },
      });

      idMappings.media.set(wpMed.id, media.id);
      console.log(`  ✓ Created media: ${filename} (WP ID: ${wpMed.id})`);
    } catch (error: any) {
      console.error(`  ✗ Failed to create media ${wpMed.id}:`, error.message);
    }
  }

  console.log(`  Imported ${idMappings.media.size}/${wpMedia.length} media files`);
}

/**
 * Import Posts
 */
async function importPosts() {
  console.log('\n[5/7] Importing Posts...');
  const wpPosts = await loadExport<WordPressPost>('posts.json');

  for (const wpPost of wpPosts) {
    try {
      const authorId = idMappings.users.get(wpPost.author);
      if (!authorId) {
        console.warn(`  ⚠ Post ${wpPost.id}: Author ${wpPost.author} not found, skipping`);
        continue;
      }

      // Get category IDs
      const categoryIds = wpPost.categories
        .map(catId => idMappings.categories.get(catId))
        .filter(Boolean) as string[];

      // Get tag IDs
      const tagIds = wpPost.tags
        .map(tagId => idMappings.tags.get(tagId))
        .filter(Boolean) as string[];

      // Get featured image ID
      const featuredImageId = wpPost.featured_media
        ? idMappings.media.get(wpPost.featured_media)
        : undefined;

      const post = await prisma.post.create({
        data: {
          title: cleanHtmlContent(wpPost.title.rendered),
          slug: wpPost.slug,
          excerpt: cleanHtmlContent(wpPost.excerpt?.rendered || ''),
          content: cleanHtmlContent(wpPost.content.rendered),
          status: convertStatus(wpPost.status),
          authorId: authorId,
          featuredImageId: featuredImageId || null,
          metaTitle: wpPost.yoast_head_json?.title || null,
          metaDescription: wpPost.yoast_head_json?.description || null,
          metaKeywords: wpPost.yoast_head_json?.keywords || null,
          publishedAt: wpPost.status === 'publish' ? new Date(wpPost.date) : null,
          createdAt: new Date(wpPost.date),
          categories: {
            connect: categoryIds.map(id => ({ id })),
          },
          tags: {
            connect: tagIds.map(id => ({ id })),
          },
        },
      });

      idMappings.posts.set(wpPost.id, post.id);
      console.log(`  ✓ Created post: ${post.title} (WP ID: ${wpPost.id})`);
    } catch (error: any) {
      console.error(`  ✗ Failed to create post ${wpPost.id}:`, error.message);
    }
  }

  console.log(`  Imported ${idMappings.posts.size}/${wpPosts.length} posts`);
}

/**
 * Import Pages
 */
async function importPages() {
  console.log('\n[6/7] Importing Pages...');
  const wpPages = await loadExport<WordPressPage>('pages.json');

  // First pass: create all pages without parent relationship
  for (const wpPage of wpPages) {
    try {
      const authorId = idMappings.users.get(wpPage.author);
      if (!authorId) {
        console.warn(`  ⚠ Page ${wpPage.id}: Author ${wpPage.author} not found, skipping`);
        continue;
      }

      const page = await prisma.page.create({
        data: {
          title: cleanHtmlContent(wpPage.title.rendered),
          slug: wpPage.slug,
          content: cleanHtmlContent(wpPage.content.rendered),
          status: convertStatus(wpPage.status),
          authorId: authorId,
          metaTitle: wpPage.yoast_head_json?.title || null,
          metaDescription: wpPage.yoast_head_json?.description || null,
          order: wpPage.menu_order || 0,
          publishedAt: wpPage.status === 'publish' ? new Date(wpPage.date) : null,
          createdAt: new Date(wpPage.date),
        },
      });

      idMappings.pages.set(wpPage.id, page.id);
      console.log(`  ✓ Created page: ${page.title} (WP ID: ${wpPage.id})`);
    } catch (error: any) {
      console.error(`  ✗ Failed to create page ${wpPage.id}:`, error.message);
    }
  }

  // Second pass: update parent relationships
  for (const wpPage of wpPages) {
    if (wpPage.parent && wpPage.parent !== 0) {
      const pageId = idMappings.pages.get(wpPage.id);
      const parentId = idMappings.pages.get(wpPage.parent);

      if (pageId && parentId) {
        try {
          await prisma.page.update({
            where: { id: pageId },
            data: { parentId: parentId },
          });
          console.log(`  ✓ Updated page hierarchy: ${wpPage.id} → parent ${wpPage.parent}`);
        } catch (error: any) {
          console.error(`  ✗ Failed to update page hierarchy:`, error.message);
        }
      }
    }
  }

  console.log(`  Imported ${idMappings.pages.size}/${wpPages.length} pages`);
}

/**
 * Import Comments
 */
async function importComments() {
  console.log('\n[7/7] Importing Comments...');
  const wpComments = await loadExport<WordPressComment>('comments.json');

  // First pass: create all comments without parent relationship
  for (const wpComment of wpComments) {
    try {
      const postId = idMappings.posts.get(wpComment.post);
      if (!postId) {
        console.warn(`  ⚠ Comment ${wpComment.id}: Post ${wpComment.post} not found, skipping`);
        continue;
      }

      const authorId = wpComment.author !== 0 ? idMappings.users.get(wpComment.author) : undefined;

      const comment = await prisma.comment.create({
        data: {
          content: cleanHtmlContent(wpComment.content.rendered),
          postId: postId,
          authorId: authorId || null,
          authorName: !authorId ? wpComment.author_name : null,
          authorEmail: !authorId ? wpComment.author_email : null,
          isApproved: wpComment.status === 'approved',
          createdAt: new Date(wpComment.date),
        },
      });

      idMappings.comments.set(wpComment.id, comment.id);
      console.log(`  ✓ Created comment ${wpComment.id} on post ${wpComment.post}`);
    } catch (error: any) {
      console.error(`  ✗ Failed to create comment ${wpComment.id}:`, error.message);
    }
  }

  // Second pass: update parent relationships
  for (const wpComment of wpComments) {
    if (wpComment.parent && wpComment.parent !== 0) {
      const commentId = idMappings.comments.get(wpComment.id);
      const parentId = idMappings.comments.get(wpComment.parent);

      if (commentId && parentId) {
        try {
          await prisma.comment.update({
            where: { id: commentId },
            data: { parentId: parentId },
          });
          console.log(`  ✓ Updated comment hierarchy: ${wpComment.id} → parent ${wpComment.parent}`);
        } catch (error: any) {
          console.error(`  ✗ Failed to update comment hierarchy:`, error.message);
        }
      }
    }
  }

  console.log(`  Imported ${idMappings.comments.size}/${wpComments.length} comments`);
}

/**
 * Save ID mappings to file for reference
 */
async function saveIdMappings() {
  const mappingsObj = {
    users: Object.fromEntries(idMappings.users),
    posts: Object.fromEntries(idMappings.posts),
    pages: Object.fromEntries(idMappings.pages),
    categories: Object.fromEntries(idMappings.categories),
    tags: Object.fromEntries(idMappings.tags),
    media: Object.fromEntries(idMappings.media),
    comments: Object.fromEntries(idMappings.comments),
  };

  const outputPath = path.join(__dirname, '..', 'id-mappings.json');
  await fs.writeJSON(outputPath, mappingsObj, { spaces: 2 });
  console.log(`\n✓ Saved ID mappings to ${outputPath}`);
}

/**
 * Main import function
 */
async function main() {
  console.log('========================================');
  console.log('WordPress to Prisma Data Import');
  console.log('========================================');

  const startTime = Date.now();

  try {
    await importUsers();
    await importCategories();
    await importTags();
    await importMedia();
    await importPosts();
    await importPages();
    await importComments();
    await saveIdMappings();

    const duration = Math.round((Date.now() - startTime) / 1000);

    console.log('\n========================================');
    console.log('Import Complete!');
    console.log('========================================');
    console.log(`Duration: ${duration}s`);
    console.log('\nImported:');
    console.log(`  Users: ${idMappings.users.size}`);
    console.log(`  Categories: ${idMappings.categories.size}`);
    console.log(`  Tags: ${idMappings.tags.size}`);
    console.log(`  Media: ${idMappings.media.size}`);
    console.log(`  Posts: ${idMappings.posts.size}`);
    console.log(`  Pages: ${idMappings.pages.size}`);
    console.log(`  Comments: ${idMappings.comments.size}`);
    console.log('========================================');
  } catch (error) {
    console.error('\n✗ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run import
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
