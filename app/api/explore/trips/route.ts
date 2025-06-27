import { type NextRequest, NextResponse } from "next/server"

// Mock public trips data
const publicTrips = [
  {
    id: "public-trip-1",
    title: "Ultimate Japan Adventure",
    description:
      "A comprehensive 14-day journey through Japan's most iconic destinations, from bustling Tokyo to serene Kyoto temples.",
    startDate: "2024-03-15",
    endDate: "2024-03-29",
    destinations: 12,
    author: "Sarah Chen",
    authorAvatar: null,
    likes: 247,
    views: 1832,
    tags: ["Japan", "Culture", "Food", "Temples", "Cities"],
    coverImage: "/placeholder.svg?height=200&width=400",
    isLiked: false,
  },
  {
    id: "public-trip-2",
    title: "European Backpacking Route",
    description: "Budget-friendly backpacking adventure across 8 European countries with insider tips and hidden gems.",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    destinations: 15,
    author: "Mike Rodriguez",
    authorAvatar: null,
    likes: 189,
    views: 2156,
    tags: ["Europe", "Backpacking", "Budget", "Adventure", "Hostels"],
    coverImage: "/placeholder.svg?height=200&width=400",
    isLiked: false,
  },
  {
    id: "public-trip-3",
    title: "Bali Wellness Retreat",
    description:
      "A rejuvenating 10-day wellness journey through Bali's most peaceful locations, perfect for digital detox.",
    startDate: "2024-04-10",
    endDate: "2024-04-20",
    destinations: 6,
    author: "Emma Thompson",
    authorAvatar: null,
    likes: 156,
    views: 987,
    tags: ["Bali", "Wellness", "Yoga", "Meditation", "Nature"],
    coverImage: "/placeholder.svg?height=200&width=400",
    isLiked: false,
  },
  {
    id: "public-trip-4",
    title: "Iceland Ring Road",
    description:
      "Complete guide to driving Iceland's famous Ring Road with the best stops for waterfalls, glaciers, and northern lights.",
    startDate: "2024-09-05",
    endDate: "2024-09-15",
    destinations: 18,
    author: "Lars Andersen",
    authorAvatar: null,
    likes: 312,
    views: 2847,
    tags: ["Iceland", "Road Trip", "Nature", "Photography", "Northern Lights"],
    coverImage: "/placeholder.svg?height=200&width=400",
    isLiked: false,
  },
  {
    id: "public-trip-5",
    title: "Southeast Asia Food Tour",
    description:
      "A culinary adventure through Thailand, Vietnam, and Cambodia focusing on street food and local markets.",
    startDate: "2024-11-01",
    endDate: "2024-11-21",
    destinations: 14,
    author: "David Kim",
    authorAvatar: null,
    likes: 203,
    views: 1654,
    tags: ["Southeast Asia", "Food", "Street Food", "Markets", "Culture"],
    coverImage: "/placeholder.svg?height=200&width=400",
    isLiked: false,
  },
  {
    id: "public-trip-6",
    title: "New Zealand Adventure",
    description:
      "Adrenaline-packed 3-week adventure through both North and South Islands with extreme sports and hiking.",
    startDate: "2024-12-01",
    endDate: "2024-12-22",
    destinations: 16,
    author: "Rachel Green",
    authorAvatar: null,
    likes: 278,
    views: 2134,
    tags: ["New Zealand", "Adventure", "Hiking", "Extreme Sports", "Nature"],
    coverImage: "/placeholder.svg?height=200&width=400",
    isLiked: false,
  },
]

export async function GET(request: NextRequest) {
  try {
    // In a real app, you would fetch public trips from the database
    // with proper pagination, filtering, and sorting

    return NextResponse.json({
      trips: publicTrips,
    })
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
