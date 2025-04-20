"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Phone } from "lucide-react"
import PageHeader from "@/components/page-header"
import Mapbox from "@/components/mapbox"

export default function TrackRide() {
  const currentRide = {
    id: 1,
    driverName: "Alex Johnson",
    driverRating: 4.8,
    driverPhone: "(555) 123-4567",
    eventName: "Spring Music Festival",
    eventDate: "2025-04-15T18:00:00",
    pickupPoint: "Student Union Building",
    pickupCoordinates: { lat: 28.6129, lng: 77.2295 },
    destinationCoordinates: { lat: 28.6139, lng: 77.209 },
    eta: "10 minutes",
    status: "On the way",
    carModel: "Honda Civic",
    licensePlate: "ABC 123",
    departureTime: "5:30 PM",
  }

  const [driverLocation, setDriverLocation] = useState(currentRide.pickupCoordinates)

  // Simulate driver movement
  useEffect(() => {
    const interval = setInterval(() => {
      setDriverLocation((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title="Track Your Ride" description="Follow your driver's location in real-time" icon="🌐" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70 border border-gray-100 dark:border-gray-700">
            <Mapbox
              height="400px"
              showDirections={true}
              origin={driverLocation}
              destination={currentRide.destinationCoordinates}
              markers={[
                {
                  position: currentRide.pickupCoordinates,
                  title: "Pickup: " + currentRide.pickupPoint,
                  info: `Departure: ${currentRide.departureTime}`,
                },
                {
                  position: currentRide.destinationCoordinates,
                  title: "Event: " + currentRide.eventName,
                  info: `Venue`,
                },
              ]}
              currentLocation={driverLocation}
              showTraffic={true}
              zoom={14}
            />

            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                  >
                    {currentRide.status}
                  </Badge>
                  <span className="text-sm text-gray-500 dark:text-gray-400">ETA: {currentRide.eta}</span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 dark:text-green-400 border-green-200 dark:border-green-800"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-16 w-16 border-2 border-green-500">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" alt={currentRide.driverName} />
                  <AvatarFallback>
                    {currentRide.driverName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{currentRide.driverName}</h3>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(currentRide.driverRating) ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">{currentRide.driverRating}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Event</h4>
                  <p className="font-medium">{currentRide.eventName}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pickup Location</h4>
                  <p className="font-medium">{currentRide.pickupPoint}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Departure Time</h4>
                  <p className="font-medium">{currentRide.departureTime}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Vehicle</h4>
                  <p className="font-medium">
                    {currentRide.carModel} • {currentRide.licensePlate}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  I've Been Picked Up
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
