import React, { useState } from 'react';
import { ImageOff, ChevronDown, ChevronUp } from 'lucide-react';
import { MenuItem } from '@/types';
import { formatPrice, truncateText, clsx } from '@/utils/helpers';

interface MenuItemCardProps {
  item: MenuItem;
  className?: string;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ 
  item, 
  className 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const hasImage = item.image_url && !imageError;
  const hasDescription = item.description && item.description.trim().length > 0;
  const shouldTruncateDescription = hasDescription && item.description!.length > 150;
  const displayDescription = shouldTruncateDescription && !isDescriptionExpanded
    ? truncateText(item.description!, 150)
    : item.description;

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Format variations for display
  const formatVariations = () => {
    if (item.variations.length === 0) return null;
    
    if (item.variations.length === 1) {
      return formatPrice(item.variations[0].price);
    }
    
    return item.variations
      .map(v => `${v.name} ${formatPrice(v.price)}`)
      .join(' · ');
  };

  const priceDisplay = formatVariations();

  return (
    <article 
      className={clsx(
        'bg-white border border-gray-200 rounded-lg overflow-hidden',
        'shadow-sm hover:shadow-md transition-shadow duration-200',
        'animate-fade-in',
        className
      )}
      aria-labelledby={`item-${item.id}-name`}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {hasImage ? (
          <>
            <img
              src={item.image_url}
              alt={`${item.name} - Menu item image`}
              className={clsx(
                'w-full h-full object-cover',
                imageLoading ? 'opacity-0' : 'opacity-100'
              )}
              onError={handleImageError}
              onLoad={handleImageLoad}
              loading="lazy"
            />
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageOff className="w-12 h-12" aria-hidden="true" />
          </div>
        )}
        
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                         bg-white/90 text-gray-700 border border-gray-200 backdrop-blur-sm">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Item name and price */}
        <div className="flex justify-between items-start mb-2">
          <h3 
            id={`item-${item.id}-name`}
            className="text-lg font-semibold text-gray-900 leading-tight flex-1 pr-2"
          >
            {item.name}
          </h3>
          {priceDisplay && (
            <div className="text-lg font-bold text-green-600 flex-shrink-0">
              {priceDisplay}
            </div>
          )}
        </div>

        {/* Description */}
        {hasDescription && (
          <div className="mb-3">
            <p className="text-gray-600 text-sm leading-relaxed">
              {displayDescription}
            </p>
            {shouldTruncateDescription && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="inline-flex items-center gap-1 mt-1 text-blue-600 hover:text-blue-800
                         text-sm font-medium transition-colors
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                         rounded-sm"
                aria-expanded={isDescriptionExpanded}
                aria-label={isDescriptionExpanded ? 'Show less description' : 'Show more description'}
              >
                {isDescriptionExpanded ? (
                  <>
                    <span>Show less</span>
                    <ChevronUp className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <span>Read more</span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Multiple variations display */}
        {item.variations.length > 1 && (
          <div className="border-t border-gray-100 pt-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Available Options:
            </h4>
            <div className="space-y-1">
              {item.variations.map((variation, index) => (
                <div 
                  key={`${variation.name}-${index}`}
                  className="flex justify-between items-center text-sm"
                >
                  <span className="text-gray-600">{variation.name}</span>
                  <span className="font-medium text-green-600">
                    {formatPrice(variation.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default MenuItemCard;