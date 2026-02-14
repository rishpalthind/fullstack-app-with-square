import React from 'react';
import { clsx } from '@/utils/helpers';

interface LoadingSkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

const roundedClasses = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  width = 'w-full',
  height = 'h-4',
  rounded = 'md',
}) => {
  return (
    <div
      className={clsx(
        'animate-pulse bg-gray-200',
        width,
        height,
        roundedClasses[rounded],
        className
      )}
      aria-hidden="true"
    />
  );
};

// Common skeleton patterns
export const TextSkeleton: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 1, 
  className 
}) => (
  <div className={clsx('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <LoadingSkeleton
        key={i}
        width={i === lines - 1 ? 'w-3/4' : 'w-full'}
        className="h-4"
      />
    ))}
  </div>
);

export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('p-4 border border-gray-200 rounded-lg', className)}>
    <LoadingSkeleton className="w-full h-48 mb-4" rounded="md" />
    <LoadingSkeleton className="w-3/4 h-6 mb-2" />
    <TextSkeleton lines={2} />
    <LoadingSkeleton className="w-1/2 h-4 mt-4" />
  </div>
);

export default LoadingSkeleton;