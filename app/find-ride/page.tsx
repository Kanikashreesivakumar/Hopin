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
import RideCard from "@/components/ride-card"
import PageHeader from "@/components/page-header"
import Mapbox from "@/components/mapbox"

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
    pickupCoordinates: { lat: 28.6149, lng: 77.2295 },
    destinationCoordinates: { lat: 28.6159, lng: 77.209 },
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
    pickupCoordinates: { lat: 28.6169, lng: 77.2295 },
    destinationCoordinates: { lat: 28.6179, lng: 77.209 },
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
    pickupCoordinates: { lat: 28.6189, lng: 77.2295 },
    destinationCoordinates: { lat: 28.6199, lng: 77.209 },
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
    pickupCoordinates: { lat: 28.6209, lng: 77.2295 },
    destinationCoordinates: { lat: 28.6219, lng: 77.209 },
    cost: 4.5,
    availableSeats: 3,
    carModel: "Kia Soul",
    departureTime: "2025-04-25T07:15:00",
  },
]

export default function FindRide() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [filteredRides, setFilteredRides] = useState(mockRides)
  const [searchTerm, setSearchTerm] = useState("")
  const [event, setEvent] = useState<string>("all")
  const [showMap, setShowMap] = useState(false)
  const [selectedRide, setSelectedRide] = useState<(typeof mockRides)[0] | null>(null)

  const handleSearch = () => {
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
    <div className="container mx-auto px-4 py-12">
      <PageHeader title="Find a Ride" description="Browse available rides to your favorite campus events" icon="🔍" />

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8 backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70 border border-gray-100 dark:border-gray-700">
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
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
          </div>
        </div>
      </div>

      {showMap && selectedRide && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70 border border-gray-100 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">
                  Route Preview: {selectedRide.pickupPoint} to {selectedRide.eventName}
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setShowMap(false)}>
                  Close
                </Button>
              </div>
            </div>
            <Mapbox
              height="400px"
              showDirections={true}
              origin={selectedRide.pickupCoordinates}
              destination={selectedRide.destinationCoordinates}
              markers={[
                {
                  position: selectedRide.pickupCoordinates,
                  title: "Pickup: " + selectedRide.pickupPoint,
                  info: `Departure: ${format(new Date(selectedRide.departureTime), "h:mm a")}`,
                },
                {
                  position: selectedRide.destinationCoordinates,
                  title: "Event: " + selectedRide.eventName,
                  info: `Start time: ${format(new Date(selectedRide.eventDate), "h:mm a")}`,
                },
              ]}
              showTraffic={true}
              showRouteOptions={true}
            />
          </div>
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
    </div>
  )
}
