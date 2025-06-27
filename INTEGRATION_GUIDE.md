# 🚀 Frontend-Backend Integration Guide

This guide explains how to integrate the React frontend with the Spring Boot backend for the Travel Itinerary Planner application.

## 📋 Prerequisites

### Backend Requirements
- **Java 17** or higher
- **Maven 3.6** or higher
- **MySQL 8.0** or higher

### Frontend Requirements
- **Node.js 18** or higher
- **pnpm** (recommended) or npm

## 🗄️ Database Setup

1. **Install and start MySQL**:
   ```bash
   # macOS (using Homebrew)
   brew install mysql
   brew services start mysql
   
   # Or use Docker
   docker run --name mysql-travel -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=travel_itinerary -p 3306:3306 -d mysql:8.0
   ```

2. **Create the database**:
   ```sql
   CREATE DATABASE travel_itinerary;
   ```

3. **Update database configuration** in `backend/src/main/resources/application.yml`:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/travel_itinerary?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
       username: root
       password: password
   ```

## 🔧 Backend Setup

1. **Install Maven** (if not already installed):
   ```bash
   # macOS
   brew install maven
   
   # Or download from https://maven.apache.org/download.cgi
   ```

2. **Build and run the Spring Boot backend**:
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

3. **Verify backend is running**:
   - Backend will be available at: `http://localhost:8080/api`
   - Swagger UI: `http://localhost:8080/api/swagger-ui.html`
   - Health check: `http://localhost:8080/api/actuator/health`

## 🌐 Frontend Setup

1. **Install dependencies**:
   ```bash
   cd ..  # Go back to project root
   pnpm install
   ```

2. **Configure environment variables** (optional):
   Create `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

3. **Run the frontend**:
   ```bash
   pnpm dev
   ```

4. **Verify frontend is running**:
   - Frontend will be available at: `http://localhost:3000`

## 🔗 Integration Points

### 1. Authentication Flow

The frontend now uses the Spring Boot backend for authentication:

```typescript
// Frontend authentication hook (hooks/use-auth.tsx)
const { login, signup, logout, user } = useAuth();

// Login
await login(email, password);

// Signup
await signup(name, email, password);

// Logout
logout();
```

### 2. API Client Configuration

The frontend uses a centralized API client (`lib/api.ts`):

```typescript
// API client automatically handles:
// - JWT token management
// - Request/response formatting
// - Error handling
// - CORS headers

const apiClient = new ApiClient();
```

### 3. Protected Routes

The frontend automatically includes JWT tokens in requests:

```typescript
// All API requests automatically include:
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 🧪 Testing the Integration

### 1. Test Authentication

1. **Start both servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend && mvn spring-boot:run
   
   # Terminal 2 - Frontend
   pnpm dev
   ```

2. **Test user registration**:
   - Go to `http://localhost:3000/signup`
   - Create a new account
   - Verify you're redirected to dashboard

3. **Test user login**:
   - Go to `http://localhost:3000/login`
   - Login with created credentials
   - Verify JWT token is stored in localStorage

### 2. Test Trip Management

1. **Create a trip**:
   - Navigate to dashboard
   - Click "Create New Trip"
   - Fill in trip details
   - Verify trip is saved to database

2. **Add destinations**:
   - Open a trip
   - Add destinations/activities
   - Verify they're saved with proper ordering

### 3. Test API Endpoints

Use the Swagger UI at `http://localhost:8080/api/swagger-ui.html` to test:

- **Authentication**: `/api/auth/login`, `/api/auth/signup`
- **Trips**: `/api/trips` (GET, POST, PUT, DELETE)
- **Destinations**: `/api/trips/{id}/destinations`
- **Dashboard**: `/api/dashboard/stats`

## 🔧 Configuration Options

### Backend Configuration

1. **JWT Settings** (`application.yml`):
   ```yaml
   jwt:
     secret: your-secret-key-here-make-it-long-and-secure-in-production
     expiration: 86400000 # 24 hours
   ```

2. **CORS Settings** (`SecurityConfig.java`):
   ```java
   // Currently allows all origins for development
   // Update for production with specific domains
   ```

3. **Database Settings**:
   ```yaml
   spring:
     jpa:
       hibernate:
         ddl-auto: update  # Creates/updates tables automatically
       show-sql: false     # Set to true for debugging
   ```

### Frontend Configuration

1. **API Base URL**:
   ```typescript
   // lib/api.ts
   const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
   ```

2. **Environment Variables**:
   ```env
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:8080/api
   ```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Ensure backend CORS is configured correctly
   - Check frontend URL in CORS settings
   - Verify both servers are running

2. **Database Connection**:
   - Ensure MySQL is running
   - Check database credentials
   - Verify database exists

3. **JWT Token Issues**:
   - Check JWT secret configuration
   - Verify token expiration settings
   - Clear localStorage if tokens are corrupted

4. **Port Conflicts**:
   - Backend: Change port in `application.yml`
   - Frontend: Change port in `package.json` scripts

### Debug Steps

1. **Check Backend Logs**:
   ```bash
   # Look for startup errors
   mvn spring-boot:run
   ```

2. **Check Frontend Console**:
   - Open browser dev tools
   - Check Network tab for API calls
   - Check Console for errors

3. **Test API Directly**:
   ```bash
   # Test backend health
   curl http://localhost:8080/api/actuator/health
   
   # Test authentication
   curl -X POST http://localhost:8080/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
   ```

## 📊 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/signup` | User registration |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/trips` | Get user's trips |
| POST | `/api/trips` | Create new trip |
| GET | `/api/trips/{id}` | Get specific trip |
| PUT | `/api/trips/{id}` | Update trip |
| DELETE | `/api/trips/{id}` | Delete trip |
| GET | `/api/trips/{id}/destinations` | Get trip destinations |
| POST | `/api/trips/{id}/destinations` | Add destination |
| PUT | `/api/trips/{id}/destinations/{destId}` | Update destination |
| DELETE | `/api/trips/{id}/destinations/{destId}` | Delete destination |
| GET | `/api/dashboard/stats` | Get dashboard statistics |

## 🎯 Next Steps

1. **Production Deployment**:
   - Configure production database
   - Set secure JWT secrets
   - Configure CORS for production domains
   - Set up SSL certificates

2. **Additional Features**:
   - Add email verification
   - Implement password reset
   - Add trip sharing/collaboration
   - Add expense tracking

3. **Monitoring & Logging**:
   - Add application monitoring
   - Configure logging
   - Set up error tracking

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs
3. Test API endpoints directly
4. Check browser console for frontend errors

The integration is now complete! Both frontend and backend are connected and ready for development and testing. 