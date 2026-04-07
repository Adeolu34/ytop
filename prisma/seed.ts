import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import prisma from '../lib/db';
import { resolveSeedAdminCredentials } from '../lib/seed-admin';
import { YTOP_SOCIAL_URLS } from '../lib/ytop-social-urls';

dotenv.config();

async function main() {
  console.log('Seeding database...');

  try {
    const adminCredentials = resolveSeedAdminCredentials(process.env);
    let admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
    });

    if (adminCredentials) {
      const hashedPassword = await bcrypt.hash(adminCredentials.password, 10);

      admin = await prisma.user.upsert({
        where: { email: adminCredentials.email },
        update: {
          name: adminCredentials.name,
          hashedPassword,
          role: 'ADMIN',
        },
        create: {
          email: adminCredentials.email,
          name: adminCredentials.name,
          hashedPassword,
          role: 'ADMIN',
          bio: 'System Administrator',
        },
      });

      console.log('Admin user ready:', admin.email);
    } else {
      console.warn(
        'Skipping admin user seed because ADMIN_EMAIL and ADMIN_PASSWORD are not set.'
      );
    }

    if (!admin) {
      throw new Error(
        'An admin user is required before sample content can be seeded. Set ADMIN_EMAIL and ADMIN_PASSWORD and rerun the seed.'
      );
    }

    const settings = [
      { key: 'site_name', value: 'YTOP Global', group: 'general' },
      {
        key: 'site_tagline',
        value: 'Young Talented Optimistic and Potential Organization',
        group: 'general',
      },
      { key: 'contact_email', value: 'info@ytopglobal.org', group: 'general' },
      { key: 'contact_phone', value: '+1 (234) 567-890', group: 'general' },
      {
        key: 'facebook_url',
        value: YTOP_SOCIAL_URLS.facebook,
        group: 'social',
      },
      {
        key: 'twitter_url',
        value: YTOP_SOCIAL_URLS.twitter,
        group: 'social',
      },
      {
        key: 'linkedin_url',
        value: YTOP_SOCIAL_URLS.linkedin,
        group: 'social',
      },
      {
        key: 'instagram_url',
        value: YTOP_SOCIAL_URLS.instagram,
        group: 'social',
      },
      {
        key: 'telegram_url',
        value: YTOP_SOCIAL_URLS.telegram,
        group: 'social',
      },
      {
        key: 'youtube_url',
        value: YTOP_SOCIAL_URLS.youtube,
        group: 'social',
      },
      {
        key: 'tiktok_url',
        value: YTOP_SOCIAL_URLS.tiktok,
        group: 'social',
      },
      {
        key: 'site_logo_url',
        value: '/media/2023/03/YTOP-PNGGG-2022.png',
        group: 'branding',
      },
      {
        key: 'site_favicon_url',
        value: '/favicon.ico',
        group: 'branding',
      },
      {
        key: 'brand_primary_hex',
        value: '#EF4444',
        group: 'branding',
      },
      {
        key: 'brand_secondary_hex',
        value: '#1E3A8A',
        group: 'branding',
      },
    ];

    for (const setting of settings) {
      await prisma.settings.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      });
    }

    console.log('Created default settings');

    const categoryCount = await prisma.category.count();
    let defaultCategoryId: string | null = null;
    if (categoryCount === 0) {
      const category = await prisma.category.create({
        data: {
          name: 'News',
          slug: 'news',
          description: 'Updates and news from YTOP Global',
        },
      });
      defaultCategoryId = category.id;
      console.log('Created default category: News');
    }

    const postCount = await prisma.post.count();
    if (postCount === 0) {
      const now = new Date();
      const sampleImageUrls = [
        { url: '/media/2021/10/IMG_9658-scaled.jpg', alt: 'YTOP program' },
        {
          url: '/media/2021/10/IMG_9586-scaled.jpg',
          alt: 'YTOP team workshop',
        },
        { url: '/media/2021/10/IMG_9724-scaled.jpg', alt: 'Youth gathering' },
      ];
      const mediaIds: string[] = [];
      for (const image of sampleImageUrls) {
        const media = await prisma.media.create({
          data: {
            filename: image.url.split('/').pop() || 'image.jpg',
            originalName: image.url.split('/').pop() || 'image.jpg',
            url: image.url,
            mimeType: 'image/jpeg',
            fileSize: 0,
            type: 'IMAGE',
            altText: image.alt,
          },
        });
        mediaIds.push(media.id);
      }

      const samplePosts = [
        {
          title: 'Welcome to the YTOP Global Blog',
          slug: 'welcome-to-the-ytop-global-blog',
          excerpt:
            'Welcome to our new blog. Here we share stories, insights, and updates from our work with young people around the world.',
          content:
            '<p>Welcome to the YTOP Global blog. We are excited to share updates, stories, and insights from our programs and the young people we work with.</p><p>Stay tuned for more posts about leadership, career development, and community impact.</p>',
          status: 'PUBLISHED' as const,
          authorId: admin.id,
          publishedAt: now,
          metaTitle: 'Welcome to the YTOP Global Blog',
          metaDescription:
            'Welcome to our new blog. Stories and updates from YTOP Global.',
          featuredImageId: mediaIds[0],
        },
        {
          title: 'Why Youth Communities Matter More Than Ever',
          slug: 'why-youth-communities-matter-more-than-ever',
          excerpt:
            'Young people need spaces to connect, learn, and lead. Here is why youth communities are essential.',
          content:
            '<p>Youth communities provide a place for young people to connect, develop skills, and become leaders in their own right.</p><p>At YTOP Global we believe in the power of these communities to create lasting change.</p>',
          status: 'PUBLISHED' as const,
          authorId: admin.id,
          publishedAt: new Date(now.getTime() - 86400000),
          metaTitle: 'Why Youth Communities Matter | YTOP Global',
          metaDescription:
            'Why youth communities are essential for young people today.',
          featuredImageId: mediaIds[1],
        },
      ];

      for (const post of samplePosts) {
        await prisma.post.create({
          data: {
            ...post,
            ...(defaultCategoryId
              ? { categories: { connect: [{ id: defaultCategoryId }] } }
              : {}),
          },
        });
      }
      console.log(
        'Created',
        samplePosts.length,
        'sample blog posts (each with a different featured image)'
      );
    }

    console.log('\nSeeding complete!');
    if (adminCredentials) {
      console.log(
        '\nAdmin credentials were loaded from ADMIN_EMAIL and ADMIN_PASSWORD.'
      );
      console.log(
        'Rotate ADMIN_PASSWORD after first login if this is a shared environment.'
      );
    }
    console.log('\nVisit http://localhost:3000/blog to see the sample posts.\n');

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
