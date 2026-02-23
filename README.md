# YTOP Global Website

Modern Next.js website for YTOP Global (Young Talented Optimistic and Potential Org.) - migrated from WordPress.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Styling:** Tailwind CSS
- **Authentication:** NextAuth.js
- **CMS:** Custom admin panel with TipTap editor
- **Payments:** Stripe
- **Email:** SendGrid/Resend
- **Newsletter:** MailChimp
- **Hosting:** Vercel (frontend) + Railway/Supabase (database)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and API keys
```

3. Set up database (PostgreSQL required). **Yes, you can use localhost.**

   **Option A – Local PostgreSQL (recommended for dev)**

   - **With Docker** (easiest): from the project root run:
     ```bash
     docker compose up -d
     ```
     Then in `.env` set:
     ```env
     DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ytopglobal?schema=public"
     ```

   - **Without Docker:** install [PostgreSQL](https://www.postgresql.org/download/), create a database named `ytopglobal`, and use the same `DATABASE_URL` above (adjust username/password if different).

   **Option B – Free hosted PostgreSQL (no local install)**
   - Sign up at [Neon](https://neon.tech) or [Supabase](https://supabase.com), create a project, and copy the connection string into `.env` as `DATABASE_URL="postgresql://..."`.

   Then run:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Run development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

## Project Structure

```
├── app/                    # Next.js App Router pages and API routes
│   ├── (public)/          # Public-facing pages
│   ├── admin/             # Admin CMS panel
│   └── api/               # API routes
├── components/            # React components
│   ├── public/           # Public site components
│   └── admin/            # Admin panel components
├── prisma/               # Database schema and migrations
├── scripts/              # WordPress export and import scripts
├── lib/                  # Utility functions and shared code
└── public/               # Static assets
```

## WordPress Migration

The site was migrated from WordPress using:
1. WordPress REST API export script
2. Data transformation and import to PostgreSQL
3. URL redirects for SEO preservation
4. Media file migration

See `/scripts` directory for migration tools.

### Get all posts via Application Password

To pull **all blog posts** from your WordPress site (published, draft, pending, private) using an [Application Password](https://wordpress.org/documentation/article/application-passwords/):

1. **Create an Application Password in WordPress**
   - Log in to WP Admin → **Users** → **Profile** (or edit a user with at least Editor role).
   - Scroll to **Application Passwords**, enter a name (e.g. `YTOP Import`), click **Add New Application Password**.
   - Copy the generated password (it appears once; format like `xxxx xxxx xxxx xxxx`).

2. **Add to `.env`**
   ```env
   WORDPRESS_URL="https://yoursite.com"
   WORDPRESS_USERNAME="your_wp_username"
   WORDPRESS_APP_PASSWORD="xxxx xxxx xxxx xxxx"
   ```
   You can use `WORDPRESS_APPLICATION_PASSWORD` instead of `WORDPRESS_APP_PASSWORD` if you prefer.

3. **Run the import**
   ```bash
   npm run import-posts-wp
   ```
   This fetches all posts from the WordPress REST API (using Basic auth with the application password), creates categories/tags and featured images, and inserts posts into your database. Existing posts with the same slug are skipped. Then run `npm run publish-posts` if you want every imported post to appear as published on `/blog`.

## Admin Panel

Access the admin panel at `/admin` with credentials created during database seeding.

Features:
- Rich text editor (TipTap)
- Media library management
- Post and page management
- Team member management
- Testimonials, programs, events, campaigns
- Menu builder
- Site settings

## License

Copyright © 2025 YTOP Global. All rights reserved.
