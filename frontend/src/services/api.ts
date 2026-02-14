import axios, { AxiosResponse } from 'axios';
import { ApiResponse, Location, Category, CatalogResponse } from '@/types';

// Configure axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('📡 Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });
    
    // Transform error for consistent handling
    const apiError = {
      message: error.response?.data?.message || 'An unexpected error occurred',
      status: error.response?.status || 500,
      details: error.response?.data?.details,
    };
    
    return Promise.reject(apiError);
  }
);

/**
 * API service for restaurant menu application
 */
export class ApiService {
  /**
   * Fetch all active locations
   */
  static async getLocations(): Promise<Location[]> {
    const response: AxiosResponse<ApiResponse<Location[]>> = await api.get('/locations');
    return response.data.data;
  }

  /**
   * Fetch catalog items for a specific location
   */
  static async getCatalogItems(locationId: string): Promise<CatalogResponse> {
    const response: AxiosResponse<ApiResponse<CatalogResponse>> = await api.get('/catalog', {
      params: { location_id: locationId },
    });
    return response.data.data;
  }

  /**
   * Fetch categories for a specific location
   */
  static async getCategories(locationId: string): Promise<Category[]> {
    const response: AxiosResponse<ApiResponse<Category[]>> = await api.get('/catalog/categories', {
      params: { location_id: locationId },
    });
    return response.data.data;
  }
}

export default ApiService;