import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { z } from 'zod';
import { SquareService } from '../services/square.service';
import { asyncHandler } from '../middleware/errorHandler';
import { CatalogResponseSchema, CategorySchema } from '../types/api';

const router = Router();
const squareService = new SquareService();

// Query parameter validation schemas
const CatalogQuerySchema = z.object({
  location_id: z.string().min(1, 'location_id is required'),
});

const CategoriesQuerySchema = z.object({
  location_id: z.string().min(1, 'location_id is required'),
});

/**
 * GET /api/catalog?location_id=<LOCATION_ID>
 * Fetch catalog items for a specific location, grouped by category
 */
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  // Validate query parameters
  const { location_id } = CatalogQuerySchema.parse(req.query);
  
  const catalogData = await squareService.getCatalogItems(location_id);
  
  // Validate response format
  const validatedCatalog = CatalogResponseSchema.parse(catalogData);
  
  // Calculate total items
  const totalItems = Object.values(validatedCatalog)
    .reduce((sum, items) => sum + items.length, 0);
  
  res.status(StatusCodes.OK).json({
    success: true,
    data: validatedCatalog,
    metadata: {
      location_id,
      total_categories: Object.keys(validatedCatalog).length,
      total_items: totalItems,
    },
    timestamp: new Date().toISOString(),
  });
}));

/**
 * GET /api/catalog/categories?location_id=<LOCATION_ID>
 * Fetch categories with item counts for a specific location
 */
router.get('/categories', asyncHandler(async (req: Request, res: Response) => {
  // Validate query parameters
  const { location_id } = CategoriesQuerySchema.parse(req.query);
  
  const categories = await squareService.getCategories(location_id);
  
  // Validate response format
  const validatedCategories = categories.map(category => CategorySchema.parse(category));
  
  res.status(StatusCodes.OK).json({
    success: true,
    data: validatedCategories,
    metadata: {
      location_id,
      total_categories: validatedCategories.length,
      total_items: validatedCategories.reduce((sum, cat) => sum + cat.item_count, 0),
    },
    timestamp: new Date().toISOString(),
  });
}));

export { router as catalogRouter };