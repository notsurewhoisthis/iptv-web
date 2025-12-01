import { CardSkeleton, PageHeaderSkeleton } from '@/components/Skeleton';

export default function TroubleshootingLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageHeaderSkeleton />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
