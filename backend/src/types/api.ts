import { z } from 'zod';

// Location types
export const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  timezone: z.string(),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

export type Location = z.infer<typeof LocationSchema>;

// Category types  
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  item_count: z.number(),
});

export type Category = z.infer<typeof CategorySchema>;

// Item variation types
export const ItemVariationSchema = z.object({
  name: z.string(),
  price: z.number(), // Price in cents
});

export type ItemVariation = z.infer<typeof ItemVariationSchema>;

// Menu item types
export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string(),
  image_url: z.string().optional(),
  variations: z.array(ItemVariationSchema),
});

export type MenuItem = z.infer<typeof MenuItemSchema>;

// Catalog response type
export const CatalogResponseSchema = z.record(z.string(), z.array(MenuItemSchema));
export type CatalogResponse = z.infer<typeof CatalogResponseSchema>;

// API Error types
export const ApiErrorSchema = z.object({
  error: z.string(),
  message: z.string(),
  timestamp: z.string(),
  details: z.any().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

// Square API types (partial - only what we need)
export interface SquareLocation {
  id?: string;
  name?: string;
  address?: {
    address_line_1?: string;
    address_line_2?: string;
    locality?: string;
    administrative_district_level_1?: string;
    postal_code?: string;
  };
  timezone?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface SquareCatalogObject {
  type: string;
  id: string;
  present_at_all_locations?: boolean;
  present_at_location_ids?: string[];
  item_data?: {
    name?: string;
    description?: string;
    category_id?: string;
    variations?: Array<{
      type: string;
      id: string;
      item_variation_data?: {
        name?: string;
        pricing_type?: string;
        price_money?: {
          amount?: number;
          currency?: string;
        };
      };
    }>;
  };
  category_data?: {
    name?: string;
  };
  image_data?: {
    url?: string;
  };
}

export interface SquareSearchCatalogObjectsResponse {
  objects?: SquareCatalogObject[];
  related_objects?: SquareCatalogObject[];
  cursor?: string;
}