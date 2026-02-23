/**
 * WordPress Media Downloader
 *
 * Downloads all media files from WordPress and organizes them
 * by year/month structure (mimicking WordPress uploads directory)
 *
 * Usage: node scripts/download-media.js
 */

const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const EXPORTS_DIR = path.join(__dirname, '..', 'exports');
const MEDIA_DIR = path.join(__dirname, '..', 'media');
const MEDIA_JSON = path.join(EXPORTS_DIR, 'media.json');

async function downloadMedia(url, filepath) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
    });
    await fs.ensureDir(path.dirname(filepath));
    await fs.writeFile(filepath, response.data);
    return true;
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
    return false;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadAllMedia() {
  console.log('========================================');
  console.log('WordPress Media Downloader');
  console.log('========================================\n');

  // Check if media.json exists
  if (!await fs.pathExists(MEDIA_JSON)) {
    console.error('Error: media.json not found.');
    console.log('Please run wordpress-exporter.js first.');
    process.exit(1);
  }

  // Load media list
  const mediaList = await fs.readJSON(MEDIA_JSON);
  console.log(`Found ${mediaList.length} media files to download.\n`);

  const startTime = Date.now();
  let downloaded = 0;
  let failed = 0;
  let skipped = 0;

  for (let i = 0; i < mediaList.length; i++) {
    const media = mediaList[i];
    const url = media.source_url;

    if (!url) {
      console.log(`[${i + 1}/${mediaList.length}] Skipped: No source URL for media ID ${media.id}`);
      skipped++;
      continue;
    }

    // Extract date from media (e.g., "2024-01-15T10:30:00")
    const date = new Date(media.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    // Get filename
    const filename = path.basename(url.split('?')[0]); // Remove query params
    const filepath = path.join(MEDIA_DIR, String(year), month, filename);

    // Check if file already exists
    if (await fs.pathExists(filepath)) {
      console.log(`[${i + 1}/${mediaList.length}] Already exists: ${year}/${month}/${filename}`);
      skipped++;
      continue;
    }

    // Download file
    console.log(`[${i + 1}/${mediaList.length}] Downloading: ${year}/${month}/${filename}`);
    const success = await downloadMedia(url, filepath);

    if (success) {
      // Save metadata as .meta.json
      const metaFilepath = filepath + '.meta.json';
      const metadata = {
        id: media.id,
        title: media.title?.rendered || '',
        alt_text: media.alt_text || '',
        caption: media.caption?.rendered || '',
        description: media.description?.rendered || '',
        mime_type: media.mime_type,
        width: media.media_details?.width,
        height: media.media_details?.height,
        file_size: media.media_details?.filesize,
        date: media.date,
        source_url: url,
      };
      await fs.writeJSON(metaFilepath, metadata, { spaces: 2 });

      downloaded++;
    } else {
      failed++;
    }

    // Rate limiting
    await sleep(100);
  }

  const duration = Math.round((Date.now() - startTime) / 1000);

  console.log('\n========================================');
  console.log('Download Complete!');
  console.log('========================================');
  console.log(`Total files: ${mediaList.length}`);
  console.log(`Downloaded: ${downloaded}`);
  console.log(`Skipped (already exists): ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Duration: ${duration}s`);
  console.log(`\nMedia saved to: ${MEDIA_DIR}`);
  console.log('========================================');
}

if (require.main === module) {
  downloadAllMedia()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Download failed:', error);
      process.exit(1);
    });
}

module.exports = { downloadAllMedia };
