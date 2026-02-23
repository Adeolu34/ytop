# WordPress Migration Scripts

This directory contains scripts for migrating content from WordPress to the new Next.js + PostgreSQL platform.

## Migration Workflow

### 1. WordPress Content Export

Export all content from WordPress via REST API:

```bash
node scripts/wordpress-exporter.js
```

**What it does:**
- Connects to WordPress REST API
- Fetches all posts, pages, categories, tags, media, users, and comments
- Saves data to `/exports` directory as JSON files
- Creates a summary with migration statistics

**Prerequisites:**
- Set environment variables in `.env`:
  ```
  WORDPRESS_URL=https://ytopglobal.org
  WORDPRESS_USERNAME=your-username
  WORDPRESS_APP_PASSWORD=your-app-password
  ```

**Output:**
- `/exports/posts.json` - All blog posts (120+)
- `/exports/pages.json` - All pages
- `/exports/categories.json` - Post categories
- `/exports/tags.json` - Post tags
- `/exports/media.json` - Media library metadata
- `/exports/users.json` - User accounts
- `/exports/comments.json` - Post comments
- `/exports/_summary.json` - Migration summary

### 2. Media Download (Optional)

Download all media files from WordPress:

```bash
node scripts/download-media.js
```

**What it does:**
- Reads media list from `/exports/media.json`
- Downloads each file from WordPress
- Organizes by year/month: `/media/2024/01/`, `/media/2025/12/`
- Saves metadata as `.meta.json` alongside each file
- Skips already downloaded files

**Output:**
- `/media/YYYY/MM/*.jpg` - Downloaded images
- `/media/YYYY/MM/*.jpg.meta.json` - Image metadata

### 3. Create URL Mappings

Generate URL redirect mappings for SEO:

```bash
node scripts/create-url-mappings.js
```

**What it does:**
- Reads WordPress exports
- Creates mappings: old WordPress URL → new Next.js URL
- Generates `/url-mappings.json` for middleware redirects

**Output:**
- `/url-mappings.json` - URL redirect map for 301 redirects

### 4. Data Transformation & Import

Transform WordPress data and import to PostgreSQL:

```bash
npm run import-wordpress
```

**What it does:**
- Reads all WordPress exports
- Transforms to Prisma models
- Cleans HTML content (removes Elementor markup)
- Handles ID mappings (WordPress IDs → Prisma IDs)
- Imports in correct order (users → categories/tags → media → posts/pages → comments)
- Maintains relationships (post↔categories, page hierarchies, comment threads)
- Stores data in PostgreSQL via Prisma

**Prerequisites:**
- Database must be set up: `npx prisma migrate dev`
- Environment variable: `DATABASE_URL` in `.env`

**Output:**
- All data imported to PostgreSQL
- `/id-mappings.json` - WordPress ID → Prisma ID mappings

## Complete Migration Example

```bash
# Step 1: Export WordPress content
node scripts/wordpress-exporter.js

# Step 2: (Optional) Download media files
node scripts/download-media.js

# Step 3: Create URL mappings
node scripts/create-url-mappings.js

# Step 4: Set up database
npx prisma migrate dev

# Step 5: Import data
npm run import-wordpress

# Done! All WordPress content is now in PostgreSQL
```

## Troubleshooting

### Authentication Errors
- Verify WordPress Application Password is correct
- Check user has admin/editor permissions
- Test credentials in browser: `https://ytopglobal.org/wp-json/wp/v2/posts`

### Database Errors
- Verify `DATABASE_URL` in `.env` is correct
- Ensure database exists and is accessible
- Run `npx prisma migrate dev` to create tables

### Import Failures
- Check `/exports` directory has JSON files
- Verify JSON files are valid (not empty/corrupted)
- Review error messages for specific issues
- Import runs in transactions - failed items are logged but don't stop the process

### Media Download Issues
- Check internet connection
- Verify WordPress site is accessible
- Media downloads are resumable - re-run if interrupted

## Notes

- **Idempotency:** Import script can be run multiple times (will create duplicates - recommended to reset DB first)
- **ID Mappings:** Saved to `/id-mappings.json` for reference and debugging
- **Content Cleaning:** HTML is automatically cleaned (Elementor markup removed, entities decoded)
- **URL Redirects:** Old URLs preserved via middleware for SEO (301 redirects)

## File Structure

```
scripts/
├── wordpress-exporter.js      # WordPress REST API export
├── download-media.js           # Media file downloader
├── create-url-mappings.js      # URL mapping generator
├── transform-and-import.ts     # Data transformation & PostgreSQL import
└── README.md                   # This file

exports/                        # WordPress JSON exports (gitignored)
├── posts.json
├── pages.json
├── categories.json
├── tags.json
├── media.json
├── users.json
├── comments.json
└── _summary.json

media/                          # Downloaded media files (gitignored)
└── YYYY/
    └── MM/
        ├── image.jpg
        └── image.jpg.meta.json

url-mappings.json              # URL redirects for SEO
id-mappings.json               # WordPress ID → Prisma ID mappings
```

## Support

For migration issues or questions, refer to:
- Prisma docs: https://www.prisma.io/docs
- WordPress REST API: https://developer.wordpress.org/rest-api/
- Project README: `/README.md`
