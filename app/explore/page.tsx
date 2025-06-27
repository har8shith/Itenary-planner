"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Search, Calendar, Globe, Heart, Eye, ArrowLeft } from "lucide-react"

interface PublicTrip {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  destinations: number
  author: string
  authorAvatar?: string
  likes: number
  views: number
  tags: string[]
  coverImage?: string
  isLiked: boolean
}

export default function ExplorePage() {
  const [trips, setTrips] = useState<PublicTrip[]>([])
  const [filteredTrips, setFilteredTrips] = useState<PublicTrip[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("trending")
  const router = useRouter()

  useEffect(() => {
    fetchPublicTrips()
  }, [])

  useEffect(() => {
    filterTrips()
  }, [trips, searchQuery, activeTab])

  const fetchPublicTrips = async () => {
    try {
      const response = await fetch("/api/explore/trips")
      if (response.ok) {
        const data = await response.json()
        setTrips(data.trips)
      }
    } catch (error) {
      console.error("Error fetching public trips:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterTrips = () => {
    let filtered = trips

    if (searchQuery) {
      filtered = filtered.filter(
        (trip) =>
          trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    // Sort based on active tab
    switch (activeTab) {
      case "trending":
        filtered = filtered.sort((a, b) => b.likes + b.views - (a.likes + a.views))
        break
      case "recent":
        filtered = filtered.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
        break
      case "popular":
        filtered = filtered.sort((a, b) => b.likes - a.likes)
        break
      case "most-viewed":
        filtered = filtered.sort((a, b) => b.views - a.views)
        break
    }

    setFilteredTrips(filtered)
  }

  const handleLike = async (tripId: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`/api/explore/trips/${tripId}/like`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setTrips((prev) =>
          prev.map((trip) =>
            trip.id === tripId
              ? {
                  ...trip,
                  isLiked: !trip.isLiked,
                  likes: trip.isLiked ? trip.likes - 1 : trip.likes + 1,
                }
              : trip,
          ),
        )
      }
    } catch (error) {
      console.error("Error liking trip:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading amazing trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Explore Trips</h1>
                <p className="text-gray-600">Discover amazing travel itineraries from the community</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search trips, destinations, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 max-w-md">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="most-viewed">Most Viewed</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips found</h3>
            <p className="text-gray-600">Try adjusting your search or check back later for new trips!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Card key={trip.id} className="hover:shadow-lg transition-shadow group">
                <div className="relative">
                  {trip.coverImage ? (
                    <img
                      src={trip.coverImage || "/placeholder.svg"}
                      alt={trip.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-white" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/90 hover:bg-white"
                      onClick={(e) => {
                        e.preventDefault()
                        handleLike(trip.id)
                      }}
                    >
                      <Heart className={`h-4 w-4 ${trip.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>
                </div>

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{trip.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{trip.description}</CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-600">{trip.author.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="text-sm text-gray-600">{trip.author}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </div>

                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{trip.destinations} destinations</Badge>
                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Heart className="h-3 w-3 mr-1" />
                          {trip.likes}
                        </div>
                        <div className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          {trip.views}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {trip.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {trip.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{trip.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
