import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Environment validation schema
const configSchema = z.object({
  port: z.number().default(3001),
  square: z.object({
    accessToken: z.string().default(''),
    environment: z.enum(['sandbox', 'production']).default('sandbox'),
  }),
  cors: z.object({
    origin: z.string().default('http://localhost:3000'),
  }),
  logging: z.object({
    level: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  }),
  cache: z.object({
    ttl: z.number().default(300), // 5 minutes
    maxSize: z.number().default(100), // Max cache entries
  }),
});

// Parse and validate environment variables
const rawConfig = {
  port: Number(process.env['PORT']) || 3001,
  square: {
    accessToken: process.env['SQUARE_ACCESS_TOKEN'] || '',
    environment: (process.env['SQUARE_ENVIRONMENT'] || 'sandbox') as 'sandbox' | 'production',
  },
  cors: {
    origin: process.env['CORS_ORIGIN'] || 'http://localhost:3000',
  },
  logging: {
    level: (process.env['LOG_LEVEL'] || 'info') as 'error' | 'warn' | 'info' | 'debug',
  },
  cache: {
    ttl: Number(process.env['CACHE_TTL']) || 300,
    maxSize: Number(process.env['CACHE_MAX_SIZE']) || 100,
  },
};

// Validate configuration
const result = configSchema.safeParse(rawConfig);

if (!result.success) {
  console.error('❌ Invalid configuration:');
  result.error.issues.forEach((issue) => {
    console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
  });
  process.exit(1);
}

export const config = result.data;

// Configuration validation warnings
if (config.square.environment === 'production') {
  console.warn('⚠️  Running in PRODUCTION mode');
}

if (!process.env['SQUARE_ACCESS_TOKEN']) {
  console.warn('⚠️  SQUARE_ACCESS_TOKEN not set - API calls will fail');
}