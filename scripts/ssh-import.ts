/**
 * SSH-Based WordPress Import Script
 *
 * Imports WordPress data from SSH export (database dump + uploads)
 * This is faster and more reliable than REST API exports
 *
 * Prerequisites:
 * 1. Run ssh-export.sh on WordPress server
 * 2. Download and extract the export archive
 * 3. Place extracted files in /ssh-exports directory
 * 4. Configure DATABASE_URL in .env
 * 5. Run: npm run import-wordpress-ssh
 */

import { PrismaClient, PostStatus, UserRole, MediaType } from '@/app/generated/prisma';
import * as fs from 'fs-extra';
import * as path from 'path';
import { createConnection } from 'mysql2/promise';

const prisma = new PrismaClient();

const SSH_EXPORTS_DIR = path.join(__dirname, '..', 'ssh-exports', 'wordpress-migration-export');
const DATABASE_DUMP = path.join(SSH_EXPORTS_DIR, 'database.sql');
const UPLOADS_DIR = path.join(SSH_EXPORTS_DIR, 'uploads');
const SITE_INFO = path.join(SSH_EXPORTS_DIR, 'site-info.json');

interface SiteInfo {
  site_url: string;
  wordpress_version: string;
  exported_at: string;
}

/**
 * Parse WordPress database dump and extract data
 */
async function parseWordPressDatabase() {
  console.log('Parsing WordPress database dump...');

  // Read site info
  let siteInfo: SiteInfo | null = null;
  if (await fs.pathExists(SITE_INFO)) {
    siteInfo = await fs.readJSON(SITE_INFO);
    console.log(`Site URL: ${siteInfo.site_url}`);
    console.log(`WordPress Version: ${siteInfo.wordpress_version}`);
    console.log(`Exported: ${siteInfo.exported_at}`);
  }

  // TODO: Parse SQL dump or use mysql2 to load into temp database
  // For now, we'll create a simplified version that uses the REST API exports

  console.log('\n⚠ Note: Full SQL parsing is complex.');
  console.log('Recommended approach: Use REST API export scripts instead,');
  console.log('or load the SQL dump into a temporary database and query it.\n');

  return siteInfo;
}

/**
 * Copy media files from uploads directory to media directory
 */
async function copyMediaFiles() {
  console.log('\nCopying media files...');

  if (!(await fs.pathExists(UPLOADS_DIR))) {
    console.warn('⚠ Uploads directory not found, skipping media copy');
    return 0;
  }

  const targetDir = path.join(__dirname, '..', 'public', 'media');
  await fs.ensureDir(targetDir);

  // Copy entire uploads directory structure
  await fs.copy(UPLOADS_DIR, targetDir);

  // Count files
  const fileCount = (await fs.readdir(UPLOADS_DIR, { recursive: true })).length;
  console.log(`✓ Copied ${fileCount} media files to public/media`);

  return fileCount;
}

/**
 * Main import function
 */
async function main() {
  console.log('========================================');
  console.log('WordPress SSH Import');
  console.log('========================================\n');

  try {
    // Check if export directory exists
    if (!(await fs.pathExists(SSH_EXPORTS_DIR))) {
      console.error('✗ Export directory not found:', SSH_EXPORTS_DIR);
      console.log('\nPlease follow these steps:');
      console.log('1. Run ssh-export.sh on your WordPress server');
      console.log('2. Download the export archive');
      console.log('3. Extract it to: ssh-exports/');
      console.log('\nExample:');
      console.log('  mkdir ssh-exports');
      console.log('  tar -xzf wordpress-export-*.tar.gz -C ssh-exports/');
      process.exit(1);
    }

    // Parse database
    const siteInfo = await parseWordPressDatabase();

    // Copy media files
    const mediaCount = await copyMediaFiles();

    console.log('\n========================================');
    console.log('Import Summary');
    console.log('========================================');
    console.log(`Media files copied: ${mediaCount}`);
    console.log('\n⚠ Database import pending:');
    console.log('To complete the import, you have two options:\n');
    console.log('Option A: Import SQL dump to temporary database');
    console.log('  1. mysql -u root -p -e "CREATE DATABASE wp_temp"');
    console.log(`  2. mysql -u root -p wp_temp < ${DATABASE_DUMP}`);
    console.log('  3. Update this script to query wp_temp database\n');
    console.log('Option B: Use REST API export instead');
    console.log('  1. node scripts/wordpress-exporter.js');
    console.log('  2. npm run import-wordpress');
    console.log('\n========================================');

  } catch (error) {
    console.error('✗ Import failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
