/**
 * One-shot backfill: copy all published posts from PostgreSQL into MongoDB (`blog_posts`).
 * Requires PUBLIC_BLOG_SOURCE=mongodb and MONGODB_URI in .env.
 *
 * Usage: npm run sync:blog-mongo
 */

import 'dotenv/config';
import { syncAllPublishedPostsToMongo } from '../lib/mongo-blog';

async function main() {
  const n = await syncAllPublishedPostsToMongo();
  console.log(`\nSynced ${n} published post(s) to MongoDB.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
