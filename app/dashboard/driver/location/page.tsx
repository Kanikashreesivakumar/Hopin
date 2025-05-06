"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Car, Clock, MapPin, Phone, Share2 } from "lucide-react"
import { format } from "date-fns"
import Mapbox from "@/components/mapbox"

export default function ShareLocationPage() {
  const [isSharing, setIsSharing] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [activeRide, setActiveRide] = useState({
    id: "1",
    eventName: "Spring Music Festival",
    eventTime: "6:00 PM",
    departureTime: "5:30 PM",
    pickupLocation: "Student Union Building",
    pickupCoordinates: { lat: 28.6129, lng: 77.2295 },
    destinationCoordinates: { lat: 28.6139, lng: 77.209 },
    passengers: [
      { id: 1, name: "Sarah Miller", avatar: "/placeholder.svg?height=40&width=40", phone: "+91 98765 43210" },
      { id: 2, name: "John Davis", avatar: "/placeholder.svg?height=40&width=40", phone: "+91 98765 43211" },
      { id: 3, name: "Emily Chen", avatar: "/placeholder.svg?height=40&width=40", phone: "+91 98765 43212" },
    ],
  })

  // Get current location when sharing is enabled
  useEffect(() => {
    let watchId: number | null = null

    if (isSharing) {
      if (navigator.geolocation) {
        setLocationError(null)

        // Get initial position
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          (error) => {
            console.error("Error getting location:", error)
            setLocationError("Unable to access your location. Please check your browser permissions.")
            setIsSharing(false)
          },
        )

        // Watch position for real-time updates
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            setCurrentLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            })
          },
          (error) => {
            console.error("Error watching location:", error)
            setLocationError("Lost connection to your location services.")
            setIsSharing(false)
          },
        )
      } else {
        setLocationError("Geolocation is not supported by your browser.")
        setIsSharing(false)
      }
    }

    // Cleanup function to stop watching location
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [isSharing])

  const toggleLocationSharing = () => {
    setIsSharing(!isSharing)
  }

  const shareLocationLink = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "My Location for Spring Music Festival",
          text: "Track my location for the ride to Spring Music Festival",
          url: "https://hopin.app/track/123456",
        })
        .catch((error) => console.log("Error sharing", error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText("https://hopin.app/track/123456")
        .then(() => alert("Location link copied to clipboard!"))
        .catch((error) => console.error("Error copying text: ", error))
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Share Location</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Share your real-time location with passengers for easy pickup
            </p>
          </div>

          <Button
            onClick={shareLocationLink}
            className="mt-4 md:mt-0 bg-hopin-orange hover:bg-hopin-orange-dark text-white"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Location Link
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="mb-6">
              <CardHeader className="pb-0">
                <CardTitle>Your Location</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-4">
                  <Mapbox
                    height="400px"
                    showDirections={isSharing}
                    origin={currentLocation || undefined}
                    destination={activeRide.destinationCoordinates}
                    markers={(
                      [
                        currentLocation
                          ? {
                              position: currentLocation,
                              title: "Your Location",
                              info: "Current Position",
                            }
                          : null,
                        {
                          position: activeRide.pickupCoordinates,
                          title: "Pickup: " + activeRide.pickupLocation,
                          info: `Departure: ${activeRide.departureTime}`,
                        },
                        {
                          position: activeRide.destinationCoordinates,
                          title: "Event: " + activeRide.eventName,
                          info: `Start time: ${activeRide.eventTime}`,
                        },
                      ].filter((marker): marker is NonNullable<typeof marker> => marker !== null)
                    )}
                    currentLocation={isSharing ? currentLocation : null}
                    showTraffic={true}
                    zoom={14}
                  />
                </div>

                {locationError && (
                  <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg">
                    <p>{locationError}</p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={toggleLocationSharing}
                    className={`flex-1 ${
                      isSharing
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "bg-hopin-orange hover:bg-hopin-orange-dark text-white"
                    }`}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    {isSharing ? "Stop Sharing" : "Start Sharing Location"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-hopin-orange text-hopin-orange hover:bg-hopin-orange/10"
                    asChild
                  >
                    <Link href="/dashboard/driver/rides">
                      <Car className="mr-2 h-4 w-4" />
                      View My Rides
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Passenger List</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeRide.passengers.map((passenger) => (
                    <div
                      key={passenger.id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={passenger.avatar || "/placeholder.svg"} alt={passenger.name} />
                          <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">
                            {passenger.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{passenger.name}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{passenger.phone}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-hopin-orange"
                        onClick={() => window.open(`tel:${passenger.phone.replace(/\s+/g, "")}`)}
                      >
                        <Phone className="h-4 w-4" />
                        <span className="sr-only">Call {passenger.name}</span>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ride Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <CarIcon className="h-5 w-5 mr-2 text-hopin-orange" />
                      <div>
                        <div className="font-medium">{activeRide.eventName}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Event at {activeRide.eventTime}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <Clock className="h-5 w-5 mr-2 text-hopin-orange" />
                      <div>
                        <div className="font-medium">Departure Time</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{activeRide.departureTime}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2 text-hopin-orange" />
                      <div>
                        <div className="font-medium">Pickup Location</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{activeRide.pickupLocation}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <UsersIcon className="h-5 w-5 mr-2 text-hopin-orange" />
                      <div>
                        <div className="font-medium">Passengers</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {activeRide.passengers.length} passengers
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Sharing Status</span>
                      <Badge
                        className={
                          isSharing
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                        }
                      >
                        {isSharing ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {isSharing && currentLocation && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        <div>Latitude: {currentLocation.lat.toFixed(6)}</div>
                        <div>Longitude: {currentLocation.lng.toFixed(6)}</div>
                        <div>Last updated: {format(new Date(), "h:mm:ss a")}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sharing Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">🔋</span>
                      <span className="text-sm">Keep your device charged while sharing location</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">📱</span>
                      <span className="text-sm">Keep the app open for the most accurate tracking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">🔔</span>
                      <span className="text-sm">Enable notifications to receive passenger messages</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">🚗</span>
                      <span className="text-sm">Stop sharing when you've completed the ride</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start border-hopin-orange text-hopin-orange hover:bg-hopin-orange/10"
                      onClick={shareLocationLink}
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share Location Link
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-hopin-orange text-hopin-orange hover:bg-hopin-orange/10"
                      asChild
                    >
                      <Link href="/dashboard/driver/alerts">
                        <BellIcon className="mr-2 h-4 w-4" />
                        View Pickup Alerts
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-hopin-orange text-hopin-orange hover:bg-hopin-orange/10"
                      asChild
                    >
                      <Link href="/dashboard/driver/calculator">
                        <CalculatorIcon className="mr-2 h-4 w-4" />
                        Cost Calculator
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

function CarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="17" height="12" x="3" y="8" rx="2" ry="2" />
      <path d="M7 21h10" />
      <path d="M12 3h0" />
    </svg>
  )
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

function CalculatorIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  )
}
