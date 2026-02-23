/**
 * URL Mapping Generator
 *
 * Creates url-mappings.json with WordPress URL → New URL mappings
 * for implementing 301 redirects to preserve SEO
 *
 * Usage: node scripts/create-url-mappings.js
 */

const fs = require('fs-extra');
const path = require('path');

const EXPORTS_DIR = path.join(__dirname, '..', 'exports');
const OUTPUT_FILE = path.join(__dirname, '..', 'url-mappings.json');

function extractSlug(link) {
  try {
    const url = new URL(link);
    const pathname = url.pathname;
    // Remove leading and trailing slashes
    return pathname.replace(/^\/|\/$/g, '');
  } catch (error) {
    return null;
  }
}

async function createUrlMappings() {
  console.log('========================================');
  console.log('URL Mapping Generator');
  console.log('========================================\n');

  const mappings = [];

  // 1. Load and process posts
  console.log('Processing posts...');
  const postsFile = path.join(EXPORTS_DIR, 'posts.json');
  if (await fs.pathExists(postsFile)) {
    const posts = await fs.readJSON(postsFile);

    for (const post of posts) {
      const oldPath = extractSlug(post.link);
      if (oldPath) {
        mappings.push({
          from: `/${oldPath}`,
          to: `/blog/${post.slug}`,
          type: 'post',
          id: post.id,
          title: post.title?.rendered || '',
        });
      }
    }
    console.log(`  Added ${posts.length} post mappings`);
  }

  // 2. Load and process pages
  console.log('Processing pages...');
  const pagesFile = path.join(EXPORTS_DIR, 'pages.json');
  if (await fs.pathExists(pagesFile)) {
    const pages = await fs.readJSON(pagesFile);

    for (const page of pages) {
      const oldPath = extractSlug(page.link);
      if (oldPath) {
        // Map pages to their new locations
        let newPath = `/${page.slug}`;

        // Special page mappings (customize as needed)
        const specialPages = {
          'home': '/',
          'about-us': '/about',
          'our-team': '/team',
          'contact-us': '/contact',
          'programs': '/programs',
          'volunteer': '/volunteer',
          'donate': '/donate',
          'gallery': '/gallery',
        };

        if (specialPages[page.slug]) {
          newPath = specialPages[page.slug];
        }

        mappings.push({
          from: `/${oldPath}`,
          to: newPath,
          type: 'page',
          id: page.id,
          title: page.title?.rendered || '',
        });
      }
    }
    console.log(`  Added ${pages.length} page mappings`);
  }

  // 3. Load and process categories
  console.log('Processing categories...');
  const categoriesFile = path.join(EXPORTS_DIR, 'categories.json');
  if (await fs.pathExists(categoriesFile)) {
    const categories = await fs.readJSON(categoriesFile);

    for (const category of categories) {
      const oldPath = extractSlug(category.link);
      if (oldPath) {
        mappings.push({
          from: `/${oldPath}`,
          to: `/blog/category/${category.slug}`,
          type: 'category',
          id: category.id,
          name: category.name,
        });
      }
    }
    console.log(`  Added ${categories.length} category mappings`);
  }

  // 4. Load and process tags
  console.log('Processing tags...');
  const tagsFile = path.join(EXPORTS_DIR, 'tags.json');
  if (await fs.pathExists(tagsFile)) {
    const tags = await fs.readJSON(tagsFile);

    for (const tag of tags) {
      const oldPath = extractSlug(tag.link);
      if (oldPath) {
        mappings.push({
          from: `/${oldPath}`,
          to: `/blog/tag/${tag.slug}`,
          type: 'tag',
          id: tag.id,
          name: tag.name,
        });
      }
    }
    console.log(`  Added ${tags.length} tag mappings`);
  }

  // Save mappings
  await fs.writeJSON(OUTPUT_FILE, mappings, { spaces: 2 });

  console.log('\n========================================');
  console.log('URL Mappings Created!');
  console.log('========================================');
  console.log(`Total mappings: ${mappings.length}`);
  console.log(`Saved to: ${OUTPUT_FILE}`);
  console.log('\nBreakdown by type:');

  const breakdown = mappings.reduce((acc, mapping) => {
    acc[mapping.type] = (acc[mapping.type] || 0) + 1;
    return acc;
  }, {});

  Object.entries(breakdown).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });

  console.log('\nThese mappings will be used in middleware.ts for 301 redirects.');
  console.log('========================================');
}

if (require.main === module) {
  createUrlMappings()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Failed to create URL mappings:', error);
      process.exit(1);
    });
}

module.exports = { createUrlMappings };
