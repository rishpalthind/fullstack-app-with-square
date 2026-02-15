import React, { useState, useEffect } from 'react';
import { Menu, MapPin, Sun, Moon, User } from 'lucide-react';
import LocationSelector from '@/components/LocationSelector';
import SearchBar from '@/components/SearchBar';
import CategoryNavigation from '@/components/CategoryNavigation';
import MenuDisplay from '@/components/MenuDisplay';
import { StorageService } from '@/utils/storage';
import { useTheme } from '@/contexts/ThemeContext';

const App: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  // State management
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Load saved location on mount
  useEffect(() => {
    const savedLocationId = StorageService.getSelectedLocationId();
    if (savedLocationId) {
      setSelectedLocationId(savedLocationId);
    }
  }, []);

  // Reset category when location changes
  const handleLocationChange = (locationId: string) => {
    setSelectedLocationId(locationId);
    setSelectedCategory(null);
  };

  // Reset category when search is performed
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setSelectedCategory(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3 md:py-4">
            {/* Logo and branding */}
            <div className="flex items-center gap-3">
              <div className="bg-green-600 dark:bg-green-500 p-2 rounded-full">
                <Menu className="w-5 h-5 md:w-6 md:h-6 text-white" aria-hidden="true" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">
                  Per Diem Menu
                </h1>
                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400">
                  Restaurant menu by location
                </p>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                         text-gray-600 dark:text-gray-300 transition-colors"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
              
              {/* User icon */}
              <button
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
                         text-gray-600 dark:text-gray-300 transition-colors"
                aria-label="User menu"
              >
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Greeting and Location Info */}
        {selectedLocationId && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 
                        rounded-2xl p-4 md:p-6 shadow-sm border border-green-200 dark:border-green-800">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-green-700 dark:text-green-400 font-medium mb-1">
                  Welcome back
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  Browse our menu
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Find your favorite dishes
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Location Selection */}
        <section aria-labelledby="location-heading">
          <h2 id="location-heading" className="sr-only">
            Select Restaurant Location
          </h2>
          <LocationSelector
            selectedLocationId={selectedLocationId}
            onLocationChange={handleLocationChange}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm"
          />
        </section>

        {/* Search and Navigation */}
        {selectedLocationId && (
          <>
            <section aria-labelledby="search-heading">
              <h2 id="search-heading" className="sr-only">
                Search Menu Items
              </h2>
              <SearchBar
                query={searchQuery}
                onQueryChange={handleSearchChange}
              />
            </section>

            <CategoryNavigation
              locationId={selectedLocationId}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
          </>
        )}

        {/* Menu Display */}
        {selectedLocationId ? (
          <section aria-labelledby="menu-heading">
            <h2 id="menu-heading" className="sr-only">
              Menu Items
            </h2>
            <MenuDisplay
              locationId={selectedLocationId}
              selectedCategory={selectedCategory}
              searchQuery={searchQuery}
            />
          </section>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Choose a Location
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Select a restaurant location above to view the menu items available at that location.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container max-w-7xl mx-auto py-8">
          <div className="text-center text-gray-500 text-sm">
            <p>© 2025 Per Diem Restaurant Menu</p>
            <p className="mt-2">
              Built with React, TypeScript, and Square API
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;