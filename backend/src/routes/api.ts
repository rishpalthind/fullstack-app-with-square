import { Router } from 'express';
import { locationsRouter } from './locations';
import { catalogRouter } from './catalog';
import { config } from '../config/config';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: config.square.environment,
    service: 'Per Diem API',
  });
});

// Mount route modules
router.use('/locations', locationsRouter);
router.use('/catalog', catalogRouter);

export { router as apiRoutes };