#!/bin/bash

echo "🚀 Travel Itinerary Planner - Setup Script"
echo "=========================================="

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "❌ Java is not installed. Please install Java 17 or higher."
    exit 1
fi

echo "✅ Java is installed: $(java -version 2>&1 | head -n 1)"

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "⚠️  Maven is not installed. Installing Maven..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        brew install maven
    else
        echo "❌ Please install Maven manually: https://maven.apache.org/download.cgi"
        exit 1
    fi
fi

echo "✅ Maven is installed: $(mvn -version 2>&1 | head -n 1)"

# Check if MySQL is running
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed. Please install MySQL 8.0 or higher."
    echo "   macOS: brew install mysql && brew services start mysql"
    echo "   Or use Docker: docker run --name mysql-travel -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=travel_itinerary -p 3306:3306 -d mysql:8.0"
    exit 1
fi

echo "✅ MySQL is available"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo "⚠️  pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm is installed: $(pnpm --version)"

echo ""
echo "📋 Setup Instructions:"
echo "====================="
echo ""
echo "1. 🗄️  Database Setup:"
echo "   - Ensure MySQL is running"
echo "   - Create database: CREATE DATABASE travel_itinerary;"
echo ""
echo "2. 🔧 Backend Setup:"
echo "   cd backend"
echo "   mvn clean install"
echo "   mvn spring-boot:run"
echo ""
echo "3. 🌐 Frontend Setup:"
echo "   pnpm install"
echo "   pnpm dev"
echo ""
echo "4. 🧪 Test the Integration:"
echo "   - Backend: http://localhost:8080/api"
echo "   - Frontend: http://localhost:3000"
echo "   - Swagger UI: http://localhost:8080/api/swagger-ui.html"
echo ""
echo "📖 For detailed instructions, see INTEGRATION_GUIDE.md"
echo ""
echo "🎉 Setup complete! Happy coding!" 