"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Eye, Heart, Share2, Download, MapPin } from "lucide-react"

interface TripAnalytics {
  views: number
  likes: number
  shares: number
  downloads: number
  collaborators: number
  completionRate: number
  budgetUtilization: number
  popularDestinations: Array<{
    name: string
    visits: number
  }>
}

interface TripAnalyticsProps {
  tripId: string
}

export function TripAnalytics({ tripId }: TripAnalyticsProps) {
  const [analytics, setAnalytics] = useState<TripAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [tripId])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/trips/${tripId}/analytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.analytics)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trip Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Views</p>
                <p className="text-2xl font-bold">{analytics.views}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Likes</p>
                <p className="text-2xl font-bold">{analytics.likes}</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Shares</p>
                <p className="text-2xl font-bold">{analytics.shares}</p>
              </div>
              <Share2 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Downloads</p>
                <p className="text-2xl font-bold">{analytics.downloads}</p>
              </div>
              <Download className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Trip Progress</CardTitle>
          <CardDescription>Track your trip planning and execution progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Itinerary Completion</span>
              <span>{analytics.completionRate}%</span>
            </div>
            <Progress value={analytics.completionRate} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Budget Utilization</span>
              <span>{analytics.budgetUtilization}%</span>
            </div>
            <Progress value={analytics.budgetUtilization} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Popular Destinations */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Destinations</CardTitle>
          <CardDescription>Most visited places in your itinerary</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {analytics.popularDestinations.map((destination, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{destination.name}</span>
                </div>
                <Badge variant="secondary">{destination.visits} visits</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
