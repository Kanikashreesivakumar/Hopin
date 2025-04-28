"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Car, ChevronRight, Clock, MapPin, Search, Star, Ticket, User } from "lucide-react"
import DynamicNavbar from "@/components/dynamic-navbar"
import { toast } from "@/components/ui/use-toast"

interface Ride {
  id: number;
  eventName: string;
  date: string;
  time: string;
  driverName: string;
  driverRating: number;
  pickupLocation: string;
  cost: number;
  status: string;
}

export default function PassengerDashboard() {
  const [userName] = useState("Emma Wilson")
  const [userAvatar] = useState("/placeholder.svg?height=64&width=64")

  // Sample upcoming events data
  const upcomingEvents = [
    {
      id: 1,
      title: "Summer Music Festival",
      date: "June 15, 2023",
      time: "6:00 PM",
      location: "Central Park",
      image: "/placeholder.svg?height=200&width=300",
      ridesAvailable: 12,
    },
    {
      id: 2,
      title: "Tech Conference 2023",
      date: "July 10, 2023",
      time: "9:00 AM",
      location: "Convention Center",
      image: "/placeholder.svg?height=200&width=300",
      ridesAvailable: 8,
    },
    {
      id: 3,
      title: "Food & Wine Expo",
      date: "August 5, 2023",
      time: "11:00 AM",
      location: "Downtown Plaza",
      image: "/placeholder.svg?height=200&width=300",
      ridesAvailable: 5,
    },
  ]

  // Sample booked rides data
  const bookedRides: Ride[] = [
    {
      id: 1,
      eventName: "Summer Music Festival",
      date: "June 15, 2023",
      time: "4:30 PM",
      driverName: "Alex Johnson",
      driverRating: 4.9,
      pickupLocation: "Central Station",
      cost: 120,
      status: "confirmed",
    },
  ]

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCancelRide = async (rideId: number) => {
    try {
      setIsLoading(true);
      // Add your API call here
      const response = await fetch(`/api/rides/${rideId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to cancel ride');

      // Refresh the rides list
      // Add your refresh logic here

      toast({
        title: "Ride Cancelled",
        description: "Your ride has been cancelled successfully.",
        variant: "default",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel ride. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <DynamicNavbar role="passenger" userName={userName} userAvatar={userAvatar} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Passenger Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back, {userName}!</p>
          </div>

          <Button asChild className="hopin-button mt-4 md:mt-0">
            <Link href="/dashboard/passenger/find">
              <Search className="mr-2 h-4 w-4" />
              Find a Ride
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:col-span-2"
          >
            <Card className="hopin-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Booked Rides</h2>
                <Link
                  href="/dashboard/passenger/rides"
                  className="text-hopin-orange hover:underline text-sm flex items-center"
                >
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {bookedRides.length > 0 ? (
                <div className="space-y-4">
                  {bookedRides.map((ride) => (
                    <div
                      key={ride.id}
                      className="border border-hopin-gray/20 dark:border-hopin-gray/10 rounded-lg p-4 hover:border-hopin-orange/50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{ride.eventName}</h3>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{ride.date}</span>
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{ride.time}</span>
                          </div>
                        </div>
                        <Badge
                          className={
                            ride.status === "confirmed"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }
                        >
                          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">
                              {ride.driverName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="text-sm font-medium">{ride.driverName}</div>
                            <div className="flex items-center text-xs">
                              <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                              <span>{ride.driverRating}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                          <span>{ride.pickupLocation}</span>
                          <span className="mx-2">•</span>
                          <span className="font-medium text-hopin-orange">₹{ride.cost}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          className="text-hopin-orange border-hopin-orange hover:bg-hopin-orange/10"
                          onClick={() => {
                            // Add any pre-navigation logic here
                            router.push(`/dashboard/passenger/rides/${ride.id}`);
                          }}
                          disabled={ride.status === 'cancelled'}
                        >
                          View Details
                        </Button>
                        {ride.status === 'confirmed' && (
                          <Button 
                            variant="destructive"
                            className="bg-red-500 hover:bg-red-600"
                            onClick={() => handleCancelRide(ride.id)}
                          >
                            Cancel Ride
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No booked rides</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any upcoming rides booked.</p>
                  <Button asChild className="hopin-button">
                    <Link href="/dashboard/passenger/find">
                      <Search className="mr-2 h-4 w-4" />
                      Find a Ride
                    </Link>
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="hopin-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Stats</h2>
                <Badge className="bg-hopin-orange text-white">Active</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-hopin-orange/10 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rides Taken</div>
                  <div className="text-2xl font-bold text-hopin-orange">12</div>
                </div>

                <div className="bg-hopin-orange/10 rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Money Saved</div>
                  <div className="text-2xl font-bold text-hopin-orange">₹ 1,450</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                  <div className="font-semibold flex items-center">
                    4.8
                    <Star className="h-4 w-4 ml-1 text-yellow-500 fill-current" />
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">CO₂ Saved</div>
                  <div className="font-semibold">24 kg</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Distance Traveled</div>
                  <div className="font-semibold">320 km</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-hopin-gray/20 dark:border-hopin-gray/10">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-hopin-orange text-hopin-orange hover:bg-hopin-orange/10"
                >
                  <Link href="/dashboard/passenger/profile">View Full Profile</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="hopin-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
              <Link
                href="/dashboard/passenger/events"
                className="text-hopin-orange hover:underline text-sm flex items-center"
              >
                View All
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-hopin-gray/20 dark:border-hopin-gray/10 rounded-lg overflow-hidden hover:border-hopin-orange/50 transition-colors"
                >
                  <div className="h-32 relative">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-hopin-orange text-white">{event.ridesAvailable} rides</Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{event.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{event.location}</span>
                    </div>

                    <Button asChild className="w-full hopin-button">
                      <Link href={`/dashboard/passenger/find?event=${event.id}`}>Find Ride</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="hopin-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                asChild
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center border-hopin-gray/30 hover:border-hopin-orange hover:bg-hopin-orange/5"
              >
                <Link href="/dashboard/passenger/find">
                  <Search className="h-6 w-6 mb-2 text-hopin-orange" />
                  <span>Find a Ride</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center border-hopin-gray/30 hover:border-hopin-orange hover:bg-hopin-orange/5"
              >
                <Link href="/dashboard/passenger/events">
                  <Ticket className="h-6 w-6 mb-2 text-hopin-orange" />
                  <span>Browse Events</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center border-hopin-gray/30 hover:border-hopin-orange hover:bg-hopin-orange/5"
              >
                <Link href="/dashboard/passenger/calculator">
                  <Calculator className="h-6 w-6 mb-2 text-hopin-orange" />
                  <span>Cost Calculator</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center border-hopin-gray/30 hover:border-hopin-orange hover:bg-hopin-orange/5"
              >
                <Link href="/dashboard/passenger/profile">
                  <User className="h-6 w-6 mb-2 text-hopin-orange" />
                  <span>My Profile</span>
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}

// Calculator icon component
function Calculator(props: React.SVGProps<SVGSVGElement>) {
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
