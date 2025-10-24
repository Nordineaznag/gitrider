'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'text' | 'circle' | 'button';
  animation?: 'pulse' | 'shimmer' | 'none';
}

export function Skeleton({
  className,
  variant = 'default',
  animation = 'shimmer',
  ...props
}: SkeletonProps) {
  const baseClasses = 'bg-muted/50 rounded-lg';

  const variantClasses = {
    default: 'h-4 w-full',
    card: 'h-32 w-full rounded-2xl',
    text: 'h-3 w-3/4',
    circle: 'h-12 w-12 rounded-full',
    button: 'h-12 w-full rounded-full',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'loading-shimmer',
    none: '',
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      {...props}
    />
  );
}

// Preset Loading Components for Common Use Cases
export function CardSkeleton() {
  return (
    <div className="native-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton variant="card" className="h-24" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="native-card p-4">
          <div className="flex items-center gap-3">
            <Skeleton variant="circle" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="native-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton variant="circle" className="h-16 w-16" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton variant="button" className="h-10 w-24" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2">
        <Skeleton variant="button" className="h-10 w-24" />
        <Skeleton variant="button" className="h-10 w-24" />
        <Skeleton variant="button" className="h-10 w-24" />
      </div>

      {/* Content Skeleton */}
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function RideCardSkeleton() {
  return (
    <div className="native-card p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <Skeleton variant="circle" className="h-4 w-4 mt-1" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton variant="circle" className="h-4 w-4 mt-1" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <Skeleton className="h-5 w-16" />
        <Skeleton variant="button" className="h-8 w-20" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="native-card p-4">
      <div className="flex items-center justify-between mb-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton variant="circle" className="h-4 w-4" />
      </div>
      <Skeleton className="h-7 w-20" />
      <Skeleton className="h-3 w-32 mt-2" />
    </div>
  );
}

export function MapSkeleton() {
  return (
    <div className="native-card overflow-hidden">
      <Skeleton variant="card" className="h-[400px] rounded-2xl" animation="pulse" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="native-card p-4 space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton variant="button" className="h-12" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton variant="button" className="h-12" />
      </div>
      <Skeleton variant="button" className="h-12 w-full mt-4" />
    </div>
  );
}
