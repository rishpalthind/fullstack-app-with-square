import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Hash } from 'lucide-react';
import { ApiService } from '@/services/api';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorState from './ErrorState';
import { clsx, scrollToElement } from '@/utils/helpers';

interface CategoryNavigationProps {
  locationId: string;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  className?: string;
}

export const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  locationId,
  selectedCategory,
  onCategorySelect,
  className,
}) => {
  const {
    data: categories,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['categories', locationId],
    queryFn: () => ApiService.getCategories(locationId),
    enabled: !!locationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      // Deselect if clicking the same category
      onCategorySelect(null);
    } else {
      onCategorySelect(categoryId);
      // Scroll to category section
      scrollToElement(`category-${categoryId}`, 80);
    }
  };

  const handleShowAll = () => {
    onCategorySelect(null);
    scrollToElement('menu-items', 80);
  };

  if (isLoading) {
    return (
      <div className={clsx('space-y-2', className)}>
        <LoadingSkeleton className="w-20 h-8" />
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingSkeleton
              key={i}
              className="flex-shrink-0 w-24 h-10"
              rounded="full"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorState
          message="Failed to load categories"
          onRetry={() => refetch()}
          size="sm"
        />
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className={clsx('text-center p-4 text-gray-500', className)}>
        <Hash className="w-6 h-6 mx-auto mb-2" />
        <p>No categories available</p>
      </div>
    );
  }

  return (
    <nav 
      className={clsx('bg-white border-b border-gray-200', className)}
      aria-label="Menu categories"
    >
      <div className="px-4 py-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Categories
        </h2>
        
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1">
          {/* Show All button */}
          <button
            onClick={handleShowAll}
            className={clsx(
              'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
              'border border-gray-300',
              !selectedCategory
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            )}
            aria-pressed={!selectedCategory}
          >
            All Items
          </button>
          
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={clsx(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                'border border-gray-300 whitespace-nowrap',
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              )}
              aria-pressed={selectedCategory === category.id}
            >
              <span>{category.name}</span>
              <span className="ml-2 text-xs opacity-75">
                {category.item_count}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Active category indicator */}
      {selectedCategory && (
        <div className="px-4 py-2 bg-blue-50 border-t border-blue-200">
          <p className="text-sm text-blue-800">
            Showing items from{' '}
            <span className="font-medium">
              {categories.find(cat => cat.id === selectedCategory)?.name}
            </span>
          </p>
        </div>
      )}
    </nav>
  );
};

export default CategoryNavigation;