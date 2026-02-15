import React, { useState } from 'react';
import { ImageOff, Star, ShoppingCart, Info } from 'lucide-react';
import { MenuItem } from '@/types';
import { formatPrice, clsx } from '@/utils/helpers';

interface MenuItemCardProps {
  item: MenuItem;
  className?: string;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  className 
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const hasImage = item.image_url && !imageError;

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Get the first variation price or show range
  const getPrice = () => {
    if (item.variations.length === 0) return 'N/A';
    if (item.variations.length === 1) {
      return formatPrice(item.variations[0].price);
    }
    const prices = item.variations.map(v => v.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return `${formatPrice(min)} - ${formatPrice(max)}`;
  };

  // Generate random rating for demo (in real app, get from API)
  const rating = (3.5 + Math.random() * 1.5).toFixed(1);

  return (
    <article 
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-2xl overflow-hidden',
        'shadow-sm hover:shadow-lg dark:hover:shadow-green-500/10 transition-all duration-300',
        'border border-gray-100 dark:border-gray-700',
        'group cursor-pointer',
        'animate-fade-in',
        className
      )}
      aria-labelledby={`item-${item.id}-name`}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {hasImage ? (
          <>
            <img
              src={item.image_url}
              alt={item.name}
              className={clsx(
                'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105',
                imageLoading ? 'opacity-0' : 'opacity-100'
              )}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 dark:border-gray-600 border-t-green-600 rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
            <ImageOff className="w-12 h-12" aria-hidden="true" />
          </div>
        )}
        
        {/* Rating badge */}
        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full 
                       bg-gray-900/75 dark:bg-gray-800/90 backdrop-blur-sm">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-white">{rating}</span>
          </div>
        </div>

        {/* Special badge (if left in stock) */}
        {Math.random() > 0.7 && (
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 rounded-full text-xs font-bold
                           bg-yellow-400 text-gray-900">
              {Math.floor(Math.random() * 5) + 1} LEFT
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Item name and price */}
        <div className="mb-2">
          <h3 
            id={`item-${item.id}-name`}
            className="text-base md:text-lg font-bold text-gray-900 dark:text-white mb-1 line-clamp-1"
          >
            {item.name}
          </h3>
          <p className="text-lg md:text-xl font-bold text-green-600 dark:text-green-500">
            {getPrice()}
          </p>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {item.description}
          </p>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4
                     bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600
                     text-white font-semibold rounded-xl
                     transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={`Add ${item.name} to cart`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
          
          <button
            className="p-2.5 border-2 border-green-600 dark:border-green-500 
                     text-green-600 dark:text-green-500 rounded-xl
                     hover:bg-green-50 dark:hover:bg-green-900/20
                     transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            aria-label={`View ${item.name} details`}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Variations info */}
        {item.variations.length > 1 && (
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {item.variations.length} options available
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

export default MenuItemCard;
