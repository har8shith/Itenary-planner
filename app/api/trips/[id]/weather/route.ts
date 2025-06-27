import { type NextRequest, NextResponse } from "next/server"

function getUserIdFromToken(token: string): string | null {
  if (token.startsWith("mock-jwt-token-")) {
    const parts = token.split("-")
    return parts[3]
  }
  return null
}

// Mock weather data
const mockWeatherData = {
  current: {
    temperature: 22,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
  },
  forecast: [
    {
      date: "Today",
      condition: "Partly Cloudy",
      high: 24,
      low: 18,
      precipitation: 10,
    },
    {
      date: "Tomorrow",
      condition: "Sunny",
      high: 26,
      low: 19,
      precipitation: 0,
    },
    {
      date: "Day 3",
      condition: "Light Rain",
      high: 21,
      low: 16,
      precipitation: 70,
    },
    {
      date: "Day 4",
      condition: "Cloudy",
      high: 23,
      low: 17,
      precipitation: 20,
    },
    {
      date: "Day 5",
      condition: "Sunny",
      high: 27,
      low: 20,
      precipitation: 5,
    },
  ],
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const userId = getUserIdFromToken(token)

    if (!userId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    // In a real app, you would:
    // 1. Get the trip's destinations
    // 2. Call a weather API (OpenWeatherMap, WeatherAPI, etc.)
    // 3. Return actual weather data for the trip locations

    return NextResponse.json({
      weather: mockWeatherData,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
