/**
 * Publish all blog posts (set status to PUBLISHED and set publishedAt if missing).
 * Use after importing posts so they appear on the public blog.
 *
 * Usage: npm run publish-posts
 * Requires: DATABASE_URL in .env
 */

import 'dotenv/config';
import prisma from '../lib/db';

async function main() {
  const before = await prisma.post.count();
  const draftCount = await prisma.post.count({ where: { status: 'DRAFT' } });
  const scheduledCount = await prisma.post.count({ where: { status: 'SCHEDULED' } });
  const alreadyPublished = await prisma.post.count({ where: { status: 'PUBLISHED' } });

  console.log(`\nPosts: ${before} total (${alreadyPublished} published, ${draftCount} draft, ${scheduledCount} scheduled)\n`);

  if (before === 0) {
    console.log('No posts in the database. Run the WordPress import first (npm run import-wordpress).\n');
    process.exit(0);
    return;
  }

  // 1. Set all posts to PUBLISHED
  const { count: updatedStatus } = await prisma.post.updateMany({
    data: { status: 'PUBLISHED' },
  });
  console.log(`✓ Set status to PUBLISHED for ${updatedStatus} post(s).`);

  // 2. Set publishedAt = createdAt for any post where publishedAt is null
  const needDate = await prisma.post.findMany({
    where: { publishedAt: null },
    select: { id: true, createdAt: true },
  });

  for (const post of needDate) {
    await prisma.post.update({
      where: { id: post.id },
      data: { publishedAt: post.createdAt },
    });
  }
  if (needDate.length > 0) {
    console.log(`✓ Set publishedAt = createdAt for ${needDate.length} post(s).`);
  }

  const afterPublished = await prisma.post.count({ where: { status: 'PUBLISHED' } });
  console.log(`\nDone. ${afterPublished} post(s) are now published and visible on /blog.\n`);
}

main()
  .catch((e) => {
    console.error('Error:', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
