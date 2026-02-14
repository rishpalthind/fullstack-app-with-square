// Location types
export interface Location {
  id: string;
  name: string;
  address: string;
  timezone: string;
  status: 'ACTIVE' | 'INACTIVE';
}

// Category types  
export interface Category {
  id: string;
  name: string;
  item_count: number;
}

// Item variation types
export interface ItemVariation {
  name: string;
  price: number; // Price in cents
}

// Menu item types
export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  image_url?: string;
  variations: ItemVariation[];
}

// Catalog response type
export interface CatalogResponse {
  [categoryName: string]: MenuItem[];
}

// API response wrapper types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  timestamp: string;
  details?: any;
}

// UI state types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface SearchFilters {
  query: string;
  selectedCategory: string | null;
}

// Local storage types
export interface LocalStorageData {
  selectedLocationId: string | null;
  lastVisited: string;
}