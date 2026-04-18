import { getMongoDb } from '@/lib/mongodb';
import { BLOG_POSTS_COLLECTION } from '@/lib/mongo-posts-store';

/**
 * Count how many published-ish records still reference this media id.
 */
export async function countMongoMediaReferences(mediaId: string): Promise<number> {
  const db = await getMongoDb();
  const [posts, team, programs, events, campaigns, testimonials] =
    await Promise.all([
      db.collection(BLOG_POSTS_COLLECTION).countDocuments({
        featuredImageId: mediaId,
      }),
      db.collection('team_members').countDocuments({ photoId: mediaId }),
      db.collection('programs').countDocuments({ imageId: mediaId }),
      db.collection('events').countDocuments({ imageId: mediaId }),
      db.collection('campaigns').countDocuments({ imageId: mediaId }),
      db.collection('testimonials').countDocuments({ 'photo.id': mediaId }),
    ]);
  return posts + team + programs + events + campaigns + testimonials;
}
