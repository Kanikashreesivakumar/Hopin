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
import { useAuth } from "@/hooks/AuthContext"

interface Ride {
  _id: string
  driverId: {
    _id: string
    name: string
    avatar?: string
    rating?: number
  }
  eventId?: {
    _id: string
    title: string
    date: string | Date
  }
  eventName?: string
  eventDate?: string | Date
  departureTime: string | Date
  startLocation: string
  endLocation: string
  passengerIds: string[]
  availableSeats: number
  cost: number
  status: "upcoming" | "completed" | "cancelled" | "inprogress"
}

export default function ViewAllRidesPage() {
  const [rides, setRides] = useState<Ride[]>([])
  const [filteredRides, setFilteredRides] = useState<Ride[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { user } = useAuth()

  const fetchRides = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/rides")
      if (!response.ok) {
        throw new Error("Failed to fetch rides")
      }
      const result = await response.json()
      if (result.success) {
        const mappedRides = result.data.map((rideData: any) => ({
          _id: rideData._id,
          driverId: rideData.driverId
            ? {
                _id: rideData.driverId._id,
                name: rideData.driverId.name || "Unknown Driver",
                avatar: rideData.driverId.avatar,
                rating: rideData.driverId.rating,
              }
            : { _id: "", name: "Unknown Driver" },
          eventId: rideData.eventId
            ? {
                _id: rideData.eventId._id,
                title: rideData.eventId.title || "Unknown Event",
                date: rideData.eventId.date,
              }
            : undefined,
          eventName: rideData.eventId?.title || "Unknown Event",
          eventDate: rideData.eventId?.date || rideData.departureTime,
          departureTime: rideData.departureTime,
          startLocation: rideData.startLocation,
          endLocation: rideData.endLocation,
          passengerIds: rideData.passengerIds || [],
          availableSeats: rideData.availableSeats,
          cost: rideData.cost || 0,
          status: rideData.status || "upcoming",
        }))
        setRides(mappedRides)
        setFilteredRides(mappedRides)
      } else {
        throw new Error(result.error || "Failed to fetch rides")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRides()
  }, [])

  useEffect(() => {
    let filtered = rides

    if (searchTerm) {
      filtered = filtered.filter(
        (ride) =>
          (ride.driverId.name && ride.driverId.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (ride.eventName && ride.eventName.toLowerCase().includes(searchTerm.toLowerCase())) ||
          ride.startLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ride.endLocation.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((ride) => ride.status === activeTab)
    }

    setFilteredRides(filtered)
  }, [rides, searchTerm, activeTab])

  const handleExportData = () => {
    console.log("Exporting data:", filteredRides)
    alert("Exporting ride data... (Check console for data)")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
        <main className="container mx-auto px-4 py-8 text-center">
          <p>Loading rides...</p>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading rides</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <Button onClick={fetchRides} className="mt-4">
            Try Again
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

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
                    <TableHead className="hidden md:table-cell">Pickup</TableHead>
                    <TableHead className="hidden lg:table-cell">Destination</TableHead>
                    <TableHead className="hidden md:table-cell">Seats</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRides.length > 0 ? (
                    filteredRides.map((ride) => (
                      <TableRow key={ride._id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={ride.driverId.avatar || "/placeholder.svg"} alt={ride.driverId.name} />
                              <AvatarFallback>{ride.driverId.name ? ride.driverId.name.charAt(0) : "?"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{ride.driverId.name}</div>
                              {ride.driverId.rating !== undefined && (
                                <div className="text-xs text-gray-500 flex items-center">
                                  {ride.driverId.rating.toFixed(1)} ★
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{ride.eventName}</div>
                          <div className="text-xs text-gray-500">
                            {ride.eventDate ? format(new Date(ride.eventDate), "MMM d, yyyy") : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            <span>
                              {ride.departureTime ? format(new Date(ride.departureTime), "h:mm a") : "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{ride.startLocation}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{ride.endLocation}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-500" />
                            <span>
                              {ride.passengerIds.length}/{ride.availableSeats + ride.passengerIds.length}
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
                                : ride.status === "inprogress"
                                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
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
                      <TableCell colSpan={9} className="h-24 text-center">
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
                {Object.entries(
                  rides.reduce((acc, ride) => {
                    const name = ride.eventName || "Unknown Event"
                    if (!acc[name]) {
                      acc[name] = { count: 0, passengers: 0 }
                    }
                    acc[name].count++
                    acc[name].passengers += ride.passengerIds.length
                    return acc
                  }, {} as Record<string, { count: number; passengers: number }>),
                )
                  .sort(([, a], [, b]) => b.count - a.count)
                  .slice(0, 3)
                  .map(([eventName, stats]) => (
                    <div
                      key={eventName}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{eventName}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {stats.count} rides • {stats.passengers} passengers
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-hopin-orange hover:bg-hopin-orange/10">
                        View Details
                      </Button>
                    </div>
                  ))}
                {rides.length === 0 && !isLoading && (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    No ride data available for popular events.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
