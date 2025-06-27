"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  MapPin,
  Plus,
  Calendar,
  LogOut,
  Search,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  Heart,
} from "lucide-react"

interface Trip {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  destinations: number
  createdAt: string
  status: "upcoming" | "ongoing" | "completed"
  totalExpenses?: number
  collaborators?: number
  isPublic?: boolean
  isFavorite?: boolean
}

interface User {
  id: string
  name: string
  email: string
}

interface TripStats {
  totalTrips: number
  totalDestinations: number
  totalExpenses: number
  upcomingTrips: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([])
  const [stats, setStats] = useState<TripStats>({
    totalTrips: 0,
    totalDestinations: 0,
    totalExpenses: 0,
    upcomingTrips: 0,
  })
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [activeTab, setActiveTab] = useState("all")
  const [newTrip, setNewTrip] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    isPublic: false,
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchTrips()
    fetchStats()
  }, [router])

  useEffect(() => {
    filterTrips()
  }, [trips, searchQuery, filterStatus, activeTab])

  const fetchTrips = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/trips", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTrips(data.trips)
      }
    } catch (error) {
      console.error("Error fetching trips:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/dashboard/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const filterTrips = () => {
    let filtered = trips

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (trip) =>
          trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          trip.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by tab
    if (activeTab !== "all") {
      if (activeTab === "favorites") {
        filtered = filtered.filter((trip) => trip.isFavorite)
      } else if (activeTab === "shared") {
        filtered = filtered.filter((trip) => trip.collaborators && trip.collaborators > 0)
      } else {
        filtered = filtered.filter((trip) => trip.status === activeTab)
      }
    }

    setFilteredTrips(filtered)
  }

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTrip),
      })

      if (response.ok) {
        const data = await response.json()
        setTrips((prev) => [data.trip, ...prev])
        setCreateDialogOpen(false)
        setNewTrip({ title: "", description: "", startDate: "", endDate: "", isPublic: false })
        fetchStats() // Refresh stats
      }
    } catch (error) {
      console.error("Error creating trip:", error)
    }
  }

  const toggleFavorite = async (tripId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/trips/${tripId}/favorite`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setTrips((prev) => prev.map((trip) => (trip.id === tripId ? { ...trip, isFavorite: !trip.isFavorite } : trip)))
      }
    } catch (error) {
      console.error("Error toggling favorite:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "ongoing":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDaysUntilTrip = (startDate: string) => {
    const today = new Date()
    const tripDate = new Date(startDate)
    const diffTime = tripDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your trips...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">TravelPlan</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTrips}</p>
                </div>
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Destinations</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalDestinations}</p>
                </div>
                <Globe className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold text-gray-900">${stats.totalExpenses.toFixed(2)}</p>
                </div>
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.upcomingTrips}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Trip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Trip</DialogTitle>
                <DialogDescription>Start planning your next adventure by creating a new trip.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateTrip}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Trip Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Summer Vacation in Europe"
                      value={newTrip.title}
                      onChange={(e) => setNewTrip((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Brief description of your trip..."
                      value={newTrip.description}
                      onChange={(e) => setNewTrip((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={newTrip.startDate}
                        onChange={(e) => setNewTrip((prev) => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={newTrip.endDate}
                        onChange={(e) => setNewTrip((prev) => ({ ...prev, endDate: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={newTrip.isPublic}
                      onChange={(e) => setNewTrip((prev) => ({ ...prev, isPublic: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="isPublic" className="text-sm">
                      Make this trip public
                    </Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Trip</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All Trips</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Trips Grid */}
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? "No trips found" : "No trips yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Create your first trip to start planning your adventure!"}
            </p>
            {!searchQuery && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Trip
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => {
              const daysUntil = getDaysUntilTrip(trip.startDate)
              return (
                <Card key={trip.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <Link href={`/trip/${trip.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <CardTitle className="text-lg">{trip.title}</CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.preventDefault()
                                toggleFavorite(trip.id)
                              }}
                            >
                              <Heart className={`h-4 w-4 ${trip.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                            </Button>
                          </div>
                          <CardDescription className="line-clamp-2">
                            {trip.description || "No description provided"}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                        </div>

                        {daysUntil > 0 && daysUntil <= 30 && (
                          <div className="flex items-center text-sm text-blue-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {daysUntil} days until trip
                          </div>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{trip.destinations} destinations</Badge>
                            <Badge className={getStatusColor(trip.status)}>{trip.status}</Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            {trip.collaborators && trip.collaborators > 0 && (
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {trip.collaborators}
                              </div>
                            )}
                            {trip.totalExpenses && trip.totalExpenses > 0 && (
                              <div className="flex items-center">
                                <DollarSign className="h-3 w-3 mr-1" />${trip.totalExpenses.toFixed(0)}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-xs text-gray-500">Created {formatDate(trip.createdAt)}</div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
