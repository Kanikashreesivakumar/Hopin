"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Car, Clock, Download, Filter, MapPin, MoreHorizontal, Search, User, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import RoleNavbar from "@/components/role-navbar"

// Mock data for rides
const initialRides = [
  {
    id: "1",
    driverName: "Alex Johnson",
    driverAvatar: "/placeholder.svg?height=40&width=40",
    driverRating: 4.8,
    eventName: "Spring Music Festival",
    eventDate: "2025-04-15T18:00:00",
    departureTime: "2025-04-15T17:00:00",
    pickupLocation: "Student Union Building",
    passengers: 3,
    maxPassengers: 4,
    cost: 5.5,
    status: "upcoming",
  },
  {
    id: "2",
    driverName: "Samantha Lee",
    driverAvatar: "/placeholder.svg?height=40&width=40",
    driverRating: 4.9,
    eventName: "Basketball Championship",
    eventDate: "2025-04-20T19:30:00",
    departureTime: "2025-04-20T18:30:00",
    pickupLocation: "North Campus Parking",
    passengers: 4,
    maxPassengers: 4,
    cost: 4.0,
    status: "upcoming",
  },
  {
    id: "3",
    driverName: "Michael Chen",
    driverAvatar: "/placeholder.svg?height=40&width=40",
    driverRating: 4.7,
    eventName: "Career Fair",
    eventDate: "2025-04-22T10:00:00",
    departureTime: "2025-04-22T09:00:00",
    pickupLocation: "Engineering Building",
    passengers: 2,
    maxPassengers: 3,
    cost: 3.5,
    status: "upcoming",
  },
  {
    id: "4",
    driverName: "Jessica Williams",
    driverAvatar: "/placeholder.svg?height=40&width=40",
    driverRating: 4.6,
    eventName: "Spring Music Festival",
    eventDate: "2025-04-15T18:00:00",
    departureTime: "2025-04-15T17:15:00",
    pickupLocation: "Downtown Station",
    passengers: 3,
    maxPassengers: 3,
    cost: 6.0,
    status: "upcoming",
  },
  {
    id: "5",
    driverName: "David Kim",
    driverAvatar: "/placeholder.svg?height=40&width=40",
    driverRating: 5.0,
    eventName: "Hackathon 2025",
    eventDate: "2025-04-25T08:00:00",
    departureTime: "2025-04-25T07:15:00",
    pickupLocation: "Computer Science Building",
    passengers: 3,
    maxPassengers: 3,
    cost: 4.5,
    status: "upcoming",
  },
  {
    id: "6",
    driverName: "Emily Johnson",
    driverAvatar: "/placeholder.svg?height=40&width=40",
    driverRating: 4.8,
    eventName: "Alumni Networking",
    eventDate: "2025-03-28T17:00:00",
    departureTime: "2025-03-28T16:00:00",
    pickupLocation: "Business School Atrium",
    passengers: 2,
    maxPassengers: 4,
    cost: 5.0,
    status: "completed",
  },
  {
    id: "7",
    driverName: "Ryan Patel",
    driverAvatar: "/placeholder.svg?height=40&width=40",
    driverRating: 4.5,
    eventName: "Spring Concert",
    eventDate: "2025-03-15T19:00:00",
    departureTime: "2025-03-15T18:00:00",
    pickupLocation: "Music Hall",
    passengers: 3,
    maxPassengers: 3,
    cost: 4.0,
    status: "completed",
  },
  {
    id: "8",
    driverName: "Olivia Martinez",
    driverAvatar: "/placeholder.svg?height=40&width=40",
    driverRating: 4.9,
    eventName: "Tech Meetup",
    eventDate: "2025-03-10T18:30:00",
    departureTime: "2025-03-10T17:45:00",
    pickupLocation: "Innovation Center",
    passengers: 2,
    maxPassengers: 4,
    cost: 3.5,
    status: "completed",
  },
]

interface Ride {
  id: string
  driverName: string
  driverAvatar: string
  driverRating: number
  eventName: string
  eventDate: string
  departureTime: string
  pickupLocation: string
  passengers: number
  maxPassengers: number
  cost: number
  status: "upcoming" | "completed" | "cancelled"
}

export default function ViewAllRidesPage() {
  const [rides, setRides] = useState<Ride[]>(initialRides)
  const [filteredRides, setFilteredRides] = useState<Ride[]>(rides)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(false)

  // Filter rides based on search term and active tab
  useEffect(() => {
    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      let filtered = rides

      if (searchTerm) {
        filtered = filtered.filter(
          (ride) =>
            ride.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ride.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ride.pickupLocation.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      if (activeTab !== "all") {
        filtered = filtered.filter((ride) => ride.status === activeTab)
      }

      setFilteredRides(filtered)
      setIsLoading(false)
    }, 300)
  }, [rides, searchTerm, activeTab])

  const handleExportData = () => {
    // In a real app, this would generate a CSV or Excel file
    alert("Exporting ride data...")
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <RoleNavbar role="admin" userName="Admin User" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">All Rides</h1>
            <p className="text-gray-600 dark:text-gray-400">View and manage all rides on the platform</p>
          </div>

          <Button
            variant="outline"
            className="mt-4 md:mt-0 border-hopin-orange text-hopin-orange hover:bg-hopin-orange/10"
            onClick={handleExportData}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Ride Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search rides..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-4 w-full md:w-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                  <TabsList>
                    <TabsTrigger value="all">All Rides</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Button variant="outline" size="icon" className="border-gray-300 dark:border-gray-600">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Driver</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead className="hidden md:table-cell">Departure</TableHead>
                    <TableHead className="hidden md:table-cell">Pickup Location</TableHead>
                    <TableHead className="hidden md:table-cell">Passengers</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={`loading-${index}`}>
                        {Array.from({ length: 8 }).map((_, cellIndex) => (
                          <TableCell key={`loading-cell-${cellIndex}`}>
                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filteredRides.length > 0 ? (
                    filteredRides.map((ride) => (
                      <TableRow key={ride.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={ride.driverAvatar || "/placeholder.svg"} alt={ride.driverName} />
                              <AvatarFallback>{ride.driverName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{ride.driverName}</div>
                              <div className="text-xs text-gray-500 flex items-center">{ride.driverRating} ★</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{ride.eventName}</div>
                          <div className="text-xs text-gray-500">{format(new Date(ride.eventDate), "MMM d, yyyy")}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{format(new Date(ride.departureTime), "h:mm a")}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{ride.pickupLocation}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            <span>
                              {ride.passengers}/{ride.maxPassengers}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>₹{ride.cost.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              ride.status === "upcoming"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                : ride.status === "completed"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }
                          >
                            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <User className="h-4 w-4 mr-2" />
                                View Driver
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Car className="h-4 w-4 mr-2" />
                                View Ride Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Calendar className="h-4 w-4 mr-2" />
                                View Event
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                Cancel Ride
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <Car className="h-8 w-8 text-gray-400 mb-2" />
                          <p className="text-gray-500 dark:text-gray-400">No rides found</p>
                          <p className="text-sm text-gray-400 dark:text-gray-500">
                            Try adjusting your search or filters
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ride Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-hopin-orange/10 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Rides</div>
                  <div className="text-2xl font-bold text-hopin-orange">{rides.length}</div>
                </div>
                <div className="bg-hopin-orange/10 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
                  <div className="text-2xl font-bold text-hopin-orange">
                    {rides.filter((ride) => ride.status === "upcoming").length}
                  </div>
                </div>
                <div className="bg-hopin-orange/10 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                  <div className="text-2xl font-bold text-hopin-orange">
                    {rides.filter((ride) => ride.status === "completed").length}
                  </div>
                </div>
                <div className="bg-hopin-orange/10 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Cancelled</div>
                  <div className="text-2xl font-bold text-hopin-orange">
                    {rides.filter((ride) => ride.status === "cancelled").length}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Popular Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array.from(new Set(rides.map((ride) => ride.eventName)))
                  .slice(0, 3)
                  .map((eventName) => {
                    const eventRides = rides.filter((ride) => ride.eventName === eventName)
                    const totalPassengers = eventRides.reduce((sum, ride) => sum + ride.passengers, 0)

                    return (
                      <div
                        key={eventName}
                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{eventName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {eventRides.length} rides • {totalPassengers} passengers
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-hopin-orange hover:bg-hopin-orange/10">
                          View Details
                        </Button>
                      </div>
                    )
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
