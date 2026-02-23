/**
 * Quick check: are any blog posts in the database?
 * Usage: npx tsx scripts/check-posts.ts
 */
import 'dotenv/config';
import prisma from '../lib/db';

async function main() {
  const total = await prisma.post.count();
  const published = await prisma.post.count({ where: { status: 'PUBLISHED' } });
  const draft = await prisma.post.count({ where: { status: 'DRAFT' } });
  const scheduled = await prisma.post.count({ where: { status: 'SCHEDULED' } });

  console.log('\n--- Blog posts in database ---');
  console.log('Total:', total);
  console.log('Published:', published);
  console.log('Draft:', draft);
  console.log('Scheduled:', scheduled);

  if (total > 0) {
    const sample = await prisma.post.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, status: true, publishedAt: true, createdAt: true },
    });
    console.log('\nLatest 10 posts:');
    sample.forEach((p, i) => {
      console.log(`  ${i + 1}. [${p.status}] ${p.title} (${p.slug})`);
    });
  } else {
    console.log('\nNo posts found. Run the WordPress import (e.g. npm run import-wordpress) to import blogs.');
  }
  console.log('');
}

main()
  .catch((e) => {
    console.error('Error:', e.message);
    if (e.message?.includes('DATABASE_URL')) console.error('Ensure DATABASE_URL is set in .env');
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
