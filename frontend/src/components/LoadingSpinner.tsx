import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from '@/utils/helpers';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className 
}) => {
  return (
    <Loader2 
      className={clsx(
        'animate-spin text-gray-500',
        sizeClasses[size],
        className
      )}
      aria-label="Loading..."
    />
  );
};

export default LoadingSpinner;