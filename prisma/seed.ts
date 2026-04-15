import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Prisma } from '../app/generated/prisma';
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

    // Seed additional platform users
    const supportingUsers = [
      {
        email: 'editor@ytopglobal.org',
        name: 'YTOP Editor',
        role: 'EDITOR' as const,
      },
      {
        email: 'author@ytopglobal.org',
        name: 'YTOP Author',
        role: 'AUTHOR' as const,
      },
    ];
    for (const user of supportingUsers) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          role: user.role,
        },
        create: {
          email: user.email,
          name: user.name,
          role: user.role,
        },
      });
    }
    console.log('Created/updated supporting users');

    // Seed baseline team members
    const teamSeeds = [
      {
        name: 'Abayomi Adewumi',
        slug: 'abayomi-adewumi',
        position: 'Founder & Executive Director',
        bio: 'Leads YTOP Global strategy and cross-program execution.',
        teamSection: 'core',
        order: 1,
      },
      {
        name: 'Adedayo Adeniyi',
        slug: 'adedayo-adeniyi',
        position: 'Programs Manager',
        bio: 'Coordinates education and leadership programs across communities.',
        teamSection: 'core',
        order: 2,
      },
      {
        name: 'Adeosun Ilerioluwa',
        slug: 'adeosun-ilerioluwa',
        position: 'Community Engagement Lead',
        bio: 'Builds partnerships and volunteer engagement pipelines.',
        teamSection: 'community',
        order: 3,
      },
    ];
    for (const member of teamSeeds) {
      await prisma.teamMember.upsert({
        where: { slug: member.slug },
        update: {
          name: member.name,
          position: member.position,
          bio: member.bio,
          teamSection: member.teamSection,
          order: member.order,
          isActive: true,
        },
        create: {
          ...member,
          isActive: true,
        },
      });
    }
    console.log('Created/updated team members');

    // Seed core programs
    const programSeeds = [
      {
        title: 'Project 300',
        slug: 'project-300',
        description:
          'A school mentorship and impact program empowering students through guidance, life skills, and leadership support.',
        shortDesc: 'School mentorship and leadership development program.',
        sdgGoals: ['4', '8', '10'],
        order: 1,
      },
      {
        title: 'Rise of Warriors',
        slug: 'rise-of-warriors',
        description:
          'A transformational youth leadership program focused on mindset, discipline, and purposeful community impact.',
        shortDesc: 'Youth leadership and personal transformation program.',
        sdgGoals: ['4', '5', '8', '16'],
        order: 2,
      },
    ];
    for (const program of programSeeds) {
      await prisma.program.upsert({
        where: { slug: program.slug },
        update: {
          title: program.title,
          description: program.description,
          shortDesc: program.shortDesc,
          sdgGoals: program.sdgGoals,
          order: program.order,
          isActive: true,
        },
        create: {
          ...program,
          isActive: true,
        },
      });
    }
    console.log('Created/updated programs');

    // Seed upcoming event
    const rowProgram = await prisma.program.findUnique({
      where: { slug: 'rise-of-warriors' },
      select: { id: true },
    });
    await prisma.event.upsert({
      where: { slug: 'rise-of-warriors-bootcamp' },
      update: {
        title: 'Rise of Warriors Bootcamp',
        description:
          'A practical training bootcamp for young leaders, with mentorship and project execution support.',
        startDate: new Date('2026-06-15T09:00:00.000Z'),
        endDate: new Date('2026-06-15T16:00:00.000Z'),
        location: 'Lagos, Nigeria',
        isOnline: false,
        registrationUrl: 'https://ytopglobal.org/get-involved',
        galleryImageIds: [],
        programId: rowProgram?.id ?? null,
      },
      create: {
        title: 'Rise of Warriors Bootcamp',
        slug: 'rise-of-warriors-bootcamp',
        description:
          'A practical training bootcamp for young leaders, with mentorship and project execution support.',
        startDate: new Date('2026-06-15T09:00:00.000Z'),
        endDate: new Date('2026-06-15T16:00:00.000Z'),
        location: 'Lagos, Nigeria',
        isOnline: false,
        registrationUrl: 'https://ytopglobal.org/get-involved',
        galleryImageIds: [],
        programId: rowProgram?.id ?? null,
      },
    });
    console.log('Created/updated event');

    // Seed donation campaign
    await prisma.campaign.upsert({
      where: { slug: 'project-300-fundraiser' },
      update: {
        title: 'Project 300 Fundraiser',
        description:
          'Support school outreach, mentorship resources, and youth development activities through Project 300.',
        goalAmount: new Prisma.Decimal('10000.00'),
        raisedAmount: new Prisma.Decimal('2500.00'),
        currency: 'USD',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-12-31T23:59:59.000Z'),
        isActive: true,
      },
      create: {
        title: 'Project 300 Fundraiser',
        slug: 'project-300-fundraiser',
        description:
          'Support school outreach, mentorship resources, and youth development activities through Project 300.',
        goalAmount: new Prisma.Decimal('10000.00'),
        raisedAmount: new Prisma.Decimal('2500.00'),
        currency: 'USD',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-12-31T23:59:59.000Z'),
        isActive: true,
      },
    });
    console.log('Created/updated donation campaign');

    // Seed a sample donation form submission so admin has records to test.
    // Avoid relying on a composite unique index that may not exist in every DB yet.
    const existingDonationSubmission = await prisma.formSubmission.findFirst({
      where: {
        type: 'DONATION',
        email: 'donor@example.com',
      },
      select: { id: true },
    });

    if (existingDonationSubmission) {
      await prisma.formSubmission.update({
        where: { id: existingDonationSubmission.id },
        data: {
          name: 'Sample Donor',
          data: {
            amount: 100,
            currency: 'USD',
            channel: 'seed',
            note: 'Seed donation record for admin testing',
          },
          isRead: false,
          isProcessed: false,
        },
      });
    } else {
      await prisma.formSubmission.create({
        data: {
          type: 'DONATION',
          name: 'Sample Donor',
          email: 'donor@example.com',
          phone: null,
          data: {
            amount: 100,
            currency: 'USD',
            channel: 'seed',
            note: 'Seed donation record for admin testing',
          },
          isRead: false,
          isProcessed: false,
          ipAddress: '127.0.0.1',
          userAgent: 'seed-script',
        },
      });
    }
    console.log('Created/updated sample donation submission');

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
