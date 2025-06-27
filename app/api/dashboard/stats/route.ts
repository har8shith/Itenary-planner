import { type NextRequest, NextResponse } from "next/server"

function getUserIdFromToken(token: string): string | null {
  if (token.startsWith("mock-jwt-token-")) {
    const parts = token.split("-")
    return parts[3]
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

    // Mock stats - in a real app, you'd calculate these from the database
    const stats = {
      totalTrips: 12,
      totalDestinations: 47,
      totalExpenses: 2847.5,
      upcomingTrips: 3,
    }

    return NextResponse.json({
      stats,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
