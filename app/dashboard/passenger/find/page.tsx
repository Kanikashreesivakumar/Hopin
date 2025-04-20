"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Filter, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RoleNavbar from "@/components/role-navbar"
import Mapbox from "@/components/mapbox"
import RideCard from "@/components/ride-card"

// Mock data for rides
const mockRides = [
  {
    id: 1,
    driverName: "Alex Johnson",
    driverRating: 4.8,
    eventName: "Spring Music Festival",
    eventDate: "2025-04-15T18:00:00",
    pickupPoint: "Student Union Building",
    pickupCoordinates: { lat: 28.6129, lng: 77.2295 },
    destinationCoordinates: { lat: 28.6139, lng: 77.209 },
    cost: 5.5,
    availableSeats: 3,
    carModel: "Honda Civic",
    departureTime: "2025-04-15T17:00:00",
  },
  {
    id: 2,
    driverName: "Samantha Lee",
    driverRating: 4.9,
    eventName: "Basketball Championship",
    eventDate: "2025-04-20T19:30:00",
    pickupPoint: "North Campus Parking",
    pickupCoordinates: { lat: 28.6129, lng: 77.2295 },
    destinationCoordinates: { lat: 28.6139, lng: 77.209 },
    cost: 4.0,
    availableSeats: 4,
    carModel: "Toyota Corolla",
    departureTime: "2025-04-20T18:30:00",
  },
  {
    id: 3,
    driverName: "Michael Chen",
    driverRating: 4.7,
    eventName: "Career Fair",
    eventDate: "2025-04-22T10:00:00",
    pickupPoint: "Engineering Building",
    pickupCoordinates: { lat: 28.6129, lng: 77.2295 },
    destinationCoordinates: { lat: 28.6139, lng: 77.209 },
    cost: 3.5,
    availableSeats: 2,
    carModel: "Tesla Model 3",
    departureTime: "2025-04-22T09:00:00",
  },
  {
    id: 4,
    driverName: "Jessica Williams",
    driverRating: 4.6,
    eventName: "Spring Music Festival",
    eventDate: "2025-04-15T18:00:00",
    pickupPoint: "Downtown Station",
    pickupCoordinates: { lat: 28.6129, lng: 77.2295 },
    destinationCoordinates: { lat: 28.6139, lng: 77.209 },
    cost: 6.0,
    availableSeats: 3,
    carModel: "Hyundai Sonata",
    departureTime: "2025-04-15T17:15:00",
  },
  {
    id: 5,
    driverName: "David Kim",
    driverRating: 5.0,
    eventName: "Hackathon 2025",
    eventDate: "2025-04-25T08:00:00",
    pickupPoint: "Computer Science Building",
    pickupCoordinates: { lat: 28.6129, lng: 77.2295 },
    destinationCoordinates: { lat: 28.6139, lng: 77.209 },
    cost: 4.5,
    availableSeats: 3,
    carModel: "Kia Soul",
    departureTime: "2025-04-25T07:15:00",
  },
]

export default function FindRidePage() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [filteredRides, setFilteredRides] = useState(mockRides)
  const [searchTerm, setSearchTerm] = useState("")
  const [event, setEvent] = useState<string>("all")
  const [showMap, setShowMap] = useState(false)
  const [selectedRide, setSelectedRide] = useState<(typeof mockRides)[0] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      let results = mockRides

      if (searchTerm) {
        results = results.filter(
          (ride) =>
            ride.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ride.pickupPoint.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ride.driverName.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      }

      if (event !== "all") {
        results = results.filter((ride) => ride.eventName === event)
      }

      if (date) {
        results = results.filter((ride) => {
          const rideDate = new Date(ride.eventDate)
          return rideDate.toDateString() === date.toDateString()
        })
      }

      setFilteredRides(results)
      setIsLoading(false)
    }, 800)
  }

  const uniqueEvents = Array.from(new Set(mockRides.map((ride) => ride.eventName)))

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const handleRideSelect = (ride: (typeof mockRides)[0]) => {
    setSelectedRide(ride)
    setShowMap(true)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <RoleNavbar role="passenger" userName="Emma Wilson" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Find a Ride</h1>
            <p className="text-gray-600 dark:text-gray-400">Browse available rides to your favorite campus events</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Rides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="search"
                    placeholder="Event, location, driver..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="event">Event</Label>
                <Select value={event} onValueChange={setEvent}>
                  <SelectTrigger id="event">
                    <SelectValue placeholder="Select event" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    {uniqueEvents.map((event) => (
                      <SelectItem key={event} value={event}>
                        {event}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleSearch}
                  className="w-full bg-hopin-orange hover:bg-hopin-orange-dark text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Filter className="mr-2 h-4 w-4" />
                      Apply Filters
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {showMap && selectedRide && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader className="pb-0">
                <div className="flex justify-between items-center">
                  <CardTitle>
                    Route Preview: {selectedRide.pickupPoint} to {selectedRide.eventName}
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowMap(false)}>
                    Close
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <Mapbox
                  height="400px"
                  showDirections={true}
                  origin={selectedRide.pickupCoordinates}
                  destination={selectedRide.destinationCoordinates}
                  markers={[
                    {
                      position: { lat: 28.6129, lng: 77.2295 },
                      title: "Pickup: " + selectedRide.pickupPoint,
                      info: `Departure: ${format(new Date(selectedRide.departureTime), "h:mm a")}`,
                    },
                    {
                      position: { lat: 28.6139, lng: 77.209 },
                      title: "Event: " + selectedRide.eventName,
                      info: `Start time: ${format(new Date(selectedRide.eventDate), "h:mm a")}`,
                    },
                  ]}
                  showTraffic={true}
                  showRouteOptions={true}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRides.length > 0 ? (
            filteredRides.map((ride) => (
              <motion.div key={ride.id} variants={item}>
                <RideCard ride={ride} onViewRoute={() => handleRideSelect(ride)} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium mb-2">No rides found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters or search terms</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
