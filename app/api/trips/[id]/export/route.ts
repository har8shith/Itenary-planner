import { type NextRequest, NextResponse } from "next/server"

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

    // Mock PDF generation - in a real app, you'd use a library like jsPDF or Puppeteer
    const pdfContent = `
      Travel Itinerary PDF Export
      
      This is a mock PDF export for trip ${params.id}.
      In a real application, this would generate a proper PDF
      with all trip details, destinations, and formatting.
    `

    // Create a simple text file as PDF placeholder
    const buffer = Buffer.from(pdfContent, "utf-8")

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="trip-${params.id}-itinerary.pdf"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
