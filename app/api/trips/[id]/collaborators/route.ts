import { type NextRequest, NextResponse } from "next/server"

// Mock collaborators database
const collaborators: any[] = []

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

    const tripCollaborators = collaborators.filter((collab) => collab.tripId === params.id)

    return NextResponse.json({
      collaborators: tripCollaborators,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
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

    const { email } = await request.json()

    // Check if collaborator already exists
    const existingCollaborator = collaborators.find((collab) => collab.tripId === params.id && collab.email === email)

    if (existingCollaborator) {
      return NextResponse.json({ message: "User is already a collaborator" }, { status: 400 })
    }

    const newCollaborator = {
      id: `collab-${Date.now()}`,
      tripId: params.id,
      email,
      name: null, // Would be populated from user database
      role: "editor",
      invitedAt: new Date().toISOString(),
      status: "pending",
    }

    collaborators.push(newCollaborator)

    return NextResponse.json({
      message: "Collaborator invited successfully",
      collaborator: newCollaborator,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
