"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Calendar, Car, ChevronRight, Clock, MapPin, Plus, Star, LogOut } from "lucide-react"
import DynamicNavbar from "@/components/dynamic-navbar"
import { useAuth } from "@/hooks/AuthContext";
import { useRouter } from "next/navigation";

export default function DriverDashboard() {
  const [userName] = useState("Alex Johnson")
  const [userAvatar] = useState("/placeholder.svg?height=64&width=64")
  const { logout } = useAuth();
  const router = useRouter ? useRouter() : null;

  // Sample upcoming rides data
  const upcomingRides = [
    {
      id: 1,
      eventName: "Summer Music Festival",
      date: "June 15, 2023",
      time: "4:30 PM",
      pickupLocation: "Central Station",
      passengers: 2,
      maxPassengers: 4,
      earnings: 350,
    },
    {
      id: 2,
      eventName: "Tech Conference 2023",
      date: "July 10, 2023",
      time: "8:30 AM",
      pickupLocation: "University Campus",
      passengers: 3,
      maxPassengers: 3,
      earnings: 450,
    },
  ]

  // Sample ride requests data
  const rideRequests = [
    {
      id: 1,
      userName: "Sarah Miller",
      userRating: 4.8,
      eventName: "Summer Music Festival",
      pickupLocation: "Downtown Plaza",
    },
    {
      id: 2,
      userName: "Mike Chen",
      userRating: 4.9,
      eventName: "Summer Music Festival",
      pickupLocation: "West End Avenue",
    },
  ]

  // Sample earnings data
  const earningsData = {
    today: 0,
    thisWeek: 800,
    thisMonth: 2400,
    total: 12500,
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <DynamicNavbar role="driver" userName={userName} userAvatar={userAvatar} />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Driver Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Welcome back, {userName}!</p>
          </div>

          <Button asChild className="hopin-button mt-4 md:mt-0">
            <Link href="/dashboard/driver/offer-ride">
              <Plus className="mr-2 h-4 w-4" />
              Offer a Ride
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
                <h2 className="text-xl font-semibold">Your Upcoming Rides</h2>
                <Link
                  href="/dashboard/driver/rides"
                  className="text-hopin-orange hover:underline text-sm flex items-center"
                >
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              {upcomingRides.length > 0 ? (
                <div className="space-y-4">
                  {upcomingRides.map((ride) => (
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
                        <Badge className="bg-hopin-orange text-white">₹{ride.earnings}</Badge>
                      </div>

                      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-1 text-gray-500 dark:text-gray-400" />
                          <span>{ride.pickupLocation}</span>
                        </div>

                        <div className="flex items-center">
                          <div className="flex -space-x-2 mr-2">
                            {Array.from({ length: ride.passengers }).map((_, i) => (
                              <Avatar key={i} className="h-6 w-6 border-2 border-white dark:border-gray-800">
                                <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange text-xs">
                                  U
                                </AvatarFallback>
                              </Avatar>
                            ))}
                            {Array.from({ length: ride.maxPassengers - ride.passengers }).map((_, i) => (
                              <Avatar key={i} className="h-6 w-6 border-2 border-white dark:border-gray-800">
                                <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-xs">
                                  +
                                </AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {ride.passengers}/{ride.maxPassengers} passengers
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <Car className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No upcoming rides</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">You don't have any upcoming rides scheduled.</p>
                  <Button asChild className="hopin-button">
                    <Link href="/dashboard/driver/offer-ride">
                      <Plus className="mr-2 h-4 w-4" />
                      Offer a Ride
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
                <h2 className="text-xl font-semibold">Earnings</h2>
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Active</Badge>
              </div>

              <div className="bg-hopin-orange/10 rounded-lg p-4 mb-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</div>
                <div className="text-3xl font-bold text-hopin-orange">₹ {earningsData.total.toLocaleString()}</div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">Today</div>
                  <div className="font-semibold">₹ {earningsData.today.toLocaleString()}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">This Week</div>
                  <div className="font-semibold">₹ {earningsData.thisWeek.toLocaleString()}</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">This Month</div>
                  <div className="font-semibold">₹ {earningsData.thisMonth.toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-hopin-gray/20 dark:border-hopin-gray/10">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-hopin-orange text-hopin-orange hover:bg-hopin-orange/10"
                >
                  <Link href="/dashboard/driver/earnings">View Earnings History</Link>
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
              <h2 className="text-xl font-semibold">Ride Requests</h2>
              {rideRequests.length > 0 && (
                <Badge className="bg-hopin-orange text-white">{rideRequests.length} New</Badge>
              )}
            </div>

            {rideRequests.length > 0 ? (
              <div className="space-y-4">
                {rideRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-hopin-gray/20 dark:border-hopin-gray/10 rounded-lg p-4 hover:border-hopin-orange/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">
                            {request.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{request.userName}</h3>
                          <div className="flex items-center text-sm">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="ml-1">{request.userRating}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">New</Badge>
                    </div>

                    <div className="mt-4 pl-12">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Event:</span> {request.eventName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Pickup:</span> {request.pickupLocation}
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        variant="outline"
                        className="border-red-300 text-red-500 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        Decline
                      </Button>
                      <Button className="hopin-button">Accept</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No ride requests</h3>
                <p className="text-gray-500 dark:text-gray-400">You don't have any pending ride requests.</p>
              </div>
            )}
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
              <h2 className="text-xl font-semibold">Driver Stats</h2>
              <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Good Standing
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-hopin-orange/10 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                <div className="text-xl font-bold text-hopin-orange flex items-center justify-center">
                  4.9
                  <Star className="h-4 w-4 ml-1 text-yellow-500 fill-current" />
                </div>
              </div>

              <div className="bg-hopin-orange/10 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">Rides</div>
                <div className="text-xl font-bold text-hopin-orange">42</div>
              </div>

              <div className="bg-hopin-orange/10 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">Passengers</div>
                <div className="text-xl font-bold text-hopin-orange">128</div>
              </div>

              <div className="bg-hopin-orange/10 rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">Distance</div>
                <div className="text-xl font-bold text-hopin-orange">1,240 km</div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="mt-8 flex justify-end">
          <Button
            variant="outline"
            className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => {
              logout && logout();
              if (router) router.push("/auth");
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Log Out
          </Button>
        </div>
      </main>
    </div>
  )
}
