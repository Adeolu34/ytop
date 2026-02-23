import { FileText, File, Image, Users, Eye, MessageSquare } from 'lucide-react';
import prisma from '@/lib/db';
import { requireAuth } from '@/lib/auth-utils';

export default async function AdminDashboard() {
  await requireAuth();

  // Get statistics
  const [
    postsCount,
    pagesCount,
    mediaCount,
    teamCount,
    publishedPosts,
    draftPosts,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.page.count(),
    prisma.media.count(),
    prisma.teamMember.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.post.count({ where: { status: 'DRAFT' } }),
  ]);

  // Get recent posts
  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: { name: true },
      },
    },
  });

  const stats = [
    {
      label: 'Total Posts',
      value: postsCount,
      icon: FileText,
      color: 'blue',
      subtext: `${publishedPosts} published, ${draftPosts} drafts`,
    },
    {
      label: 'Total Pages',
      value: pagesCount,
      icon: File,
      color: 'indigo',
    },
    {
      label: 'Media Files',
      value: mediaCount,
      icon: Image,
      color: 'purple',
    },
    {
      label: 'Team Members',
      value: teamCount,
      icon: Users,
      color: 'pink',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your content management system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
              {stat.subtext && (
                <div className="text-xs text-gray-500 mt-2">{stat.subtext}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {recentPosts.length > 0 ? (
            recentPosts.map((post) => (
              <div key={post.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>By {post.author.name}</span>
                      <span>•</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className={`px-2 py-0.5 rounded ${
                        post.status === 'PUBLISHED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`/admin/posts/${post.id}/edit`}
                    className="ml-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                  >
                    Edit
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              No posts yet. Create your first post!
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/admin/posts/new"
          className="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg shadow-sm hover:shadow-lg transition text-center"
        >
          <FileText className="w-8 h-8 mx-auto mb-3" />
          <div className="font-semibold">Create New Post</div>
        </a>
        <a
          href="/admin/pages/new"
          className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:shadow-lg transition text-center"
        >
          <File className="w-8 h-8 mx-auto mb-3" />
          <div className="font-semibold">Create New Page</div>
        </a>
        <a
          href="/admin/media"
          className="p-6 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-lg shadow-sm hover:shadow-lg transition text-center"
        >
          <Image className="w-8 h-8 mx-auto mb-3" />
          <div className="font-semibold">Upload Media</div>
        </a>
      </div>
    </div>
  );
}
