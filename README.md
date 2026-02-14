# Per Diem Restaurant Menu Application

A full-stack TypeScript application that connects to the Square Catalog API to display restaurant menu items, filtered by location and category. Built with mobile-first responsive design principles.

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# 1. Clone and navigate to the project
git clone <your-repo-url>
cd perdiem-coding-challenge

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your Square API credentials

# 3. Start the application
npm run docker:up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Database: PostgreSQL on port 5432
- Redis: Redis on port 6379

### Option 2: Local Development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your Square API credentials

# 3. Start PostgreSQL and Redis (if available)
# Or update .env to use remote instances

# 4. Set up the database
npm run prisma:migrate
npm run prisma:generate

# 5. Start development servers
npm run dev
```

## 📋 Prerequisites

### Required
- Node.js 18+ and npm
- PostgreSQL database
- Square Developer Account with API credentials

### Optional
- Docker and Docker Compose (for containerized setup)
- Redis (for advanced caching)

## 🏗️ Architecture

### Backend (`/backend`)
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: In-memory cache (NodeCache) with optional Redis support
- **API Integration**: Square Catalog and Locations APIs
- **Security**: Helmet, CORS, rate limiting
- **Logging**: Winston with request/response logging
- **Testing**: Jest with Supertest

### Frontend (`/frontend`)
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: TanStack Query (React Query)
- **Styling**: CSS with mobile-first responsive design
- **Icons**: Lucide React
- **Testing**: Jest with Testing Library

### Key Features
- ✅ **Mobile-first responsive design** (optimized for 375px+)
- ✅ **Square API proxy** with secure token handling
- ✅ **Real-time caching** with automatic invalidation
- ✅ **Comprehensive error handling** and loading states
- ✅ **Location-based filtering** with persistence
- ✅ **Category navigation** with item counts
- ✅ **Search functionality** across menu items
- ✅ **Accessibility support** (ARIA labels, keyboard navigation)
- ✅ **Production-ready Docker setup**
- ✅ **Comprehensive test coverage**

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Square API Configuration
SQUARE_ACCESS_TOKEN=your_square_sandbox_access_token
SQUARE_ENVIRONMENT=sandbox  # or 'production'

# Server Configuration
PORT=3001
CORS_ORIGIN=http://localhost:3000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/perdiem_db

# Optional: Redis for advanced caching
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info  # error, warn, info, debug
```

### Square API Setup

1. **Create a Square Developer Account**
   - Go to [Square Developer Dashboard](https://developer.squareup.com)
   - Create a new application

2. **Get API Credentials**
   - Navigate to your application
   - Copy the **Sandbox Access Token**
   - Add it to your `.env` file

3. **Test Data** (Optional)
   - Use the Sandbox Seller Dashboard to create test locations and catalog items
   - Or use the existing test data in sandbox environment

## 📚 API Documentation

### Endpoints

#### `GET /api/locations`
Fetch all active locations from Square.

**Response:**
```json
{
  \"success\": true,
  \"data\": [
    {
      \"id\": \"location_id\",
      \"name\": \"Downtown Location\",
      \"address\": \"123 Main St, City, ST 12345\",
      \"timezone\": \"America/New_York\",
      \"status\": \"ACTIVE\"
    }
  ],
  \"count\": 1,
  \"timestamp\": \"2025-02-14T10:00:00.000Z\"
}
```

#### `GET /api/catalog?location_id={id}`
Fetch menu items grouped by category for a specific location.

**Parameters:**
- `location_id` (required): Square location ID

**Response:**
```json
{
  \"success\": true,
  \"data\": {
    \"Appetizers\": [
      {
        \"id\": \"item_id\",
        \"name\": \"Caesar Salad\",
        \"description\": \"Fresh romaine lettuce...\",
        \"category\": \"Appetizers\",
        \"image_url\": \"https://...\",
        \"variations\": [
          {
            \"name\": \"Regular\",
            \"price\": 1200
          }
        ]
      }
    ]
  },
  \"metadata\": {
    \"location_id\": \"loc_123\",
    \"total_categories\": 5,
    \"total_items\": 42
  },
  \"timestamp\": \"2025-02-14T10:00:00.000Z\"
}
```

#### `GET /api/catalog/categories?location_id={id}`
Fetch categories with item counts for a specific location.

**Response:**
```json
{
  \"success\": true,
  \"data\": [
    {
      \"id\": \"appetizers\",
      \"name\": \"Appetizers\",
      \"item_count\": 8
    }
  ],
  \"metadata\": {
    \"location_id\": \"loc_123\",
    \"total_categories\": 5,
    \"total_items\": 42
  },
  \"timestamp\": \"2025-02-14T10:00:00.000Z\"
}
```

### Error Responses
All errors follow a consistent format:
```json
{
  \"error\": \"Bad Request\",
  \"message\": \"location_id is required\",
  \"timestamp\": \"2025-02-14T10:00:00.000Z\",
  \"details\": []
}
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage report
```

### Frontend Tests
```bash
cd frontend
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # With coverage report
```

### Test Categories

1. **Unit Tests**
   - Utility functions
   - Component logic
   - Service methods

2. **Integration Tests**
   - API endpoint testing
   - Database operations
   - Component interactions

3. **E2E Tests** (Future Enhancement)
   - Complete user workflows
   - Cross-browser compatibility

## 📱 Mobile-First Design

### Responsive Breakpoints
- **Mobile**: 320px - 767px (primary target: 375px)
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Key Mobile Features
- Touch-friendly interface elements
- Optimized image loading
- Smooth scrolling navigation
- Accessible form controls
- Fast loading with skeleton screens

## 🔄 Caching Strategy

### Backend Caching
- **Locations**: 10 minutes TTL
- **Catalog Data**: 5 minutes TTL
- **Categories**: 5 minutes TTL
- **Automatic invalidation** on errors

### Frontend Caching
- **React Query** with 5-minute stale time
- **Persistent location selection** in localStorage
- **Optimistic updates** for better UX

## 🚀 Deployment

### Production Build
```bash
# Build both backend and frontend
npm run build

# Start production server
npm start
```

### Docker Production
```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Deployment Platforms
- **Vercel/Netlify**: Frontend static deployment
- **Railway/Render**: Full-stack deployment
- **AWS/GCP/Azure**: Container deployment with docker-compose

## 🔒 Security

### Implemented Security Measures
- ✅ Square API token never exposed to frontend
- ✅ Helmet.js for security headers
- ✅ CORS configuration
- ✅ Rate limiting (100 requests/15min per IP)
- ✅ Input validation with Zod
- ✅ Environment variable validation
- ✅ SQL injection prevention (Prisma)

### Production Recommendations
- Use HTTPS in production
- Implement authentication if needed
- Add API key authentication for admin endpoints
- Use production Square environment
- Monitor and log security events

## 📈 Performance Optimizations

### Backend
- Efficient SQL queries with Prisma
- Response caching with TTL
- Pagination handling for large datasets
- Request/response compression
- Connection pooling

### Frontend
- Code splitting with Vite
- Lazy loading of images
- Debounced search input
- Optimized re-renders with React Query
- Production build optimization

## 🐛 Troubleshooting

### Common Issues

**1. Square API Token Error**
```
Error: Failed to fetch locations from Square API
```
- Verify `SQUARE_ACCESS_TOKEN` in `.env`
- Ensure token is for correct environment (sandbox/production)
- Check Square Developer Dashboard for token status

**2. Database Connection Error**
```
Error: Can't reach database server
```
- Verify PostgreSQL is running
- Check `DATABASE_URL` format in `.env`
- Run `npm run prisma:migrate` to set up schema

**3. Port Already in Use**
```
Error: EADDRINUSE: address already in use :::3000
```
- Kill existing processes: `pkill -f node`
- Use different ports in `.env`
- Check Docker containers: `docker ps`

### Debug Mode
Set `LOG_LEVEL=debug` in `.env` for detailed logging.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make changes with tests
4. Run linting: `npm run lint`
5. Run tests: `npm test`
6. Create a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Per Diem** for the coding challenge
- **Square** for the comprehensive API
- **React Team** for the excellent framework
- **Prisma Team** for the amazing ORM

---

**Built with ❤️ for the Per Diem coding challenge**

For questions or support, please create an issue in the repository.