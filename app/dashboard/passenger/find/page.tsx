"use client"

import { useState, useEffect } from "react"
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

import Mapbox from "@/components/mapbox"
import RideCard from "@/components/ride-card"

export default function FindRidePage() {
  const [rides, setRides] = useState<any[]>([])
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [filteredRides, setFilteredRides] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [event, setEvent] = useState<string>("all")
  const [showMap, setShowMap] = useState(false)
  const [selectedRide, setSelectedRide] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    const fetchRides = async () => {
      setIsFetching(true)
      try {
        const res = await fetch("/api/admin/rides")
        const json = await res.json()
        if (json.success) {
          setRides(
            json.data.map((ride: any) => ({
              id: ride.id,
              startLocation: ride.start_location,
              endLocation: ride.end_location,
              departureTime: ride.departure_time,
              availableSeats: ride.available_seats,
              cost: ride.cost,
              notes: ride.notes,
              status: ride.status,
              driverName: ride.driver?.name || ride.driverName,
              eventName: ride.event?.title || ride.eventName,
            }))
          )
          setFilteredRides(
            json.data.map((ride: any) => ({
              id: ride.id,
              startLocation: ride.start_location,
              endLocation: ride.end_location,
              departureTime: ride.departure_time,
              availableSeats: ride.available_seats,
              cost: ride.cost,
              notes: ride.notes,
              status: ride.status,
              driverName: ride.driver?.name || ride.driverName,
              eventName: ride.event?.title || ride.eventName,
            }))
          )
        } else {
          setRides([])
          setFilteredRides([])
        }
      } catch (e) {
        setRides([])
        setFilteredRides([])
      } finally {
        setIsFetching(false)
      }
    }
    fetchRides()
  }, [])

  const handleSearch = () => {
    setIsLoading(true)
    setTimeout(() => {
      let results = rides
      if (searchTerm) {
        results = results.filter(
          (ride) =>
            ride.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ride.startLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ride.driverName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      if (event !== "all") {
        results = results.filter((ride) => ride.eventName === event)
      }
      if (date) {
        results = results.filter((ride) => {
          const rideDate = new Date(ride.departureTime)
          return rideDate.toDateString() === date.toDateString()
        })
      }
      setFilteredRides(results)
      setIsLoading(false)
    }, 800)
  }

  const uniqueEvents = Array.from(new Set(rides.map((ride) => ride.eventName)))

  const handleRideSelect = (ride: any) => {
    setSelectedRide(ride)
    setShowMap(true)
  }

  const handleViewRoute = (ride: any) => {
    handleRideSelect(ride)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
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
                      info: `Departure: ${selectedRide.departureTime}`,
                    },
                    {
                      position: { lat: 28.6139, lng: 77.209 },
                      title: "Event: " + selectedRide.eventName,
                      info: `Start time: ${selectedRide.event.date}`,
                    },
                  ]}
                  showTraffic={true}
                  showRouteOptions={true}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {isFetching ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">Loading rides...</h3>
            <p className="text-gray-500 dark:text-gray-400">Please wait while we fetch the rides</p>
          </div>
        ) : (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredRides.length > 0 ? (
              filteredRides.map((ride) => (
                <motion.div
                  key={ride.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                >
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
        )}
      </main>
    </div>
  )
}
