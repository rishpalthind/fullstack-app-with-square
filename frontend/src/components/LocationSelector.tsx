import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, MapPin } from 'lucide-react';
import { ApiService } from '@/services/api';
import { StorageService } from '@/utils/storage';
import LoadingSpinner from './LoadingSpinner';
import ErrorState from './ErrorState';
import { clsx } from '@/utils/helpers';

interface LocationSelectorProps {
  selectedLocationId: string | null;
  onLocationChange: (locationId: string) => void;
  className?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  selectedLocationId,
  onLocationChange,
  className,
}) => {
  const {
    data: locations,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['locations'],
    queryFn: ApiService.getLocations,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const selectedLocation = locations?.find(loc => loc.id === selectedLocationId);

  const handleLocationSelect = (locationId: string) => {
    onLocationChange(locationId);
    StorageService.setSelectedLocationId(locationId);
  };

  if (isLoading) {
    return (
      <div className={clsx('flex items-center gap-2 p-4', className)}>
        <MapPin className="w-5 h-5 text-gray-400" />
        <LoadingSpinner size="sm" />
        <span className="text-gray-500">Loading locations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorState
          message="Failed to load locations"
          onRetry={() => refetch()}
          size="sm"
        />
      </div>
    );
  }

  if (!locations || locations.length === 0) {
    return (
      <div className={clsx('flex items-center gap-2 p-4 text-gray-500', className)}>
        <MapPin className="w-5 h-5" />
        <span>No locations available</span>
      </div>
    );
  }

  return (
    <div className={clsx('relative', className)}>
      <label htmlFor="location-select" className="sr-only">
        Select restaurant location
      </label>
      <div className="relative">
        <MapPin 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
          aria-hidden="true"
        />
        <select
          id="location-select"
          value={selectedLocationId || ''}
          onChange={(e) => handleLocationSelect(e.target.value)}
          className="appearance-none w-full pl-10 pr-10 py-3 
                   bg-white border border-gray-300 rounded-lg
                   text-gray-900 text-base font-medium
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                   disabled:bg-gray-50 disabled:text-gray-500"
          aria-label="Select restaurant location"
        >
          <option value="" disabled>
            Choose a location
          </option>
          {locations.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
        <ChevronDown 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" 
          aria-hidden="true"
        />
      </div>
      
      {selectedLocation && (
        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-blue-900">
                {selectedLocation.name}
              </p>
              <p className="text-blue-700 mt-1">
                {selectedLocation.address}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;