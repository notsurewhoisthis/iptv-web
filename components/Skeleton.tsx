import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800',
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

export function PlayerCardSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-4/5 mb-4" />
      <div className="flex items-center gap-4">
        <Skeleton className="h-5 w-16" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  );
}

export function DeviceCardSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div>
          <Skeleton className="h-6 w-28 mb-1" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-14 rounded" />
        <Skeleton className="h-6 w-14 rounded" />
        <Skeleton className="h-6 w-14 rounded" />
      </div>
    </div>
  );
}

export function BlogPostSkeleton() {
  return (
    <article className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </article>
  );
}

export function GuideCardSkeleton() {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-5">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <Skeleton className="h-5 w-full mb-2" />
      <Skeleton className="h-4 w-4/5 mb-3" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <tr className="border-b border-gray-200 dark:border-gray-800">
      <td className="py-4 px-4">
        <Skeleton className="h-5 w-24" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-5 w-32" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-5 w-20" />
      </td>
      <td className="py-4 px-4">
        <Skeleton className="h-5 w-16" />
      </td>
    </tr>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="mb-8">
      <Skeleton className="h-10 w-64 mb-4" />
      <Skeleton className="h-5 w-full max-w-2xl mb-2" />
      <Skeleton className="h-5 w-3/4 max-w-xl" />
    </div>
  );
}
