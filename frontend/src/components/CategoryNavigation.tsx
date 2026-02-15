import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Layers, Pizza, Coffee, Sandwich, Cookie, IceCream, Salad, ChefHat } from 'lucide-react';
import { ApiService } from '@/services/api';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorState from './ErrorState';
import { clsx } from '@/utils/helpers';

interface CategoryNavigationProps {
  locationId: string;
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
  className?: string;
}

// Map category names to icons
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('pizza') || name.includes('pasta')) return Pizza;
  if (name.includes('drink') || name.includes('beverage')) return Coffee;
  if (name.includes('sandwich') || name.includes('burger')) return Sandwich;
  if (name.includes('dessert') || name.includes('cookie')) return Cookie;
  if (name.includes('ice') || name.includes('frozen')) return IceCream;
  if (name.includes('salad') || name.includes('appetizer')) return Salad;
  if (name.includes('bagel')) return Cookie;
  return ChefHat;
};

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
      onCategorySelect(null);
    } else {
      onCategorySelect(categoryId);
    }
  };

  const handleShowAll = () => {
    onCategorySelect(null);
  };

  if (isLoading) {
    return (
      <div className={clsx('space-y-2', className)}>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton
              key={i}
              className="flex-shrink-0 w-20 h-24"
              rounded="xl"
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
    return null;
  }

  return (
    <nav 
      className={clsx(className)}
      aria-label="Menu categories"
    >
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {/* Show All button */}
        <button
          onClick={handleShowAll}
          className={clsx(
            'flex-shrink-0 flex flex-col items-center justify-center',
            'w-20 h-24 rounded-2xl transition-all duration-200',
            'border-2',
            !selectedCategory
              ? 'bg-green-600 dark:bg-green-500 text-white border-green-600 dark:border-green-500 shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400'
          )}
          aria-pressed={!selectedCategory}
        >
          <Layers className={clsx('w-6 h-6 mb-1', !selectedCategory ? 'text-white' : 'text-gray-600 dark:text-gray-400')} />
          <span className="text-xs font-semibold">All</span>
        </button>
        
        {categories.map((category) => {
          const Icon = getCategoryIcon(category.name);
          const isSelected = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={clsx(
                'flex-shrink-0 flex flex-col items-center justify-center',
                'w-20 h-24 rounded-2xl transition-all duration-200',
                'border-2',
                isSelected
                  ? 'bg-green-600 dark:bg-green-500 text-white border-green-600 dark:border-green-500 shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400'
              )}
              aria-pressed={isSelected}
            >
              <Icon className={clsx('w-6 h-6 mb-1', isSelected ? 'text-white' : 'text-gray-600 dark:text-gray-400')} />
              <span className="text-xs font-semibold text-center px-1 line-clamp-2">
                {category.name}
              </span>
              {category.item_count > 0 && (
                <span className={clsx(
                  'mt-0.5 text-[10px] font-medium',
                  isSelected ? 'text-white/90' : 'text-gray-500 dark:text-gray-400'
                )}>
                  {category.item_count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default CategoryNavigation;