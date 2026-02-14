import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Package } from 'lucide-react';
import type { CatalogResponse } from '@/types';
import { ApiService } from '@/services/api';
import MenuItemCard from './MenuItemCard';
import { CardSkeleton } from './LoadingSkeleton';
import ErrorState from './ErrorState';
import { clsx, isEmpty } from '@/utils/helpers';

interface MenuDisplayProps {
  locationId: string;
  selectedCategory: string | null;
  searchQuery: string;
  className?: string;
}

export const MenuDisplay: React.FC<MenuDisplayProps> = ({
  locationId,
  selectedCategory,
  searchQuery,
  className,
}) => {
  const {
    data: catalogData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['catalog', locationId],
    queryFn: () => ApiService.getCatalogItems(locationId),
    enabled: !!locationId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter and search items
  const filteredItems = useMemo(() => {
    if (!catalogData) return {};

    const result: CatalogResponse = {};
    
    Object.entries(catalogData).forEach(([categoryName, items]) => {
      // Filter by category if selected
      if (selectedCategory && selectedCategory !== categoryName.toLowerCase().replace(/\s+/g, '-')) {
        return;
      }

      // Filter by search query
      const searchFiltered = isEmpty(searchQuery)
        ? items
        : items.filter((item) => {
            const query = searchQuery.toLowerCase();
            return (
              item.name.toLowerCase().includes(query) ||
              (item.description && item.description.toLowerCase().includes(query))
            );
          });

      if (searchFiltered.length > 0) {
        result[categoryName] = searchFiltered;
      }
    });

    return result;
  }, [catalogData, selectedCategory, searchQuery]);

  const totalFilteredItems = useMemo(() => {
    return Object.values(filteredItems).reduce((sum, items) => sum + items.length, 0);
  }, [filteredItems]);

  const hasActiveFilters = !isEmpty(searchQuery) || selectedCategory !== null;

  if (isLoading) {
    return (
      <div className={clsx('space-y-6', className)}>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorState
          message="Failed to load menu items"
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!catalogData || Object.keys(catalogData).length === 0) {
    return (
      <div className={clsx('text-center py-12', className)}>
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No menu items available
        </h3>
        <p className="text-gray-500">
          This location doesn't have any menu items yet.
        </p>
      </div>
    );
  }

  if (totalFilteredItems === 0) {
    return (
      <div className={clsx('text-center py-12', className)}>
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {hasActiveFilters ? 'No matching items found' : 'No items available'}
        </h3>
        <p className="text-gray-500">
          {hasActiveFilters
            ? 'Try adjusting your search or category filter.'
            : 'This location doesn\'t have any menu items.'}
        </p>
      </div>
    );
  }

  return (
    <div id="menu-items" className={clsx('space-y-8', className)}>
      {/* Results summary */}
      {hasActiveFilters && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">
            Found <span className="font-medium">{totalFilteredItems}</span> item
            {totalFilteredItems !== 1 ? 's' : ''}
            {!isEmpty(searchQuery) && (
              <span> matching "{searchQuery}"</span>
            )}
            {selectedCategory && (
              <span> in {Object.keys(filteredItems)[0] || 'selected category'}</span>
            )}
          </p>
        </div>
      )}

      {/* Menu items grouped by category */}
      {Object.entries(filteredItems).map(([categoryName, items]) => (
        <section
          key={categoryName}
          id={`category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}
          className="animate-fade-in"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {categoryName}
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <MenuItemCard 
                key={item.id} 
                item={item}
                className="h-full"
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default MenuDisplay;