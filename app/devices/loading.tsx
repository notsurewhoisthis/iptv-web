import { DeviceCardSkeleton, PageHeaderSkeleton } from '@/components/Skeleton';

export default function DevicesLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageHeaderSkeleton />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <DeviceCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
