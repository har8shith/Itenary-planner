import { type NextRequest, NextResponse } from "next/server"

// Mock expenses database
const expenses: any[] = [
  {
    id: "exp-1",
    tripId: "trip-1",
    description: "Flight tickets",
    amount: "450.00",
    category: "transport",
    date: "2024-07-15",
    paidBy: "John Doe",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "exp-2",
    tripId: "trip-1",
    description: "Hotel booking",
    amount: "320.00",
    category: "accommodation",
    date: "2024-07-16",
    paidBy: "Jane Smith",
    createdAt: "2024-01-16T14:30:00Z",
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

    const tripExpenses = expenses.filter((expense) => expense.tripId === params.id)

    return NextResponse.json({
      expenses: tripExpenses,
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

    const { description, amount, category, date, paidBy } = await request.json()

    const newExpense = {
      id: `exp-${Date.now()}`,
      tripId: params.id,
      description,
      amount,
      category,
      date,
      paidBy: paidBy || "Current User",
      createdAt: new Date().toISOString(),
    }

    expenses.push(newExpense)

    return NextResponse.json({
      message: "Expense added successfully",
      expense: newExpense,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
