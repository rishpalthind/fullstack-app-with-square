import { Client, Environment } from 'square';
import type { CatalogObject, Location as SquareLocation } from 'square';
import { config } from '../config/config';
import { logger } from '../utils/logger';
import { CacheService } from './cache.service';
import {
  Location,
  Category,
  CatalogResponse,
  MenuItem,
} from '../types/api';

/**
 * Service for interacting with Square API
 */
export class SquareService {
  private client: Client;
  private cache: CacheService;

  constructor() {
    this.client = new Client({
      accessToken: config.square.accessToken,
      environment: config.square.environment === 'production' 
        ? Environment.Production 
        : Environment.Sandbox,
    });
    this.cache = CacheService.getInstance();
  }

  /**
   * Fetch all active locations from Square
   */
  async getLocations(): Promise<Location[]> {
    const cacheKey = 'square:locations';
    
    try {
      // Check cache first
      const cached = await this.cache.get<Location[]>(cacheKey);
      if (cached) {
        return cached;
      }

      logger.info('Fetching locations from Square API');
      const { result } = await this.client.locationsApi.listLocations();
      
      if (!result.locations) {
        logger.warn('No locations found in Square response');
        return [];
      }

      const locations: Location[] = [];
      
      for (const location of result.locations) {
        if (location.status === 'ACTIVE') {
          locations.push({
            id: location.id || '',
            name: location.name || 'Unknown Location',
            address: this.formatAddress(location),
            timezone: location.timezone || 'UTC',
            status: location.status,
          });
        }
      }

      // Cache for 10 minutes
      await this.cache.set(cacheKey, locations, 600);
      
      logger.info(`Retrieved ${locations.length} active locations`);
      return locations;
    } catch (error) {
      logger.error('Error fetching locations:', error);
      throw new Error('Failed to fetch locations from Square API');
    }
  }

  /**
   * Fetch catalog items for a specific location
   */
  async getCatalogItems(locationId: string): Promise<CatalogResponse> {
    const cacheKey = `square:catalog:${locationId}`;
    
    try {
      // Check cache first
      const cached = await this.cache.get<CatalogResponse>(cacheKey);
      if (cached) {
        return cached;
      }

      logger.info(`Fetching catalog for location ${locationId}`);
      
      const allItems: CatalogObject[] = [];
      const allRelatedObjects: CatalogObject[] = [];
      let cursor: string | undefined;

      // Handle pagination
      do {
        const { result } = await this.client.catalogApi.searchCatalogObjects({
          objectTypes: ['ITEM'],
          includeRelatedObjects: true,
          cursor,
        });

        if (result.objects) {
          allItems.push(...result.objects);
        }

        if (result.relatedObjects) {
          allRelatedObjects.push(...result.relatedObjects);
        }

        cursor = result.cursor;
      } while (cursor);

      logger.info(`Square API returned ${allItems.length} total items`);
      logger.info(`Square API returned ${allRelatedObjects.length} related objects`);

      // Create lookup maps for related objects
      const categoryMap = new Map<string, string>();
      const imageMap = new Map<string, string>();

      allRelatedObjects.forEach((obj) => {
        if (obj.type === 'CATEGORY' && obj.categoryData?.name) {
          categoryMap.set(obj.id, obj.categoryData.name);
        }
        if (obj.type === 'IMAGE' && obj.imageData?.url) {
          imageMap.set(obj.id, obj.imageData.url);
        }
      });

      // Filter items for the specific location and transform them
      const locationItems: MenuItem[] = [];
      
      for (const item of allItems) {
        if (this.isItemAvailableAtLocation(item, locationId)) {
          const menuItem = this.transformSquareItemToMenuItem(item, categoryMap, imageMap);
          if (menuItem) {
            locationItems.push(menuItem);
          }
        }
      }

      // Group items by category
      const groupedByCategory: CatalogResponse = {};
      locationItems.forEach((item) => {
        if (!groupedByCategory[item.category]) {
          groupedByCategory[item.category] = [];
        }
        groupedByCategory[item.category]!.push(item);
      });

      // Cache for 5 minutes
      await this.cache.set(cacheKey, groupedByCategory, 300);
      
      logger.info(`Retrieved ${locationItems.length} items for location ${locationId}`);
      return groupedByCategory;
    } catch (error) {
      logger.error(`Error fetching catalog for location ${locationId}:`, error);
      throw new Error('Failed to fetch catalog items from Square API');
    }
  }

  /**
   * Get categories with item counts for a specific location
   */
  async getCategories(locationId: string): Promise<Category[]> {
    const cacheKey = `square:categories:${locationId}`;
    
    try {
      // Check cache first
      const cached = await this.cache.get<Category[]>(cacheKey);
      if (cached) {
        return cached;
      }

      // Get catalog items to count items per category
      const catalogData = await this.getCatalogItems(locationId);
      
      const categories: Category[] = Object.entries(catalogData).map(([categoryName, items]) => ({
        id: categoryName.toLowerCase().replace(/\s+/g, '-'),
        name: categoryName,
        item_count: items.length,
      }));

      // Sort categories alphabetically
      categories.sort((a, b) => a.name.localeCompare(b.name));

      // Cache for 5 minutes
      await this.cache.set(cacheKey, categories, 300);
      
      logger.info(`Retrieved ${categories.length} categories for location ${locationId}`);
      return categories;
    } catch (error) {
      logger.error(`Error fetching categories for location ${locationId}:`, error);
      throw new Error('Failed to fetch categories from Square API');
    }
  }

  /**
   * Check if an item is available at a specific location
   */
  private isItemAvailableAtLocation(item: CatalogObject, locationId: string): boolean {
    const presentAtAll = item.presentAtAllLocations === true;
    const presentAtLocation = item.presentAtLocationIds?.includes(locationId) || false;
    
    return presentAtAll || presentAtLocation;
  }

  /**
   * Transform Square catalog object to our MenuItem format
   */
  private transformSquareItemToMenuItem(
    item: CatalogObject,
    categoryMap: Map<string, string>,
    imageMap: Map<string, string>
  ): MenuItem | null {
    const itemData = item.itemData;
    
    if (!itemData || !itemData.name) {
      return null;
    }

    // Get category name
    let categoryName = 'Uncategorized';
    if (itemData.reportingCategory?.id) {
      categoryName = categoryMap.get(itemData.reportingCategory.id) || 'Uncategorized';
    }

    // Get variations with prices
    const variations = (itemData.variations || [])
      .filter((variation) => variation.itemVariationData)
      .map((variation) => ({
        name: variation.itemVariationData?.name || 'Default',
        price: Number(variation.itemVariationData?.priceMoney?.amount || 0),
      }));

    // Get image URL
    let imageUrl: string | undefined;
    if (itemData.imageIds && itemData.imageIds.length > 0) {
      const firstImageId = itemData.imageIds[0];
      if (firstImageId) {
        imageUrl = imageMap.get(firstImageId);
      }
    }
    
    return {
      id: item.id,
      name: itemData.name,
      description: itemData.description || '',
      category: categoryName,
      image_url: imageUrl,
      variations,
    };
  }

  /**
   * Format Square address object into a readable string
   */
  private formatAddress(location: SquareLocation): string {
    const address = location.address;
    if (!address) return 'No address available';
    
    const parts = [
      address.addressLine1,
      address.addressLine2,
      address.locality,
      address.administrativeDistrictLevel1,
      address.postalCode,
    ].filter(Boolean);
    
    return parts.join(', ');
  }
}