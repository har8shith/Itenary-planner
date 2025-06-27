import { type NextRequest, NextResponse } from "next/server"

function getUserIdFromToken(token: string): string | null {
  if (token.startsWith("mock-jwt-token-")) {
    const parts = token.split("-")
    return parts[3]
  }
  return null
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { destinationIds } = await request.json()

    // In a real app, you would update the order in the database
    // For now, we'll just return success
    console.log(`Reordering destinations for trip ${params.id}:`, destinationIds)

    return NextResponse.json({
      message: "Destinations reordered successfully",
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
