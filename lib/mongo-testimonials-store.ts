import { getMongoDb } from '@/lib/mongodb';

const COLLECTION = 'testimonials';

export type MongoTestimonialDoc = {
  id: string;
  name: string;
  position: string | null;
  company: string | null;
  content: string;
  photo: { id: string; url: string; altText: string | null } | null;
  rating: number | null;
  isFeatured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function mongoTestimonialsList(options: {
  featuredOnly: boolean;
  limit: number;
}): Promise<MongoTestimonialDoc[]> {
  const db = await getMongoDb();
  const filter: Record<string, unknown> = {};
  if (options.featuredOnly) filter.isFeatured = true;
  return db
    .collection<MongoTestimonialDoc>(COLLECTION)
    .find(filter)
    .sort({ order: 1 })
    .limit(options.limit)
    .toArray();
}
