#!/bin/bash

##############################################################################
# WordPress SSH Migration Script
#
# This script runs on the WordPress server via SSH and exports:
# - Complete MySQL database dump
# - All media files (wp-content/uploads)
# - WordPress configuration
# - Site information
#
# Usage:
#   1. Upload this script to your WordPress server
#   2. Make it executable: chmod +x ssh-export.sh
#   3. Run: ./ssh-export.sh
#   4. Download the generated export files
##############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}WordPress SSH Migration Export${NC}"
echo -e "${GREEN}========================================${NC}\n"

# Configuration
EXPORT_DIR="wordpress-migration-export"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
EXPORT_FILE="wordpress-export-${TIMESTAMP}.tar.gz"

# Detect WordPress installation directory
if [ -f "wp-config.php" ]; then
    WP_DIR=$(pwd)
    echo -e "${GREEN}✓${NC} Found WordPress installation: ${WP_DIR}"
else
    echo -e "${RED}✗${NC} Error: wp-config.php not found in current directory"
    echo "Please run this script from your WordPress installation directory"
    exit 1
fi

# Create export directory
mkdir -p ${EXPORT_DIR}
echo -e "${GREEN}✓${NC} Created export directory: ${EXPORT_DIR}"

##############################################################################
# 1. EXTRACT DATABASE CREDENTIALS FROM WP-CONFIG.PHP
##############################################################################
echo -e "\n${YELLOW}[1/5]${NC} Extracting database credentials..."

DB_NAME=$(grep DB_NAME wp-config.php | cut -d \' -f 4)
DB_USER=$(grep DB_USER wp-config.php | cut -d \' -f 4)
DB_PASSWORD=$(grep DB_PASSWORD wp-config.php | cut -d \' -f 4)
DB_HOST=$(grep DB_HOST wp-config.php | cut -d \' -f 4)

echo "  Database: ${DB_NAME}"
echo "  User: ${DB_USER}"
echo "  Host: ${DB_HOST}"

##############################################################################
# 2. EXPORT DATABASE
##############################################################################
echo -e "\n${YELLOW}[2/5]${NC} Exporting MySQL database..."

mysqldump -h "${DB_HOST}" -u "${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" > ${EXPORT_DIR}/database.sql 2>&1

if [ $? -eq 0 ]; then
    DB_SIZE=$(du -h ${EXPORT_DIR}/database.sql | cut -f1)
    echo -e "${GREEN}✓${NC} Database exported successfully (${DB_SIZE})"
else
    echo -e "${RED}✗${NC} Database export failed"
    exit 1
fi

##############################################################################
# 3. COPY UPLOADS DIRECTORY
##############################################################################
echo -e "\n${YELLOW}[3/5]${NC} Copying media files (wp-content/uploads)..."

if [ -d "wp-content/uploads" ]; then
    cp -r wp-content/uploads ${EXPORT_DIR}/
    UPLOADS_SIZE=$(du -sh ${EXPORT_DIR}/uploads | cut -f1)
    UPLOADS_COUNT=$(find ${EXPORT_DIR}/uploads -type f | wc -l)
    echo -e "${GREEN}✓${NC} Copied ${UPLOADS_COUNT} files (${UPLOADS_SIZE})"
else
    echo -e "${YELLOW}⚠${NC} No uploads directory found"
fi

##############################################################################
# 4. EXPORT SITE INFORMATION
##############################################################################
echo -e "\n${YELLOW}[4/5]${NC} Gathering site information..."

# Get site URL from database
SITE_URL=$(mysql -h "${DB_HOST}" -u "${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" -se "SELECT option_value FROM wp_options WHERE option_name='siteurl' LIMIT 1" 2>/dev/null || echo "N/A")

# Get WordPress version
if [ -f "wp-includes/version.php" ]; then
    WP_VERSION=$(grep '$wp_version' wp-includes/version.php | cut -d \' -f 2)
else
    WP_VERSION="Unknown"
fi

# Create info file
cat > ${EXPORT_DIR}/site-info.json <<EOF
{
  "exported_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "site_url": "${SITE_URL}",
  "wordpress_version": "${WP_VERSION}",
  "database": {
    "name": "${DB_NAME}",
    "host": "${DB_HOST}"
  },
  "server": {
    "hostname": "$(hostname)",
    "php_version": "$(php -v | head -n 1 | cut -d ' ' -f 2)",
    "mysql_version": "$(mysql --version | cut -d ' ' -f 6)"
  }
}
EOF

echo -e "${GREEN}✓${NC} Site information exported"
echo "  Site URL: ${SITE_URL}"
echo "  WordPress Version: ${WP_VERSION}"

##############################################################################
# 5. CREATE COMPRESSED ARCHIVE
##############################################################################
echo -e "\n${YELLOW}[5/5]${NC} Creating compressed archive..."

tar -czf ${EXPORT_FILE} ${EXPORT_DIR}

if [ $? -eq 0 ]; then
    ARCHIVE_SIZE=$(du -h ${EXPORT_FILE} | cut -f1)
    echo -e "${GREEN}✓${NC} Archive created: ${EXPORT_FILE} (${ARCHIVE_SIZE})"
else
    echo -e "${RED}✗${NC} Archive creation failed"
    exit 1
fi

##############################################################################
# SUMMARY
##############################################################################
echo -e "\n${GREEN}========================================${NC}"
echo -e "${GREEN}Export Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo "Export file: ${EXPORT_FILE}"
echo "Size: ${ARCHIVE_SIZE}"
echo ""
echo "Next steps:"
echo "1. Download the export file:"
echo "   scp user@server:$(pwd)/${EXPORT_FILE} ."
echo ""
echo "2. Or download via web (if accessible):"
echo "   ${SITE_URL}/${EXPORT_FILE}"
echo ""
echo "3. Extract on your local machine:"
echo "   tar -xzf ${EXPORT_FILE}"
echo ""
echo "4. Run the import script:"
echo "   npm run import-wordpress-ssh"
echo ""
echo -e "${YELLOW}⚠ Security:${NC} Remember to delete the export file after download!"
echo "   rm ${EXPORT_FILE} ${EXPORT_DIR} -rf"
echo -e "${GREEN}========================================${NC}"
