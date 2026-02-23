# SSH-Based WordPress Migration Guide

This guide explains how to use SSH access for faster, more reliable WordPress migration.

## Why SSH Migration?

✅ **Faster** - Direct database access, no API rate limits
✅ **No 2FA issues** - Bypasses authentication completely
✅ **Complete** - Access all files, database, and uploads
✅ **Reliable** - No HTTP timeouts or connection issues

## Method 1: Using the SSH Export Script (Recommended)

### Step 1: Upload the Script

Upload `ssh-export.sh` to your WordPress server:

```bash
# Via SCP
scp scripts/ssh-export.sh user@ytopglobal.org:/home/user/

# Or via SFTP client (FileZilla, WinSCP, etc.)
```

### Step 2: Run the Script on Server

SSH into your WordPress server and run:

```bash
# Navigate to WordPress directory
cd /path/to/wordpress

# Make script executable
chmod +x ssh-export.sh

# Run export
./ssh-export.sh
```

The script will:
- Extract database credentials from `wp-config.php`
- Export MySQL database to SQL file
- Copy all files from `wp-content/uploads/`
- Create site information JSON
- Package everything into compressed archive

### Step 3: Download the Export

```bash
# Download via SCP
scp user@ytopglobal.org:/path/to/wordpress/wordpress-export-*.tar.gz .

# Or download via SFTP client
```

### Step 4: Extract and Import

```bash
# Extract the archive
mkdir ssh-exports
tar -xzf wordpress-export-*.tar.gz -C ssh-exports/

# Copy media files to public directory
cp -r ssh-exports/wordpress-migration-export/uploads public/media

# Import database (Option A: Load to temp database)
mysql -u root -p -e "CREATE DATABASE wp_temp"
mysql -u root -p wp_temp < ssh-exports/wordpress-migration-export/database.sql

# Then query and import to Prisma (requires custom script)
```

### Step 5: Clean Up (Important!)

```bash
# On server - delete export file for security
ssh user@ytopglobal.org "rm /path/to/wordpress/wordpress-export-*.tar.gz"
ssh user@ytopglobal.org "rm -rf /path/to/wordpress/wordpress-migration-export"
```

## Method 2: Manual SSH Commands

If you prefer manual control:

### Export Database

```bash
# SSH into server
ssh user@ytopglobal.org

# Navigate to WordPress directory
cd /path/to/wordpress

# Get database credentials
grep DB_NAME wp-config.php
grep DB_USER wp-config.php
grep DB_PASSWORD wp-config.php

# Export database
mysqldump -u db_user -p db_name > wordpress_backup.sql

# Compress
gzip wordpress_backup.sql
```

### Download Database

```bash
# On your local machine
scp user@ytopglobal.org:/path/to/wordpress_backup.sql.gz .
gunzip wordpress_backup.sql.gz
```

### Download Media Files

```bash
# Option A: Compress on server first (recommended for large sites)
ssh user@ytopglobal.org "cd /path/to/wordpress && tar -czf uploads.tar.gz wp-content/uploads"
scp user@ytopglobal.org:/path/to/wordpress/uploads.tar.gz .
tar -xzf uploads.tar.gz
mv wp-content/uploads public/media

# Option B: Direct rsync (faster for incremental syncs)
rsync -avz --progress user@ytopglobal.org:/path/to/wordpress/wp-content/uploads/ public/media/
```

## Method 3: REST API (Fallback)

If SSH isn't available, use the REST API method:

1. Create WordPress Application Password
2. Run: `node scripts/wordpress-exporter.js`
3. Run: `npm run import-wordpress`

## Security Best Practices

### For Temporary Access

If providing temporary SSH access:

1. **Create temporary user:**
```bash
sudo useradd -m migration-temp
sudo passwd migration-temp
```

2. **Grant read-only access to WordPress:**
```bash
sudo usermod -a -G www-data migration-temp
```

3. **Delete after migration:**
```bash
sudo userdel -r migration-temp
```

### Using SSH Keys (Most Secure)

1. **Generate SSH key pair (on local machine):**
```bash
ssh-keygen -t ed25519 -C "ytop-migration"
```

2. **Add public key to server:**
```bash
ssh user@ytopglobal.org
mkdir -p ~/.ssh
nano ~/.ssh/authorized_keys
# Paste the public key, save and exit
chmod 600 ~/.ssh/authorized_keys
```

3. **Use key for authentication:**
```bash
ssh -i ~/.ssh/id_ed25519 user@ytopglobal.org
```

4. **Remove key after migration:**
```bash
# Edit ~/.ssh/authorized_keys and remove the migration key
```

## Troubleshooting

### "Permission denied" when running mysqldump

```bash
# Check if you have mysql access
mysql -u username -p -e "SHOW DATABASES;"

# If not, use wp-config.php credentials
DB_USER=$(grep DB_USER wp-config.php | cut -d \' -f 4)
DB_PASS=$(grep DB_PASSWORD wp-config.php | cut -d \' -f 4)
mysql -u $DB_USER -p$DB_PASS -e "SHOW DATABASES;"
```

### "Command not found: mysqldump"

```bash
# Find mysqldump location
which mysqldump

# Or use full path
/usr/bin/mysqldump -u username -p database > backup.sql
```

### "Access denied for user"

```bash
# Verify credentials from wp-config.php
grep DB_ wp-config.php

# Test connection
mysql -h DB_HOST -u DB_USER -p DB_NAME
```

## What to Provide

If you want me to help with SSH migration, provide:

1. **SSH Credentials:**
   - Hostname: `ytopglobal.org` or IP address
   - Port: `22` (default) or custom port
   - Username: Your SSH username
   - Password: Or SSH key

2. **WordPress Path:**
   - Where WordPress is installed (e.g., `/home/user/public_html`)

3. **Permissions:**
   - Read access to WordPress directory
   - MySQL access (usually via wp-config.php credentials)

## Recommendation

**Best approach for you:**

1. **Use the automated script** (`ssh-export.sh`) - saves time
2. **Download the export archive**
3. **Use REST API import** (`scripts/transform-and-import.ts`) - it's already built

This combines the speed of SSH for downloading with the reliability of our existing import pipeline.
