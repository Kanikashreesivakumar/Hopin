"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Calendar, Car, Check, Clock, MapPin, Phone, Star, X, User } from "lucide-react"
import { format } from "date-fns"
import RoleNavbar from "@/components/role-navbar"

// Mock data for pickup alerts
const mockAlerts = [
  {
    id: "1",
    type: "pickup_request",
    passenger: {
      id: 1,
      name: "Sarah Miller",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.8,
      phone: "+91 98765 43210",
    },
    eventName: "Spring Music Festival",
    eventDate: "2025-04-15T18:00:00",
    departureTime: "2025-04-15T17:00:00",
    pickupLocation: "Student Union Building",
    status: "pending",
    timestamp: "2025-04-14T10:30:00",
  },
  {
    id: "2",
    type: "pickup_request",
    passenger: {
      id: 2,
      name: "John Davis",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.6,
      phone: "+91 98765 43211",
    },
    eventName: "Spring Music Festival",
    eventDate: "2025-04-15T18:00:00",
    departureTime: "2025-04-15T17:00:00",
    pickupLocation: "Student Union Building",
    status: "pending",
    timestamp: "2025-04-14T11:15:00",
  },
  {
    id: "3",
    type: "pickup_reminder",
    eventName: "Tech Conference 2023",
    eventDate: "2025-04-20T19:30:00",
    departureTime: "2025-04-20T18:30:00",
    pickupLocation: "North Campus Parking",
    passengerCount: 3,
    status: "upcoming",
    timestamp: "2025-04-19T18:30:00",
  },
  {
    id: "4",
    type: "pickup_request",
    passenger: {
      id: 3,
      name: "Emily Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.9,
      phone: "+91 98765 43212",
    },
    eventName: "Tech Conference 2023",
    eventDate: "2025-04-20T19:30:00",
    departureTime: "2025-04-20T18:30:00",
    pickupLocation: "North Campus Parking",
    status: "accepted",
    timestamp: "2025-04-18T14:45:00",
  },
  {
    id: "5",
    type: "pickup_request",
    passenger: {
      id: 4,
      name: "Michael Brown",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4.7,
      phone: "+91 98765 43213",
    },
    eventName: "Tech Conference 2023",
    eventDate: "2025-04-20T19:30:00",
    departureTime: "2025-04-20T18:30:00",
    pickupLocation: "North Campus Parking",
    status: "declined",
    timestamp: "2025-04-18T15:20:00",
  },
]

export default function PickupAlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts)

  const handleAcceptRequest = (alertId: string) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "accepted" } : alert)))
  }

  const handleDeclineRequest = (alertId: string) => {
    setAlerts(alerts.map((alert) => (alert.id === alertId ? { ...alert, status: "declined" } : alert)))
  }

  const handleDismissAlert = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== alertId))
  }

  const pendingRequests = alerts.filter((alert) => alert.type === "pickup_request" && alert.status === "pending")

  const upcomingReminders = alerts.filter((alert) => alert.type === "pickup_reminder" && alert.status === "upcoming")

  const pastAlerts = alerts.filter((alert) => alert.status === "accepted" || alert.status === "declined")

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <RoleNavbar role="driver" userName="Alex Johnson" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pickup Alerts</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your ride requests and pickup reminders</p>
          </div>

          <Button asChild className="mt-4 md:mt-0 bg-hopin-orange hover:bg-hopin-orange-dark text-white">
            <Link href="/dashboard/driver/rides">
              <Car className="mr-2 h-4 w-4" />
              View All Rides
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-hopin-orange" />
                  Pending Requests
                  {pendingRequests.length > 0 && (
                    <Badge className="ml-2 bg-hopin-orange text-white">{pendingRequests.length}</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pendingRequests.length > 0 ? (
                  <div className="space-y-4">
                    {pendingRequests.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-hopin-orange/20 rounded-lg p-4 bg-hopin-orange/5"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage
                                src={alert.passenger?.avatar || "/placeholder.svg"}
                                alt={alert.passenger?.name || "Unknown Passenger"}
                              />
                              <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">
                                {alert.passenger?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{alert.passenger?.name}</div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                <span>{alert.passenger?.rating}</span>
                              </div>
                            </div>
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                            New Request
                          </Badge>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{alert.eventName}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Departure: {format(new Date(alert.departureTime), "h:mm a")}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{alert.pickupLocation}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-300 text-red-500 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                            onClick={() => handleDeclineRequest(alert.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                          <Button
                            size="sm"
                            className="bg-hopin-orange hover:bg-hopin-orange-dark text-white"
                            onClick={() => handleAcceptRequest(alert.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 inline-block mb-4">
                      <Bell className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No pending requests</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      You don't have any pending pickup requests at the moment
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Pickups</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingReminders.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingReminders.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-900/10"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{alert.eventName}</h3>
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              <span>{format(new Date(alert.eventDate), "MMM d, yyyy")}</span>
                            </div>
                          </div>
                          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Reminder
                          </Badge>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Departure: {format(new Date(alert.departureTime), "h:mm a")}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{alert.pickupLocation}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Users className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{alert.passengerCount} passengers</span>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                          <Button size="sm" className="bg-hopin-orange hover:bg-hopin-orange-dark text-white" asChild>
                            <Link href="/dashboard/driver/location">
                              <MapPin className="h-4 w-4 mr-1" />
                              Share Location
                            </Link>
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 inline-block mb-4">
                      <Car className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No upcoming pickups</h3>
                    <p className="text-gray-500 dark:text-gray-400">You don't have any upcoming pickups scheduled</p>
                  </div>
                )}
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
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {pastAlerts.length > 0 ? (
                    <div className="space-y-4">
                      {pastAlerts.slice(0, 5).map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                        >
                          <div className="flex items-center">
                            {alert.type === "pickup_request" && (
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage
                                  src={alert.passenger?.avatar || "/placeholder.svg"}
                                  alt={alert.passenger?.name}
                                />
                                <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">
                                  {alert.passenger?.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <div className="text-sm font-medium">
                                {alert.type === "pickup_request" ? alert.passenger?.name : alert.eventName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {format(new Date(alert.timestamp), "MMM d, h:mm a")}
                              </div>
                            </div>
                          </div>
                          <Badge
                            className={
                              alert.status === "accepted"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            }
                          >
                            {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-gray-500 dark:text-gray-400">No recent activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Bell className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">Pickup Requests</span>
                      </div>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-hopin-orange">
                        <span className="absolute h-4 w-4 rounded-full bg-white transition-transform translate-x-6"></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">Departure Reminders</span>
                      </div>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-hopin-orange">
                        <span className="absolute h-4 w-4 rounded-full bg-white transition-transform translate-x-6"></span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="text-sm">SMS Notifications</span>
                      </div>
                      <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700">
                        <span className="absolute h-4 w-4 rounded-full bg-white transition-transform translate-x-1"></span>
                      </div>
                    </div>
                  </div>
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
                      asChild
                    >
                      <Link href="/dashboard/driver/rides">
                        <Car className="mr-2 h-4 w-4" />
                        View All Rides
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-hopin-orange text-hopin-orange hover:bg-hopin-orange/10"
                      asChild
                    >
                      <Link href="/dashboard/driver/location">
                        <MapPin className="mr-2 h-4 w-4" />
                        Share Location
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-hopin-orange text-hopin-orange hover:bg-hopin-orange/10"
                      asChild
                    >
                      <Link href="/dashboard/driver/profile">
                        <User className="mr-2 h-4 w-4" />
                        Edit Profile
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

function Users(props: React.SVGProps<SVGSVGElement>) {
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
