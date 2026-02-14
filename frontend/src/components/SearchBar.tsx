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
  placeholder = 'Search menu items...',
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
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
          aria-hidden="true"
        />
        <input
          id="search-input"
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 
                   bg-white border border-gray-300 rounded-lg
                   text-gray-900 placeholder-gray-500
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   text-base"
          aria-label="Search menu items by name or description"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2
                     p-1 text-gray-400 hover:text-gray-600
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                     rounded-full transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {query && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 
                      bg-blue-50 border border-blue-200 rounded-lg
                      text-sm text-blue-800">
          Searching for "{query}"
        </div>
      )}
    </div>
  );
};

export default SearchBar;