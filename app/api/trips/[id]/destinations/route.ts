import { type NextRequest, NextResponse } from "next/server"

// Mock destinations database
const destinations: any[] = []

function getUserIdFromToken(token: string): string | null {
  if (token.startsWith("mock-jwt-token-")) {
    const parts = token.split("-")
    return parts[3]
  }
  return null
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { name, description, date, time, notes, address } = await request.json()

    const newDestination = {
      id: `dest-${Date.now()}`,
      tripId: params.id,
      name,
      description,
      date,
      time,
      notes,
      address,
      order: destinations.filter((d) => d.tripId === params.id).length + 1,
      createdAt: new Date().toISOString(),
    }

    destinations.push(newDestination)

    return NextResponse.json({
      message: "Destination added successfully",
      destination: newDestination,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
