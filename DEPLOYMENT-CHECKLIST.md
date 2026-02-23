# Production Deployment Checklist

Use this checklist to deploy YTOP Global to production.

## Pre-Deployment

### 1. Database Setup
- [ ] Create production PostgreSQL database (Railway/Supabase)
- [ ] Copy connection string
- [ ] Update `.env` with production DATABASE_URL
- [ ] Run migrations: `npx prisma migrate deploy`
- [ ] Seed admin user: `npm run db:seed`
- [ ] Import WordPress data: `npm run import-wordpress`

### 2. Environment Variables
- [ ] Generate secure NEXTAUTH_SECRET: `openssl rand -base64 32`
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Add Stripe keys (if using payments)
- [ ] Add SendGrid/Resend API key (if using email)
- [ ] Add MailChimp credentials (if using newsletter)
- [ ] Add Google Analytics ID (if using analytics)

### 3. Code Review
- [ ] Run build: `npm run build`
- [ ] Fix any TypeScript errors
- [ ] Run lint: `npm run lint`
- [ ] Test all pages locally
- [ ] Verify forms work
- [ ] Check responsive design

## Deployment to Vercel

### 1. Connect Repository
- [ ] Push code to GitHub
- [ ] Create Vercel account (vercel.com)
- [ ] Import GitHub repository
- [ ] Configure project settings

### 2. Configure Environment Variables
Go to Project Settings → Environment Variables and add:

```
DATABASE_URL=postgresql://user:pass@host:5432/db
NEXTAUTH_SECRET=your-generated-secret
NEXTAUTH_URL=https://ytopglobal.org
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
SENDGRID_API_KEY=SG...
MAILCHIMP_API_KEY=...
NEXT_PUBLIC_GA_ID=G-...
```

### 3. Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Visit deployment URL
- [ ] Test homepage loads
- [ ] Test blog posts load
- [ ] Test admin login works

## DNS Configuration

### 1. Get Vercel DNS Settings
- [ ] Go to Project Settings → Domains
- [ ] Add domain: ytopglobal.org
- [ ] Note the DNS records provided

### 2. Update DNS Provider
Add these records to your domain provider:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Verify Domain
- [ ] Wait for DNS propagation (5-30 minutes)
- [ ] Verify domain works: https://ytopglobal.org
- [ ] Verify SSL certificate is active (https://)

## Post-Deployment

### 1. Content Verification
- [ ] Homepage displays correctly
- [ ] All blog posts accessible
- [ ] Static pages work (About, Team, Contact, etc.)
- [ ] Images load properly
- [ ] Forms submit successfully
- [ ] Search works

### 2. SEO Verification
- [ ] Sitemap accessible: /sitemap.xml
- [ ] Robots.txt accessible: /robots.txt
- [ ] Meta tags present on all pages
- [ ] Open Graph images display in social shares
- [ ] Old WordPress URLs redirect (test a few)

### 3. Admin Panel
- [ ] Admin login works: /admin/login
- [ ] Dashboard loads
- [ ] Can view posts
- [ ] Can view pages
- [ ] Can view media
- [ ] All menu items work

### 4. Performance Check
- [ ] Run Lighthouse audit
- [ ] Performance score 90+
- [ ] Accessibility score 95+
- [ ] SEO score 95+
- [ ] Fix any critical issues

### 5. Security
- [ ] Change default admin password
- [ ] Verify HTTPS works
- [ ] Check no sensitive data exposed
- [ ] Review environment variables
- [ ] Set up error monitoring (Sentry)

### 6. Monitoring
- [ ] Enable Vercel Analytics
- [ ] Set up Google Analytics
- [ ] Configure uptime monitoring
- [ ] Set up error tracking
- [ ] Create backup schedule

## WordPress Cleanup

### 1. Pre-Cleanup Verification
- [ ] Verify all content migrated successfully
- [ ] Test random blog posts on new site
- [ ] Check all images load
- [ ] Verify forms work
- [ ] Test redirects from old URLs

### 2. WordPress Site Actions
- [ ] Put WordPress in maintenance mode
- [ ] Download final backup
- [ ] Keep WordPress running for 30 days (safety net)
- [ ] Monitor 404 errors on new site
- [ ] Add any missing redirects

### 3. After 30 Days (if stable)
- [ ] Take final WordPress backup
- [ ] Archive WordPress files
- [ ] Cancel WordPress hosting
- [ ] Revoke Application Password

## Launch Communication

### 1. Internal Team
- [ ] Train team on new admin panel
- [ ] Share new admin credentials
- [ ] Document how to create posts
- [ ] Document how to upload media
- [ ] Schedule training session

### 2. Stakeholders
- [ ] Announce migration complete
- [ ] Share new website features
- [ ] Collect feedback
- [ ] Address any issues

### 3. Public Announcement
- [ ] Social media announcement
- [ ] Email newsletter to subscribers
- [ ] Blog post about migration (if desired)

## Maintenance Schedule

### Daily
- [ ] Monitor error logs
- [ ] Check site uptime
- [ ] Review form submissions

### Weekly
- [ ] Review analytics
- [ ] Check performance metrics
- [ ] Update content

### Monthly
- [ ] Update dependencies: `npm update`
- [ ] Review security alerts
- [ ] Database backup verification
- [ ] Performance optimization review

## Emergency Contacts

**Hosting Issues:**
- Vercel Support: vercel.com/support
- Database Support: [Railway/Supabase support]

**Development Issues:**
- Project Repository: [GitHub URL]
- Developer: [Your contact]

**Domain Issues:**
- Domain Registrar: [Provider name]
- DNS Provider: [Provider name]

## Rollback Plan

If critical issues occur:

1. **Immediate:** Revert DNS to old WordPress
2. **Database:** Restore from backup
3. **Code:** Revert to previous deployment on Vercel
4. **Communication:** Notify stakeholders
5. **Resolution:** Fix issues, test, re-deploy

## Success Criteria

Site is successfully deployed when:
- ✅ All pages load without errors
- ✅ Blog posts display correctly
- ✅ Forms submit successfully
- ✅ Images load properly
- ✅ Admin panel works
- ✅ Lighthouse scores meet targets
- ✅ No 404 errors from old URLs
- ✅ HTTPS works correctly
- ✅ Monitoring is active

## Notes

- Keep WordPress backup for at least 6 months
- Document any custom configurations
- Maintain this checklist for future reference
- Update as you complete tasks

---

**Deployment Date:** _______________
**Completed By:** _______________
**Production URL:** https://ytopglobal.org
**Admin URL:** https://ytopglobal.org/admin

**Status:** [ ] In Progress [ ] Complete [ ] Issues Found
