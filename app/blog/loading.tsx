import { BlogPostSkeleton, PageHeaderSkeleton } from '@/components/Skeleton';

export default function BlogLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageHeaderSkeleton />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <BlogPostSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
