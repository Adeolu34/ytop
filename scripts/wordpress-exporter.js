/**
 * WordPress Content Exporter
 *
 * This script exports all content from WordPress via REST API:
 * - Posts (with pagination)
 * - Pages
 * - Categories
 * - Tags
 * - Media
 * - Users
 * - Comments
 *
 * Usage:
 * 1. Set environment variables in .env:
 *    WORDPRESS_URL=https://ytopglobal.org
 *    WORDPRESS_USERNAME=your-username
 *    WORDPRESS_APP_PASSWORD=your-app-password
 *
 * 2. Run: node scripts/wordpress-exporter.js
 */

require('dotenv').config();
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

// Configuration
const WORDPRESS_URL = process.env.WORDPRESS_URL || 'https://ytopglobal.org';
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME;
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD;

const EXPORTS_DIR = path.join(__dirname, '..', 'exports');
const PER_PAGE = 100; // Max items per page

// Create axios instance with basic auth
const wp = axios.create({
  baseURL: `${WORDPRESS_URL}/wp-json/wp/v2`,
  timeout: 30000,
  headers: {
    'User-Agent': 'YTOP-Migration-Script',
  },
});

// Add auth if credentials provided
if (WORDPRESS_USERNAME && WORDPRESS_APP_PASSWORD) {
  wp.defaults.auth = {
    username: WORDPRESS_USERNAME,
    password: WORDPRESS_APP_PASSWORD,
  };
}

/**
 * Fetch all items from a paginated WordPress REST API endpoint
 */
async function fetchAllItems(endpoint, params = {}) {
  console.log(`Fetching ${endpoint}...`);

  let allItems = [];
  let page = 1;
  let totalPages = 1;

  try {
    while (page <= totalPages) {
      console.log(`  Page ${page}/${totalPages}...`);

      const response = await wp.get(endpoint, {
        params: {
          ...params,
          per_page: PER_PAGE,
          page,
        },
      });

      allItems = allItems.concat(response.data);

      // Get total pages from headers
      const wpTotal = response.headers['x-wp-total'];
      const wpTotalPages = response.headers['x-wp-totalpages'];

      if (wpTotalPages) {
        totalPages = parseInt(wpTotalPages, 10);
      }

      console.log(`  Fetched ${response.data.length} items (Total: ${wpTotal || allItems.length})`);

      page++;

      // Rate limiting
      await sleep(500);
    }

    return allItems;
  } catch (error) {
    if (error.response) {
      console.error(`Error fetching ${endpoint}:`, error.response.status, error.response.statusText);
      if (error.response.status === 401) {
        console.error('Authentication failed. Check your WordPress username and application password.');
      }
    } else {
      console.error(`Error fetching ${endpoint}:`, error.message);
    }
    return [];
  }
}

/**
 * Save data to JSON file
 */
async function saveToFile(filename, data) {
  const filepath = path.join(EXPORTS_DIR, filename);
  await fs.ensureDir(EXPORTS_DIR);
  await fs.writeJSON(filepath, data, { spaces: 2 });
  console.log(`✓ Saved ${data.length} items to ${filename}`);
}

/**
 * Download media file
 */
async function downloadMedia(url, filepath) {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    await fs.ensureDir(path.dirname(filepath));
    await fs.writeFile(filepath, response.data);
    return true;
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
    return false;
  }
}

/**
 * Extract Elementor data from post meta
 */
function extractElementorData(post) {
  if (!post.meta) return null;

  // Check if post uses Elementor
  const elementorData = post.meta._elementor_data;
  if (elementorData) {
    try {
      return JSON.parse(elementorData);
    } catch (error) {
      console.warn(`Failed to parse Elementor data for post ${post.id}`);
      return null;
    }
  }

  return null;
}

/**
 * Main export function
 */
async function exportWordPressContent() {
  console.log('========================================');
  console.log('WordPress Content Exporter');
  console.log('========================================');
  console.log(`WordPress URL: ${WORDPRESS_URL}`);
  console.log(`Authentication: ${WORDPRESS_USERNAME ? 'Enabled' : 'Disabled (public content only)'}`);
  console.log('');

  const startTime = Date.now();

  // 1. Fetch Posts
  console.log('\n[1/7] Exporting Posts...');
  const posts = await fetchAllItems('/posts', { status: 'publish,draft,pending' });

  // Extract Elementor data for testimonials, etc.
  posts.forEach(post => {
    post.elementor_data = extractElementorData(post);
  });

  await saveToFile('posts.json', posts);

  // 2. Fetch Pages
  console.log('\n[2/7] Exporting Pages...');
  const pages = await fetchAllItems('/pages', { status: 'publish,draft' });
  await saveToFile('pages.json', pages);

  // 3. Fetch Categories
  console.log('\n[3/7] Exporting Categories...');
  const categories = await fetchAllItems('/categories', { per_page: 100 });
  await saveToFile('categories.json', categories);

  // 4. Fetch Tags
  console.log('\n[4/7] Exporting Tags...');
  const tags = await fetchAllItems('/tags', { per_page: 100 });
  await saveToFile('tags.json', tags);

  // 5. Fetch Media
  console.log('\n[5/7] Exporting Media...');
  const media = await fetchAllItems('/media', { per_page: 100 });
  await saveToFile('media.json', media);

  // 6. Fetch Users
  console.log('\n[6/7] Exporting Users...');
  const users = await fetchAllItems('/users');
  await saveToFile('users.json', users);

  // 7. Fetch Comments
  console.log('\n[7/7] Exporting Comments...');
  const comments = await fetchAllItems('/comments', { per_page: 100 });
  await saveToFile('comments.json', comments);

  // Create summary
  const summary = {
    exported_at: new Date().toISOString(),
    wordpress_url: WORDPRESS_URL,
    counts: {
      posts: posts.length,
      pages: pages.length,
      categories: categories.length,
      tags: tags.length,
      media: media.length,
      users: users.length,
      comments: comments.length,
    },
    duration_seconds: Math.round((Date.now() - startTime) / 1000),
  };

  await saveToFile('_summary.json', summary);

  console.log('\n========================================');
  console.log('Export Complete!');
  console.log('========================================');
  console.log(`Total Posts: ${summary.counts.posts}`);
  console.log(`Total Pages: ${summary.counts.pages}`);
  console.log(`Total Categories: ${summary.counts.categories}`);
  console.log(`Total Tags: ${summary.counts.tags}`);
  console.log(`Total Media: ${summary.counts.media}`);
  console.log(`Total Users: ${summary.counts.users}`);
  console.log(`Total Comments: ${summary.counts.comments}`);
  console.log(`Duration: ${summary.duration_seconds}s`);
  console.log('');
  console.log(`Exports saved to: ${EXPORTS_DIR}`);
  console.log('');
  console.log('Next steps:');
  console.log('1. Review the exported data in ./exports/');
  console.log('2. Optionally download media files: node scripts/download-media.js');
  console.log('3. Run data transformation: npm run import-wordpress');
  console.log('========================================');
}

/**
 * Helper function to sleep
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Run export
if (require.main === module) {
  exportWordPressContent()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Export failed:', error);
      process.exit(1);
    });
}

module.exports = { exportWordPressContent, fetchAllItems };
