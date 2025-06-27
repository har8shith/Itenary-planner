import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Users, Download } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">TravelPlan</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Plan Your Perfect Trip</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create detailed itineraries, organize destinations, and share your travel plans with ease. Your next
            adventure starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="px-8 py-3">
                Get Started Free
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything You Need to Plan</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Smart Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Organize your itinerary by dates and times with drag-and-drop simplicity.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <MapPin className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Map Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Visualize your destinations on interactive maps and get directions.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Collaborate</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Share your itineraries with travel companions and plan together.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Download className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Export & Share</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Download your itinerary as PDF or share with a simple link.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4">Ready to Start Planning?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of travelers who trust TravelPlan for their adventures.
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="px-8 py-3">
              Create Your First Trip
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <MapPin className="h-6 w-6" />
            <span className="text-lg font-semibold">TravelPlan</span>
          </div>
          <p className="text-gray-400">© 2024 TravelPlan. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
