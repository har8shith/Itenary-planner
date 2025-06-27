import { type NextRequest, NextResponse } from "next/server"

// Mock trips database
const trips: any[] = [
  {
    id: "trip-1",
    userId: "1",
    title: "Summer Europe Adventure",
    description: "A 2-week journey through the best of Europe",
    startDate: "2024-07-15",
    endDate: "2024-07-29",
    destinations: 5,
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "trip-2",
    userId: "1",
    title: "Tokyo Food Tour",
    description: "Exploring the culinary delights of Tokyo",
    startDate: "2024-09-10",
    endDate: "2024-09-17",
    destinations: 8,
    createdAt: "2024-02-01T14:30:00Z",
  },
]

function getUserIdFromToken(token: string): string | null {
  // Mock token validation (in real app, use proper JWT verification)
  if (token.startsWith("mock-jwt-token-")) {
    const parts = token.split("-")
    return parts[3] // Extract user ID from mock token
  }
  return null
}

export async function GET(request: NextRequest) {
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

    // Filter trips for the authenticated user
    const userTrips = trips.filter((trip) => trip.userId === userId)

    return NextResponse.json({
      trips: userTrips,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const { title, description, startDate, endDate } = await request.json()

    const newTrip = {
      id: `trip-${Date.now()}`,
      userId,
      title,
      description,
      startDate,
      endDate,
      destinations: 0,
      createdAt: new Date().toISOString(),
    }

    trips.push(newTrip)

    return NextResponse.json({
      message: "Trip created successfully",
      trip: newTrip,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
