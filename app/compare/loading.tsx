import { CardSkeleton, PageHeaderSkeleton } from '@/components/Skeleton';

export default function CompareLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageHeaderSkeleton />
      <div className="grid md:grid-cols-2 gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
