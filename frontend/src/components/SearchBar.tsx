import React from 'react';
import { Search, X } from 'lucide-react';
import { clsx } from '@/utils/helpers';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  query,
  onQueryChange,
  placeholder = 'Search for dishes...',
  className,
}) => {
  const handleClear = () => {
    onQueryChange('');
  };

  return (
    <div className={clsx('relative', className)}>
      <label htmlFor="search-input" className="sr-only">
        Search menu items
      </label>
      <div className="relative">
        <Search 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 
                   text-gray-400 dark:text-gray-500" 
          aria-hidden="true"
        />
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3.5 
                   bg-white dark:bg-gray-800 
                   border border-gray-200 dark:border-gray-700 
                   rounded-2xl
                   text-gray-900 dark:text-white 
                   placeholder-gray-400 dark:placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 
                   focus:border-transparent
                   shadow-sm
                   transition-all duration-200
                   text-base"
          aria-label="Search menu items by name or description"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2
                     p-1.5 text-gray-400 dark:text-gray-500 
                     hover:text-gray-600 dark:hover:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-gray-700
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                     rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;