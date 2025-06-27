"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, Plus, Calendar, ArrowLeft, Download, Edit, Trash2, Map } from "lucide-react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Cloud, DollarSign, Users, Camera, Star } from "lucide-react"

interface Destination {
  id: string
  name: string
  description: string
  date: string
  time: string
  notes: string
  address: string
  order: number
}

interface Trip {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  destinations: Destination[]
}

export default function TripDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [addDestinationOpen, setAddDestinationOpen] = useState(false)
  const [newDestination, setNewDestination] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    notes: "",
    address: "",
  })
  const [weather, setWeather] = useState<any>(null)
  const [expenses, setExpenses] = useState<any[]>([])
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [showExpenseDialog, setShowExpenseDialog] = useState(false)
  const [showCollaboratorDialog, setShowCollaboratorDialog] = useState(false)
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "food",
    date: "",
    paidBy: "",
  })
  const [newCollaborator, setNewCollaborator] = useState({ email: "" })

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }
    fetchTrip()
    fetchWeather()
    fetchExpenses()
  }, [params.id, router])

  const fetchTrip = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/trips/${params.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setTrip(data.trip)
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error fetching trip:", error)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  const handleAddDestination = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/trips/${params.id}/destinations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDestination),
      })

      if (response.ok) {
        const data = await response.json()
        setTrip((prev) =>
          prev
            ? {
                ...prev,
                destinations: [...prev.destinations, data.destination],
              }
            : null,
        )
        setAddDestinationOpen(false)
        setNewDestination({
          name: "",
          description: "",
          date: "",
          time: "",
          notes: "",
          address: "",
        })
      }
    } catch (error) {
      console.error("Error adding destination:", error)
    }
  }

  const handleExportPDF = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/trips/${params.id}/export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `${trip?.title || "trip"}-itinerary.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error("Error exporting PDF:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return ""
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return

    const items = Array.from(trip?.destinations || [])
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update the trip state immediately for better UX
    if (trip) {
      setTrip({
        ...trip,
        destinations: items.map((item, index) => ({ ...item, order: index + 1 })),
      })
    }

    // API call to update order
    try {
      const token = localStorage.getItem("token")
      await fetch(`/api/trips/${params.id}/reorder`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ destinationIds: items.map((item) => item.id) }),
      })
    } catch (error) {
      console.error("Error reordering destinations:", error)
    }
  }

  const fetchWeather = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/trips/${params.id}/weather`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setWeather(data.weather)
      }
    } catch (error) {
      console.error("Error fetching weather:", error)
    }
  }

  const fetchExpenses = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/trips/${params.id}/expenses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setExpenses(data.expenses)
      }
    } catch (error) {
      console.error("Error fetching expenses:", error)
    }
  }

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/trips/${params.id}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExpense),
      })
      if (response.ok) {
        const data = await response.json()
        setExpenses((prev) => [...prev, data.expense])
        setShowExpenseDialog(false)
        setNewExpense({ description: "", amount: "", category: "food", date: "", paidBy: "" })
      }
    } catch (error) {
      console.error("Error adding expense:", error)
    }
  }

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/trips/${params.id}/collaborators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCollaborator),
      })
      if (response.ok) {
        const data = await response.json()
        setCollaborators((prev) => [...prev, data.collaborator])
        setShowCollaboratorDialog(false)
        setNewCollaborator({ email: "" })
      }
    } catch (error) {
      console.error("Error adding collaborator:", error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip not found</h2>
          <p className="text-gray-600 mb-4">The trip you're looking for doesn't exist.</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
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
                <h1 className="text-2xl font-bold text-gray-900">{trip.title}</h1>
                <p className="text-gray-600">
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline" onClick={() => setShowExpenseDialog(true)}>
                <DollarSign className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
              <Button variant="outline" onClick={() => setShowCollaboratorDialog(true)}>
                <Users className="h-4 w-4 mr-2" />
                Share Trip
              </Button>
              <Dialog open={addDestinationOpen} onOpenChange={setAddDestinationOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Destination
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Destination</DialogTitle>
                    <DialogDescription>
                      Add a new destination to your itinerary with details and timing.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddDestination}>
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Destination Name</Label>
                          <Input
                            id="name"
                            placeholder="e.g., Eiffel Tower"
                            value={newDestination.name}
                            onChange={(e) => setNewDestination((prev) => ({ ...prev, name: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            placeholder="Full address"
                            value={newDestination.address}
                            onChange={(e) => setNewDestination((prev) => ({ ...prev, address: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="What will you do here?"
                          value={newDestination.description}
                          onChange={(e) => setNewDestination((prev) => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newDestination.date}
                            onChange={(e) => setNewDestination((prev) => ({ ...prev, date: e.target.value }))}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time">Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newDestination.time}
                            onChange={(e) => setNewDestination((prev) => ({ ...prev, time: e.target.value }))}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Any additional notes or reminders..."
                          value={newDestination.notes}
                          onChange={(e) => setNewDestination((prev) => ({ ...prev, notes: e.target.value }))}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" variant="outline" onClick={() => setAddDestinationOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Add Destination</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Itinerary */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Itinerary</h2>
              <Badge variant="secondary">{trip.destinations.length} destinations</Badge>
            </div>

            {trip.destinations.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <MapPin className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations yet</h3>
                  <p className="text-gray-600 mb-6">Start building your itinerary by adding destinations!</p>
                  <Button onClick={() => setAddDestinationOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Destination
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="destinations">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {trip.destinations
                        .sort((a, b) => a.order - b.order)
                        .map((destination, index) => (
                          <Draggable key={destination.id} draggableId={destination.id} index={index}>
                            {(provided, snapshot) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className={`hover:shadow-md transition-shadow ${
                                  snapshot.isDragging ? "shadow-lg rotate-2" : ""
                                }`}
                              >
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3">
                                      <div
                                        {...provided.dragHandleProps}
                                        className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold cursor-grab active:cursor-grabbing"
                                      >
                                        {index + 1}
                                      </div>
                                      <div>
                                        <CardTitle className="text-lg">{destination.name}</CardTitle>
                                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                          <div className="flex items-center">
                                            <Calendar className="h-4 w-4 mr-1" />
                                            {formatDate(destination.date)}
                                          </div>
                                          {destination.time && <span>{formatTime(destination.time)}</span>}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Button variant="ghost" size="sm">
                                        <Camera className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Star className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button variant="ghost" size="sm">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  {destination.description && (
                                    <p className="text-gray-700 mb-3">{destination.description}</p>
                                  )}
                                  {destination.address && (
                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                      <MapPin className="h-4 w-4 mr-2" />
                                      {destination.address}
                                    </div>
                                  )}
                                  {destination.notes && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                                      <p className="text-sm text-yellow-800">
                                        <strong>Notes:</strong> {destination.notes}
                                      </p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Trip Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Description</Label>
                  <p className="text-sm text-gray-900 mt-1">{trip.description || "No description provided"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Duration</Label>
                  <p className="text-sm text-gray-900 mt-1">
                    {Math.ceil(
                      (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Destinations</Label>
                  <p className="text-sm text-gray-900 mt-1">{trip.destinations.length} locations</p>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Map className="h-5 w-5 mr-2" />
                  Map View
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Map className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Interactive map coming soon</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weather Card */}
            {weather && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Cloud className="h-5 w-5 mr-2" />
                    Weather Forecast
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {weather.forecast?.slice(0, 3).map((day: any, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="text-sm">
                          <p className="font-medium">{day.date}</p>
                          <p className="text-gray-600">{day.condition}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {day.high}°/{day.low}°
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Expenses Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Expenses
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowExpenseDialog(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {expenses.length === 0 ? (
                  <p className="text-sm text-gray-500">No expenses tracked yet</p>
                ) : (
                  <div className="space-y-2">
                    <div className="text-lg font-semibold">
                      Total: ${expenses.reduce((sum, exp) => sum + Number.parseFloat(exp.amount), 0).toFixed(2)}
                    </div>
                    {expenses.slice(0, 3).map((expense) => (
                      <div key={expense.id} className="flex justify-between text-sm">
                        <span className="truncate">{expense.description}</span>
                        <span className="font-medium">${expense.amount}</span>
                      </div>
                    ))}
                    {expenses.length > 3 && (
                      <p className="text-xs text-gray-500">+{expenses.length - 3} more expenses</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Collaborators Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Collaborators
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowCollaboratorDialog(true)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {collaborators.length === 0 ? (
                  <p className="text-sm text-gray-500">No collaborators yet</p>
                ) : (
                  <div className="space-y-2">
                    {collaborators.map((collaborator) => (
                      <div key={collaborator.id} className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-blue-600">
                            {collaborator.name?.charAt(0) || collaborator.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm">{collaborator.name || collaborator.email}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="h-4 w-4 mr-2" />
                  Export as PDF
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MapPin className="h-4 w-4 mr-2" />
                  View on Map
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Expense Dialog */}
        <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Expense</DialogTitle>
              <DialogDescription>Track your trip expenses and split costs with collaborators.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddExpense}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="expense-description">Description</Label>
                  <Input
                    id="expense-description"
                    placeholder="e.g., Dinner at restaurant"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense((prev) => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expense-amount">Amount</Label>
                    <Input
                      id="expense-amount"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense((prev) => ({ ...prev, amount: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expense-category">Category</Label>
                    <select
                      id="expense-category"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newExpense.category}
                      onChange={(e) => setNewExpense((prev) => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="food">Food & Dining</option>
                      <option value="transport">Transportation</option>
                      <option value="accommodation">Accommodation</option>
                      <option value="activities">Activities</option>
                      <option value="shopping">Shopping</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expense-date">Date</Label>
                  <Input
                    id="expense-date"
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense((prev) => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowExpenseDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Expense</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Collaborator Dialog */}
        <Dialog open={showCollaboratorDialog} onOpenChange={setShowCollaboratorDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Trip</DialogTitle>
              <DialogDescription>Invite others to collaborate on this trip itinerary.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddCollaborator}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="collaborator-email">Email Address</Label>
                  <Input
                    id="collaborator-email"
                    type="email"
                    placeholder="friend@example.com"
                    value={newCollaborator.email}
                    onChange={(e) => setNewCollaborator({ email: e.target.value })}
                    required
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    Collaborators can view and edit this trip, add destinations, and track expenses together.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCollaboratorDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Send Invitation</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
