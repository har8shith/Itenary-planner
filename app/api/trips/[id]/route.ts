import { type NextRequest, NextResponse } from "next/server"

// Mock destinations database
const destinations: any[] = [
  {
    id: "dest-1",
    tripId: "trip-1",
    name: "Eiffel Tower",
    description: "Visit the iconic Eiffel Tower and enjoy panoramic views of Paris",
    date: "2024-07-16",
    time: "10:00",
    notes: "Book tickets in advance to skip the line",
    address: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France",
    order: 1,
  },
  {
    id: "dest-2",
    tripId: "trip-1",
    name: "Louvre Museum",
    description: "Explore the world's largest art museum",
    date: "2024-07-16",
    time: "14:00",
    notes: "Don't miss the Mona Lisa!",
    address: "Rue de Rivoli, 75001 Paris, France",
    order: 2,
  },
]

// Mock trips database
const trips: any[] = [
  {
    id: "trip-1",
    userId: "1",
    title: "Summer Europe Adventure",
    description: "A 2-week journey through the best of Europe",
    startDate: "2024-07-15",
    endDate: "2024-07-29",
    createdAt: "2024-01-15T10:00:00Z",
  },
]

function getUserIdFromToken(token: string): string | null {
  if (token.startsWith("mock-jwt-token-")) {
    const parts = token.split("-")
    return parts[3]
  }
  return null
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

    const trip = trips.find((t) => t.id === params.id && t.userId === userId)

    if (!trip) {
      return NextResponse.json({ message: "Trip not found" }, { status: 404 })
    }

    // Get destinations for this trip
    const tripDestinations = destinations.filter((d) => d.tripId === params.id)

    return NextResponse.json({
      trip: {
        ...trip,
        destinations: tripDestinations,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
