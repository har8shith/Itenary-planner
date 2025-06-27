import { type NextRequest, NextResponse } from "next/server"

// Mock user database (in real app, this would be a proper database)
const users: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ message: "User already exists with this email" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password, // In real app, hash the password
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)

    // Generate mock JWT token
    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`

    return NextResponse.json({
      message: "Account created successfully",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
