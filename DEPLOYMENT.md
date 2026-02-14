# Deployment configurations and scripts

## Railway Deployment (Recommended)

### Backend Deployment
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and create project
railway login
railway init

# Set environment variables
railway variables set SQUARE_ACCESS_TOKEN=your_token
railway variables set SQUARE_ENVIRONMENT=sandbox
railway variables set DATABASE_URL=your_postgres_url

# Deploy
railway up
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod

# Set environment variables in Vercel dashboard
VITE_API_BASE_URL=https://your-backend-url
```

## Alternative Deployments

### Render
- Connect GitHub repository
- Set build command: `npm run build`
- Set start command: `npm start`
- Add environment variables

### Heroku
- Create Heroku app
- Set buildpacks: `heroku buildpacks:set heroku/nodejs`
- Configure environment variables
- Deploy with Git

### AWS/Docker
- Use the provided docker-compose.yml
- Deploy to ECS, EC2, or EKS
- Set up load balancer and SSL

## Environment Variables

### Production Backend
```
SQUARE_ACCESS_TOKEN=your_production_token
SQUARE_ENVIRONMENT=production
DATABASE_URL=your_production_postgres_url
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com
LOG_LEVEL=info
```

### Production Frontend
```
VITE_API_BASE_URL=https://your-backend-domain.com/api
```