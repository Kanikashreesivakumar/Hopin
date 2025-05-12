"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Car, Clock, MapPin, MoreHorizontal, Phone, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format } from "date-fns"
import RoleNavbar from "@/components/role-navbar"
import Mapbox from "@/components/mapbox"


const mockRides = [
  {
    id: "1",
    eventName: "Spring Music Festival",
    eventDate: "2025-04-15T18:00:00",
    departureTime: "2025-04-15T17:00:00",
    pickupLocation: "Student Union Building",
    pickupCoordinates: { lat: 28.6129, lng: 77.2295 },
    destinationCoordinates: { lat: 28.6139, lng: 77.209 },
    passengers: [
      { id: 1, name: "Saran", avatar: "/perlogo.jpg?height=40&width=40", phone: "+91 98765 43210" },
      { id: 2, name: "kani", avatar: "/perlogo.jpg?height=40&width=40", phone: "+91 98765 43211" },
      { id: 3, name: "muhammed shibin", avatar: "/perlogo.jpg?height=40&width=40", phone: "+91 98765 43212" },
    ],
    maxPassengers: 4,
    earnings: 350,
    status: "upcoming",
  },
  {
    id: "2",
    eventName: "Tech Conference 2023",
    eventDate: "2025-04-20T19:30:00",
    departureTime: "2025-04-20T18:30:00",
    pickupLocation: "North Campus Parking",
    pickupCoordinates: { lat: 28.6159, lng: 77.2195 },
    destinationCoordinates: { lat: 28.6189, lng: 77.219 },
    passengers: [
      { id: 4, name: "Malar", avatar: "/perlogo.jpg?height=40&width=40", phone: "+91 98765 43213" },
      { id: 5, name: "Jenisha ", avatar: "/perlogo.jpg?height=40&width=40", phone: "+91 98765 43214" },
      { id: 6, name: "Dinesh", avatar: "/perlogo.jpg?height=40&width=40", phone: "+91 98765 43215" },
    ],
    maxPassengers: 3,
    earnings: 450,
    status: "upcoming",
  },
  {
    id: "3",
    eventName: "Alumni Networking",
    eventDate: "2025-03-28T17:00:00",
    departureTime: "2025-03-28T16:00:00",
    pickupLocation: "Business School Atrium",
    pickupCoordinates: { lat: 28.6109, lng: 77.2395 },
    destinationCoordinates: { lat: 28.6119, lng: 77.239 },
    passengers: [
      { id: 7, name: "suman", avatar: "/perlogo.jpg?height=40&width=40", phone: "+91 98765 43216" },
      { id: 8, name: "trisha", avatar: "/perlogo.jpg?height=40&width=40", phone: "+91 98765 43217" },
    ],
    maxPassengers: 4,
    earnings: 250,
    status: "completed",
  },
  {
    id: "4",
    eventName: "Spring Concert",
    eventDate: "2025-03-15T19:00:00",
    departureTime: "2025-03-15T18:00:00",
    pickupLocation: "Music Hall",
    pickupCoordinates: { lat: 28.6179, lng: 77.2095 },
    destinationCoordinates: { lat: 28.6199, lng: 77.209 },
    passengers: [
      { id: 9, name: "trisha", avatar: "/perlogo.jpg?height=40&width=40", phone: "+91 98765 43218" },
      { id: 10, name: "susmitha", avatar: "/perlogo.jpg?height=40&width=40", phone: "+91 98765 43219" },
      { id: 11, name: "pradeep", avatar: "/?perlogo.jpgheight=40&width=40", phone: "+91 98765 43220" },
    ],
    maxPassengers: 3,
    earnings: 300,
    status: "completed",
  },
]

export default function MyRidesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedRide, setSelectedRide] = useState<string | null>(null)

  // Filter rides based on active tab
  const filteredRides = activeTab === "all" ? mockRides : mockRides.filter((ride) => ride.status === activeTab)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <RoleNavbar role="driver" userName="Alex Johnson" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Rides</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your upcoming and past rides</p>
          </div>

          <Button asChild className="mt-4 md:mt-0 bg-hopin-orange hover:bg-hopin-orange-dark text-white">
            <Link href="/dashboard/driver/offer-ride">
              <Car className="mr-2 h-4 w-4" />
              Offer a Ride
            </Link>
          </Button>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-0">
            <CardTitle>Ride Management</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full md:w-auto">
                <TabsTrigger value="all">All Rides</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={selectedRide ? "hidden lg:block" : "lg:col-span-3"}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRides.length > 0 ? (
                filteredRides.map((ride) => (
                  <Card
                    key={ride.id}
                    className={`overflow-hidden border ${
                      selectedRide === ride.id
                        ? "border-hopin-orange"
                        : "border-gray-200 dark:border-gray-700 hover:border-hopin-orange/50"
                    } transition-colors cursor-pointer`}
                    onClick={() => setSelectedRide(ride.id)}
                  >
                    <CardContent className="p-0">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{ride.eventName}</h3>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{format(new Date(ride.eventDate), "MMM d, yyyy")}</span>
                            </div>
                          </div>
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
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <span>Departure: {format(new Date(ride.departureTime), "h:mm a")}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{ride.pickupLocation}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span>
                            {ride.passengers.length}/{ride.maxPassengers} passengers
                          </span>
                        </div>
                        <div className="flex items-center text-sm font-medium text-hopin-orange">
                          <span>₹{ride.earnings} earnings</span>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex justify-between items-center">
                        <div className="flex -space-x-2">
                          {ride.passengers.slice(0, 3).map((passenger) => (
                            <Avatar key={passenger.id} className="h-8 w-8 border-2 border-white dark:border-gray-800">
                              <AvatarImage src={passenger.avatar || "/perlogo.jpg"} alt={passenger.name} />
                              <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">
                                {passenger.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                          {ride.passengers.length > 3 && (
                            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium border-2 border-white dark:border-gray-800">
                              +{ride.passengers.length - 3}
                            </div>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedRide(ride.id)
                              }}
                            >
                              <Car className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            {ride.status === "upcoming" && (
                              <>
                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                  <MapPin className="h-4 w-4 mr-2" />
                                  Share Location
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 dark:text-red-400"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Cancel Ride
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                    <Car className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No rides found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    {activeTab === "all"
                      ? "You haven't offered any rides yet"
                      : activeTab === "upcoming"
                        ? "You don't have any upcoming rides"
                        : activeTab === "completed"
                          ? "You don't have any completed rides"
                          : "You don't have any cancelled rides"}
                  </p>
                  <Button asChild className="bg-hopin-orange hover:bg-hopin-orange-dark text-white">
                    <Link href="/dashboard/driver/offer-ride">
                      <Car className="mr-2 h-4 w-4" />
                      Offer a Ride
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {selectedRide && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              {(() => {
                const ride = mockRides.find((r) => r.id === selectedRide)
                if (!ride) return null

                return (
                  <Card>
                    <CardHeader className="pb-0">
                      <div className="flex justify-between items-center">
                        <CardTitle>Ride Details</CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedRide(null)} className="lg:hidden">
                          Back to List
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                        <Mapbox
                          height="300px"
                          showDirections={true}
                          origin={ride.pickupCoordinates}
                          destination={ride.destinationCoordinates}
                          markers={[
                            {
                              position: ride.pickupCoordinates,
                              title: "Pickup: " + ride.pickupLocation,
                              info: `Departure: ${format(new Date(ride.departureTime), "h:mm a")}`,
                            },
                            {
                              position: ride.destinationCoordinates,
                              title: "Event: " + ride.eventName,
                              info: `Start time: ${format(new Date(ride.eventDate), "h:mm a")}`,
                            },
                          ]}
                          showTraffic={true}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold mb-4">Event Information</h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                              <div>
                                <div className="font-medium">{ride.eventName}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {format(new Date(ride.eventDate), "EEEE, MMMM d, yyyy")}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <div>
                                <div className="font-medium">Event Time</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {format(new Date(ride.eventDate), "h:mm a")}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold mb-4">Ride Information</h3>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <div>
                                <div className="font-medium">Departure Time</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {format(new Date(ride.departureTime), "h:mm a")}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <div>
                                <div className="font-medium">Pickup Location</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{ride.pickupLocation}</div>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-gray-500" />
                              <div>
                                <div className="font-medium">Passengers</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                  {ride.passengers.length}/{ride.maxPassengers} seats filled
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-4">Passenger List</h3>
                        <div className="space-y-3">
                          {ride.passengers.map((passenger) => (
                            <div
                              key={passenger.id}
                              className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  <AvatarImage src={passenger.avatar || "/perlogo.jpg"} alt={passenger.name} />
                                  <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">
                                    {passenger.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{passenger.name}</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">{passenger.phone}</div>
                                </div>
                              </div>
                              <Button variant="ghost" size="icon" className="text-hopin-orange">
                                <Phone className="h-4 w-4" />
                                <span className="sr-only">Call {passenger.name}</span>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">Total Earnings</span>
                          <Badge className="bg-hopin-orange text-white text-lg py-1 px-3">₹{ride.earnings}</Badge>
                        </div>
                      </div>

                      {ride.status === "upcoming" && (
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button asChild className="bg-hopin-orange hover:bg-hopin-orange-dark text-white flex-1">
                            <Link href="/dashboard/driver/location">
                              <MapPin className="mr-2 h-4 w-4" />
                              Share Location
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1 border-red-300 text-red-500 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            Cancel Ride
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })()}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}
