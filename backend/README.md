# Travel Itinerary Planner - Spring Boot Backend

A production-ready Spring Boot backend for the Travel Itinerary Planner application. This backend provides RESTful APIs for user authentication, trip management, and destination/activity planning.

## 🚀 Features

- **User Authentication**: JWT-based authentication with secure password hashing
- **Trip Management**: Create, read, update, and delete travel itineraries
- **Destination Management**: Add activities/destinations to trips with scheduling
- **Dashboard Statistics**: User analytics and trip statistics
- **RESTful APIs**: Clean, documented API endpoints
- **Database Integration**: MySQL with JPA/Hibernate
- **Security**: Spring Security with CORS support
- **API Documentation**: Swagger/OpenAPI integration

## 🛠️ Technology Stack

- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security** with JWT
- **Spring Data JPA**
- **MySQL 8.0**
- **Maven**
- **Swagger/OpenAPI**

## 📋 Prerequisites

Before running this application, make sure you have:

- **Java 17** or higher
- **Maven 3.6** or higher
- **MySQL 8.0** or higher
- **Git**

## 🗄️ Database Setup

1. **Create MySQL Database**:
   ```sql
   CREATE DATABASE travel_itinerary;
   ```

2. **Update Database Configuration**:
   Edit `src/main/resources/application.yml` and update the database connection:
   ```yaml
   spring:
     datasource:
       url: jdbc:mysql://localhost:3306/travel_itinerary?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
       username: your_username
       password: your_password
   ```

## 🚀 Running the Application

### Option 1: Using Maven

1. **Clone the repository** (if not already done):
   ```bash
   cd backend
   ```

2. **Build the project**:
   ```bash
   mvn clean install
   ```

3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```

### Option 2: Using IDE

1. Open the project in your IDE (IntelliJ IDEA, Eclipse, etc.)
2. Run `TravelItineraryPlannerApplication.java`

### Option 3: Using JAR

1. **Build the JAR**:
   ```bash
   mvn clean package
   ```

2. **Run the JAR**:
   ```bash
   java -jar target/planner-1.0.0.jar
   ```

## 🌐 API Endpoints

The application will be available at: `http://localhost:8080/api`

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user

### Trip Management
- `GET /api/trips` - Get user's trips
- `POST /api/trips` - Create new trip
- `GET /api/trips/{id}` - Get specific trip with destinations
- `PUT /api/trips/{id}` - Update trip
- `DELETE /api/trips/{id}` - Delete trip

### Destination Management
- `GET /api/trips/{tripId}/destinations` - Get trip destinations
- `POST /api/trips/{tripId}/destinations` - Add destination to trip
- `PUT /api/trips/{tripId}/destinations/{destinationId}` - Update destination
- `DELETE /api/trips/{tripId}/destinations/{destinationId}` - Delete destination

### Dashboard
- `GET /api/dashboard/stats` - Get user statistics

## 📚 API Documentation

Once the application is running, you can access the Swagger UI at:
- **Swagger UI**: `http://localhost:8080/api/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/api/api-docs`

## 🔐 Security Configuration

The application uses JWT tokens for authentication. To get a token:

1. **Register a new user**:
   ```bash
   curl -X POST http://localhost:8080/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{
       "name": "John Doe",
       "email": "john@example.com",
       "password": "password123"
     }'
   ```

2. **Login to get JWT token**:
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "john@example.com",
       "password": "password123"
     }'
   ```

3. **Use the token in subsequent requests**:
   ```bash
   curl -X GET http://localhost:8080/api/trips \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## 🔧 Configuration

### JWT Configuration
Update JWT settings in `application.yml`:
```yaml
jwt:
  secret: your-secret-key-here-make-it-long-and-secure-in-production
  expiration: 86400000 # 24 hours in milliseconds
```

### CORS Configuration
The application is configured to allow CORS from any origin for development. For production, update the CORS configuration in `SecurityConfig.java`.

## 🧪 Testing

Run the tests using Maven:
```bash
mvn test
```

## 📁 Project Structure

```
src/main/java/com/travelitinerary/planner/
├── controller/          # REST Controllers
├── service/            # Business Logic
├── repository/         # Data Access Layer
├── model/              # JPA Entities
├── dto/                # Data Transfer Objects
├── security/           # Security Configuration
├── exception/          # Exception Handling
└── config/             # Configuration Classes
```

## 🔄 Frontend Integration

This backend is designed to work with the React frontend. The API endpoints match the frontend's expected structure:

- Authentication responses include JWT tokens
- Trip and destination data structures match frontend expectations
- CORS is configured for frontend integration
- Error responses are formatted for frontend consumption

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Ensure MySQL is running
   - Check database credentials in `application.yml`
   - Verify database exists

2. **Port Already in Use**:
   - Change the port in `application.yml`:
     ```yaml
     server:
       port: 8081
     ```

3. **JWT Token Issues**:
   - Ensure the JWT secret is properly configured
   - Check token expiration settings

4. **CORS Issues**:
   - Verify CORS configuration in `SecurityConfig.java`
   - Check frontend URL in CORS settings

## 📝 License

This project is part of the Travel Itinerary Planner application.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions, please refer to the project documentation or create an issue in the repository. 