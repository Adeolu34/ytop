# Moving to Neon Database

This guide covers switching from your current PostgreSQL (local or other) to [Neon](https://neon.tech) and migrating **posts**, **media (images)**, and **access/users**.

---

## 1. Get your Neon connection strings

1. Open [Neon Console](https://console.neon.tech) and select your project.
2. In **Connection details**, copy:
   - **Pooled connection** (host contains `-pooler`) → use for `DATABASE_URL`
   - **Direct connection** (no `-pooler`) → use for `DIRECT_URL`
3. Ensure both URLs include `?sslmode=require` (Neon requires SSL).

Example:

```env
# Pooled (for the app)
DATABASE_URL="postgresql://user:password@ep-xxx-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Direct (for Prisma Migrate)
DIRECT_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

---

## 2. Point the app at Neon

1. In `.env`, replace your current database URLs with the Neon values above.
2. Keep your other variables (e.g. `WORDPRESS_*`, `NEXTAUTH_*`) as they are.

---

## 3. Create schema on Neon (tables)

Run migrations against Neon so all tables exist:

```bash
npx prisma migrate deploy
```

If you prefer to push the schema without migration history (e.g. new project):

```bash
npx prisma db push
```

Then regenerate the client:

```bash
npx prisma generate
```

---

## 4. Migrate your data (posts, images, access)

You have two main options.

### Option A: You have data in your **current** PostgreSQL (e.g. local)

Use `pg_dump` and `psql` to copy everything into Neon.

1. **Export** from your current database (from your machine, with current `.env` pointing to the **old** DB, or set `OLD_DATABASE_URL`):

   ```bash
   # Windows (PowerShell) – set your current connection string
   $env:PGPASSWORD="postgres"; pg_dump -h localhost -p 5432 -U postgres -d ytopglobal -F c -f ytopglobal.dump
   ```

   If `pg_dump` is not in PATH, use the full path (e.g. from PostgreSQL install) or use [pg_dump from Neon](https://neon.tech/docs/connect/import-from-postgres).

2. **Import** into Neon using the **direct** connection string (not the pooler):

   ```bash
   # Replace the connection string with your Neon DIRECT_URL (no -pooler)
   pg_restore -h ep-xxx.us-east-2.aws.neon.tech -p 5432 -U user -d neondb --no-owner --no-acl -F c ytopglobal.dump
   ```

   Or with connection string:

   ```bash
   set PGPASSWORD=your_neon_password
   pg_restore "postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require" --no-owner --no-acl -F c ytopglobal.dump
   ```

3. **Images**: The app stores image **URLs** in the `Media` table (e.g. from WordPress or `/media/...`). The dump/restore copies those rows. If the URLs point to your WordPress site or your own domain, they keep working. If any point to `localhost` or a temporary URL, update them (e.g. in Neon with SQL or via a small script).

4. **Access (users)**: The `User` table is included in the dump, so logins and roles move with Option A.

---

### Option B: Start fresh on Neon and re-pull from WordPress

If you don’t need to keep existing data in your current DB, or most content lives in WordPress:

1. After step 3 above, your Neon DB has empty tables.
2. **Create an admin user** (required for posts to have an author):

   ```bash
   npx prisma db seed
   ```

   (Seeds an admin and sample data; adjust `prisma/seed.ts` if you only want the admin.)

3. **Import posts (and featured images) from WordPress**:

   In `.env` keep:

   ```env
   WORDPRESS_URL="https://ytopglobal.org"
   WORDPRESS_USERNAME="yadmin"
   WORDPRESS_APP_PASSWORD="your-app-password"
   ```

   Then run:

   ```bash
   npm run import-posts-wp
   ```

   This creates posts and `Media` rows with **image URLs** from WordPress (e.g. `https://ytopglobal.org/...`). No image files are copied into the DB; the app and WordPress will serve them from those URLs.

4. **Access**: Use the user created by the seed (or create one in your app). No “access” data is imported from WordPress; only posts/media metadata.

---

## 5. Verify

- Open the app and check **Blog** and **Programs** (and any pages that use `Media`).
- If you use auth, log in and confirm **access** (admin/editor) works.
- In Neon Console, check **Tables** to see `Post`, `Media`, `User`, etc.

---

## Summary

| What you want | How |
|---------------|-----|
| **Schema (tables)** | `npx prisma migrate deploy` or `npx prisma db push` with Neon in `.env`. |
| **Posts + media records** | Option A: `pg_dump` → `pg_restore` into Neon. Option B: `npm run import-posts-wp` after seed. |
| **Image files** | Stored as URLs in `Media`. Point URLs to your WordPress or CDN; no binary migration needed. |
| **Access (users/roles)** | Option A: Migrated with `pg_dump`/`pg_restore`. Option B: Created by `npx prisma db seed` and your app. |

If you tell me whether you’re using **Option A** (migrate from current DB) or **Option B** (fresh DB + WordPress import), I can give you exact commands for your setup (e.g. Windows paths and your Neon project name).
