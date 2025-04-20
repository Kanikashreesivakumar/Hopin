"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Calendar, Car, Clock, CreditCard, MapPin, Plus, Settings, Star, Users } from "lucide-react"
import PageHeader from "@/components/page-header"

// Mock data
const upcomingRides = [
  {
    id: "ride1",
    eventName: "Spring Music Festival",
    date: "April 15, 2025",
    time: "5:30 PM",
    role: "passenger",
    driver: "Sarah Miller",
    driverRating: 4.9,
    pickupPoint: "Student Union Building",
  },
  {
    id: "ride2",
    eventName: "Career Fair",
    date: "April 22, 2025",
    time: "9:00 AM",
    role: "driver",
    passengers: 2,
    maxPassengers: 3,
    pickupPoint: "Engineering Building",
  },
]

const upcomingEvents = [
  {
    id: "event1",
    name: "Spring Music Festival",
    date: "April 15, 2025",
    time: "6:00 PM",
    location: "Student Union Building",
    attendees: 120,
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "event2",
    name: "Basketball Championship",
    date: "April 20, 2025",
    time: "7:30 PM",
    location: "University Sports Center",
    attendees: 85,
    image: "/placeholder.svg?height=100&width=200",
  },
  {
    id: "event3",
    name: "Career Fair",
    date: "April 22, 2025",
    time: "10:00 AM",
    location: "Engineering Building",
    attendees: 200,
    image: "/placeholder.svg?height=100&width=200",
  },
]

const recentTransactions = [
  {
    id: "tx1",
    description: "Ride to Spring Music Festival",
    amount: -5.5,
    date: "April 10, 2025",
    status: "completed",
  },
  {
    id: "tx2",
    description: "Earnings from Basketball Championship",
    amount: 12.0,
    date: "April 5, 2025",
    status: "completed",
  },
  {
    id: "tx3",
    description: "Refund for canceled ride",
    amount: 4.5,
    date: "April 2, 2025",
    status: "completed",
  },
]

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title="Dashboard" description="Welcome back to your HOPIN dashboard" icon="👋" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <TabsList className="w-full max-w-md mx-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rides">My Rides</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>
      </Tabs>

      <TabsContent value="overview" className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Rides</CardTitle>
                <CardDescription>Your scheduled rides</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingRides.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingRides.map((ride) => (
                      <div
                        key={ride.id}
                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{ride.eventName}</h4>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Calendar className="h-3 w-3 mr-1" />
                              {ride.date} • {ride.time}
                            </div>
                          </div>
                          <Badge
                            className={
                              ride.role === "driver"
                                ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                            }
                          >
                            {ride.role === "driver" ? "Driver" : "Passenger"}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center text-sm">
                          <MapPin className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-300">{ride.pickupPoint}</span>
                        </div>
                        {ride.role === "passenger" && (
                          <div className="mt-2 flex items-center text-sm">
                            <div className="flex items-center">
                              <Avatar className="h-5 w-5 mr-1">
                                <AvatarFallback>{ride.driver ? ride.driver.charAt(0) : "?"}</AvatarFallback>
                              </Avatar>
                              <span>{ride.driver}</span>
                            </div>
                            <div className="flex items-center ml-2">
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              <span className="ml-1">{ride.driverRating}</span>
                            </div>
                          </div>
                        )}
                        {ride.role === "driver" && (
                          <div className="mt-2 flex items-center text-sm">
                            <Users className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">
                              {ride.passengers}/{ride.maxPassengers} passengers
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <Car className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No upcoming rides</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <div className="flex gap-2 w-full">
                  <Button asChild variant="outline" className="w-1/2">
                    <Link href="/find-ride">Find a Ride</Link>
                  </Button>
                  <Button
                    asChild
                    className="w-1/2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    <Link href="/offer-ride">Offer a Ride</Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Upcoming Events</CardTitle>
                <CardDescription>Events you might be interested in</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="flex gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <img
                          src={event.image || "/placeholder.svg"}
                          alt={event.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <div>
                          <h4 className="font-medium">{event.name}</h4>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-3 w-3 mr-1" />
                            {event.date} • {event.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No upcoming events</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Link href="/dashboard/events">
                    <Plus className="h-4 w-4 mr-2" />
                    Manage Events
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
                <CardDescription>Your payment history</CardDescription>
              </CardHeader>
              <CardContent>
                {recentTransactions.length > 0 ? (
                  <div className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{transaction.description}</h4>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</div>
                          </div>
                          <span
                            className={`font-medium ${
                              transaction.amount > 0
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent transactions</p>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/profile">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
              <CardDescription>Common tasks you might want to perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button asChild variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                  <Link href="/find-ride">
                    <Car className="h-6 w-6 mb-2" />
                    <span>Find a Ride</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                  <Link href="/offer-ride">
                    <Users className="h-6 w-6 mb-2" />
                    <span>Offer a Ride</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                  <Link href="/dashboard/events">
                    <Calendar className="h-6 w-6 mb-2" />
                    <span>Manage Events</span>
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-auto py-6 flex flex-col items-center justify-center">
                  <Link href="/profile">
                    <Settings className="h-6 w-6 mb-2" />
                    <span>Account Settings</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </TabsContent>

      <TabsContent value="rides">
        <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle>My Rides</CardTitle>
            <CardDescription>Manage your upcoming and past rides</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Ride details will appear here</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                View your upcoming rides, track ride status, and see your ride history
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/find-ride">Find a Ride</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Link href="/offer-ride">Offer a Ride</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="events">
        <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle>Events</CardTitle>
            <CardDescription>Discover and manage campus events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Event details will appear here</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                Browse upcoming events, create new events, and manage your event listings
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/dashboard/events">Browse Events</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Link href="/create-event">Create Event</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="payments">
        <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700 shadow-lg">
          <CardHeader>
            <CardTitle>Payments</CardTitle>
            <CardDescription>Manage your payment methods and transaction history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Payment details will appear here</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                View your transaction history, manage payment methods, and track your earnings
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Link href="/profile">Manage Payment Methods</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </div>
  )
}
