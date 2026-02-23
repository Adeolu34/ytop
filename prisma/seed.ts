import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import prisma from '../lib/db';

dotenv.config();

async function main() {
  console.log('Seeding database...');

  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
      where: { email: 'admin@ytopglobal.org' },
      update: {},
      create: {
        email: 'admin@ytopglobal.org',
        name: 'Admin User',
        hashedPassword,
        role: 'ADMIN',
        bio: 'System Administrator',
      },
    });

    console.log('✓ Created admin user:', admin.email);

    // Create default settings
    const settings = [
      { key: 'site_name', value: 'YTOP Global', group: 'general' },
      { key: 'site_tagline', value: 'Young Talented Optimistic and Potential Organization', group: 'general' },
      { key: 'contact_email', value: 'info@ytopglobal.org', group: 'general' },
      { key: 'contact_phone', value: '+1 (234) 567-890', group: 'general' },
      { key: 'facebook_url', value: 'https://facebook.com/ytopglobal', group: 'social' },
      { key: 'twitter_url', value: 'https://twitter.com/ytopglobal', group: 'social' },
      { key: 'linkedin_url', value: 'https://linkedin.com/company/ytopglobal', group: 'social' },
      { key: 'instagram_url', value: 'https://instagram.com/ytopglobal', group: 'social' },
    ];

    for (const setting of settings) {
      await prisma.settings.upsert({
        where: { key: setting.key },
        update: { value: setting.value },
        create: setting,
      });
    }

    console.log('✓ Created default settings');

    // Create a default category if none exist
    const categoryCount = await prisma.category.count();
    let defaultCategoryId: string | null = null;
    if (categoryCount === 0) {
      const cat = await prisma.category.create({
        data: {
          name: 'News',
          slug: 'news',
          description: 'Updates and news from YTOP Global',
        },
      });
      defaultCategoryId = cat.id;
      console.log('✓ Created default category: News');
    }

    // Create sample blog posts if none exist (each with a different featured image)
    const postCount = await prisma.post.count();
    if (postCount === 0) {
      const now = new Date();
      // Reusable local image paths for featured images so each post looks different
      const sampleImageUrls = [
        { url: '/media/2021/10/IMG_9658-scaled.jpg', alt: 'YTOP program' },
        { url: '/media/2021/10/IMG_9586-scaled.jpg', alt: 'YTOP team workshop' },
        { url: '/media/2021/10/IMG_9724-scaled.jpg', alt: 'Youth gathering' },
      ];
      const mediaIds: string[] = [];
      for (const img of sampleImageUrls) {
        const m = await prisma.media.create({
          data: {
            filename: img.url.split('/').pop() || 'image.jpg',
            originalName: img.url.split('/').pop() || 'image.jpg',
            url: img.url,
            mimeType: 'image/jpeg',
            fileSize: 0,
            type: 'IMAGE',
            altText: img.alt,
          },
        });
        mediaIds.push(m.id);
      }

      const samplePosts = [
        {
          title: 'Welcome to the YTOP Global Blog',
          slug: 'welcome-to-the-ytop-global-blog',
          excerpt: 'Welcome to our new blog. Here we share stories, insights, and updates from our work with young people around the world.',
          content: '<p>Welcome to the YTOP Global blog. We are excited to share updates, stories, and insights from our programs and the young people we work with.</p><p>Stay tuned for more posts about leadership, career development, and community impact.</p>',
          status: 'PUBLISHED' as const,
          authorId: admin.id,
          publishedAt: now,
          metaTitle: 'Welcome to the YTOP Global Blog',
          metaDescription: 'Welcome to our new blog. Stories and updates from YTOP Global.',
          featuredImageId: mediaIds[0],
        },
        {
          title: 'Why Youth Communities Matter More Than Ever',
          slug: 'why-youth-communities-matter-more-than-ever',
          excerpt: 'Young people need spaces to connect, learn, and lead. Here is why youth communities are essential.',
          content: '<p>Youth communities provide a place for young people to connect, develop skills, and become leaders in their own right.</p><p>At YTOP Global we believe in the power of these communities to create lasting change.</p>',
          status: 'PUBLISHED' as const,
          authorId: admin.id,
          publishedAt: new Date(now.getTime() - 86400000),
          metaTitle: 'Why Youth Communities Matter | YTOP Global',
          metaDescription: 'Why youth communities are essential for young people today.',
          featuredImageId: mediaIds[1],
        },
      ];

      for (const post of samplePosts) {
        await prisma.post.create({
          data: {
            ...post,
            ...(defaultCategoryId ? { categories: { connect: [{ id: defaultCategoryId }] } } : {}),
          },
        });
      }
      console.log('✓ Created', samplePosts.length, 'sample blog posts (each with a different featured image)');
    }

    console.log('\nSeeding complete!');
    console.log('\nDefault admin credentials:');
    console.log('  Email: admin@ytopglobal.org');
    console.log('  Password: admin123');
    console.log('\n⚠️  Please change the password after first login!');
    console.log('\nVisit http://localhost:3000/blog to see the sample posts.\n');

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
