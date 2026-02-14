import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SquareService } from '../services/square.service';
import { asyncHandler } from '../middleware/errorHandler';
import { LocationSchema } from '../types/api';

const router = Router();
const squareService = new SquareService();

/**
 * GET /api/locations
 * Fetch all active locations from Square
 */
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  const locations = await squareService.getLocations();
  
  // Validate response format
  const validatedLocations = locations.map(location => LocationSchema.parse(location));
  
  res.status(StatusCodes.OK).json({
    success: true,
    data: validatedLocations,
    count: validatedLocations.length,
    timestamp: new Date().toISOString(),
  });
}));

export { router as locationsRouter };