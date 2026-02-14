# Quick Start Guide

## ✅ Project Successfully Built and Running!

Your Per Diem Restaurant Menu application is now live with:
- ✅ Backend API running on http://localhost:3001
- ✅ Frontend UI running on http://localhost:3000
- ✅ PostgreSQL database running
- ✅ Redis cache running

## Current Status

All Docker containers are healthy and running:
```
fullstack-backend-1    ✅ Up and healthy (port 3001)
fullstack-frontend-1   ✅ Up and healthy (port 3000)
fullstack-postgres-1   ✅ Up and healthy (port 5432)
fullstack-redis-1      ✅ Up and healthy (port 6379)
```

## Access Your Application

1. **Frontend**: Open your browser to http://localhost:3000
2. **Backend API**: http://localhost:3001
3. **Health Check**: http://localhost:3001/health

## Important: Square API Setup

⚠️ **Before using the application**, you need to configure your Square API credentials:

1. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Add your Square API credentials to `.env`:
   ```
   SQUARE_ACCESS_TOKEN=your_actual_square_token_here
   SQUARE_ENVIRONMENT=sandbox  # or 'production'
   ```

3. Restart the backend container to apply changes:
   ```bash
   docker-compose restart backend
   ```

## Available API Endpoints

- `GET /health` - Health check
- `GET /api/locations` - Get all Square locations
- `GET /api/catalog?locationId={id}` - Get catalog items for a location
- `GET /api/catalog/categories?locationId={id}` - Get categories for a location

## Development Commands

### Docker Commands
```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild and restart
docker-compose up --build -d
```

### Local Development (without Docker)

#### Backend
```bash
cd backend
npm install
npm run dev  # Runs on port 3001
```

#### Frontend
```bash
cd frontend
npm install
npm run dev  # Runs on port 5173
```

## Testing

### Backend Tests
```bash
cd backend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## Project Structure

```
Full stack/
├── backend/          # Node.js Express API
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic (Square API integration)
│   │   ├── middleware/ # Express middleware
│   │   └── utils/    # Helper functions
│   ├── tests/        # Jest tests
│   └── Dockerfile
├── frontend/         # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API service layer
│   │   ├── hooks/      # Custom React hooks
│   │   └── types/      # TypeScript types
│   ├── tests/        # Testing Library tests
│   └── Dockerfile
└── docker-compose.yml
```

## Built With ⚡

**Backend:**
- Node.js 18 + Express
- TypeScript
- Square SDK
- Winston (logging)
- Node-cache (caching)
- Jest + Supertest (testing)

**Frontend:**
- React 18
- TypeScript
- Vite
- TanStack Query (data fetching)
- Lucide React (icons)
- Testing Library

**Infrastructure:**
- Docker + Docker Compose
- PostgreSQL 15
- Redis 7
- Nginx (production frontend)

## Next Steps

1. **Configure Square API** - Add your Square credentials to `.env`
2. **Open the app** - Visit http://localhost:3000
3. **Select a location** - Choose from available Square locations
4. **Browse the menu** - View items by category

## Troubleshooting

### Backend not starting?
```bash
# Check logs
docker-compose logs backend

# Ensure Square credentials are set
echo $SQUARE_ACCESS_TOKEN

# Restart backend
docker-compose restart backend
```

### Frontend not loading?
```bash
# Check logs
docker-compose logs frontend

# Ensure backend is running
curl http://localhost:3001/health

# Rebuild frontend
docker-compose up --build -d frontend
```

### Database connection issues?
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

## Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed production deployment instructions for:
- AWS (ECS, RDS, ElastiCache)
- Docker Hub
- Environment configuration
- CI/CD setup

## Need Help?

- Check the main [README.md](./README.md) for comprehensive documentation
- Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup
- Check [CHANGELOG.md](./CHANGELOG.md) for version history

---

**Status**: ✅ All systems operational  
**Last Updated**: 2024-02-14  
**Version**: 1.0.0
