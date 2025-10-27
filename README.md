# Black Hat SEO Frontend

React frontend for the Black Hat SEO automation system.

## Development Setup

### Prerequisites
- Node.js 18+
- Backend running on port 4000

### Install Dependencies
```bash
npm install
```

### Environment Setup
Create `.env` file:
```bash
VITE_API_URL=http://localhost:4000/api
VITE_WORKER_API_KEY=worker-api-key-123
```

### Development Commands

#### Start Dev Server
```bash
npm run dev
```
Opens at http://localhost:5173

#### Run Smoke Tests
```bash
npm run smoke-test
```
Tests backend API connectivity

#### Build for Production
```bash
npm run build
```

#### Preview Production Build
```bash
npm run preview
```

### Manual Smoke Test

1. **Health Check**: Visit http://localhost:5173 and open browser console
2. **API Health**: Test `GET http://localhost:4000/health` - should return `{ ok: true }`
3. **Jobs API**: Test `GET http://localhost:4000/api/jobs` - should return job data
4. **Frontend**: Navigate through Jobs, Websites, Submissions pages

### Project Structure
```
src/
├── components/ui/     # Reusable UI components
├── features/          # Feature-specific components
│   ├── jobs/         # Job management
│   ├── websites/     # Website management
│   └── submissions/  # Submission tracking
├── lib/
│   ├── api.js        # Central API client
│   └── adapters.js   # Data transformation
├── services/api/     # API service layer
└── contexts/         # React contexts
```

### Authentication
- Standard login with email/password
- Worker API key authentication for automation access
- Automatic token management and 401 handling