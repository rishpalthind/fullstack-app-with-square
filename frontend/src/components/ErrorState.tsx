import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { clsx } from '@/utils/helpers';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong. Please try again.',
  onRetry,
  className,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'text-sm p-4',
    md: 'text-base p-6',
    lg: 'text-lg p-8',
  };

  return (
    <div 
      className={clsx(
        'flex flex-col items-center justify-center text-center',
        'bg-red-50 border border-red-200 rounded-lg',
        sizeClasses[size],
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <AlertTriangle 
        className="w-8 h-8 text-red-500 mb-3" 
        aria-hidden="true"
      />
      <p className="text-red-800 mb-4 max-w-md">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium 
                   text-red-700 bg-red-100 border border-red-300 rounded-md
                   hover:bg-red-200 focus:outline-none focus:ring-2 
                   focus:ring-red-500 focus:ring-offset-2 transition-colors"
          aria-label="Retry loading"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;