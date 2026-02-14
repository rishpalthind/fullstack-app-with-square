import React, { useState, useEffect } from 'react';
import { Menu, MapPin } from 'lucide-react';
import LocationSelector from '@/components/LocationSelector';
import SearchBar from '@/components/SearchBar';
import CategoryNavigation from '@/components/CategoryNavigation';
import MenuDisplay from '@/components/MenuDisplay';
import { StorageService } from '@/utils/storage';
import { debounce } from '@/utils/helpers';

const App: React.FC = () => {
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

  // Debounced search to avoid excessive API calls
  const debouncedSetSearchQuery = debounce(setSearchQuery, 300);

  // Reset category when location changes
  const handleLocationChange = (locationId: string) => {
    setSelectedLocationId(locationId);
    setSelectedCategory(null);
  };

  // Reset category when search is performed
  const handleSearchChange = (query: string) => {
    debouncedSetSearchQuery(query);
    if (query.trim()) {
      setSelectedCategory(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Menu className="w-8 h-8 text-blue-600" aria-hidden="true" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Per Diem Menu
                </h1>
                <p className="text-sm text-gray-500">
                  Restaurant menu by location
                </p>
              </div>
            </div>
            
            {/* Location indicator for mobile */}
            {selectedLocationId && (
              <div className="flex items-center gap-2 text-sm text-gray-600 md:hidden">
                <MapPin className="w-4 h-4" />
                <span className="truncate max-w-[120px]">
                  Location selected
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container max-w-7xl mx-auto py-6 space-y-6">
        {/* Location Selection */}
        <section aria-labelledby="location-heading">
          <h2 id="location-heading" className="sr-only">
            Select Restaurant Location
          </h2>
          <LocationSelector
            selectedLocationId={selectedLocationId}
            onLocationChange={handleLocationChange}
            className="bg-white rounded-lg shadow-sm"
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
                className="bg-white rounded-lg shadow-sm p-4"
              />
            </section>

            <CategoryNavigation
              locationId={selectedLocationId}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              className="rounded-lg shadow-sm"
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
              className="bg-white rounded-lg shadow-sm p-6"
            />
          </section>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Choose a Location
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
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