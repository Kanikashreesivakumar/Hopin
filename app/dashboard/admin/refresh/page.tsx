"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Car, Check, RefreshCw, Ticket, Users } from "lucide-react"
import RoleNavbar from "@/components/role-navbar"

export default function RefreshPage() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [refreshStats, setRefreshStats] = useState({
    events: 0,
    rides: 0,
    users: 0,
  })

  const handleRefresh = () => {
    setIsRefreshing(true)

    // Simulate API call to refresh data
    setTimeout(() => {
      setIsRefreshing(false)
      setLastRefreshed(new Date())
      setShowSuccess(true)

      // Simulate updated stats
      setRefreshStats({
        events: Math.floor(Math.random() * 10) + 5,
        rides: Math.floor(Math.random() * 20) + 10,
        users: Math.floor(Math.random() * 15) + 5,
      })

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false)
      }, 3000)
    }, 2500)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <RoleNavbar role="admin" userName="Admin User" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Refresh Data</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sync your platform data with the latest information from the backend
            </p>
          </div>
        </div>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Alert className="bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200">
              <Check className="h-4 w-4 mr-2" />
              <AlertDescription>
                Data refreshed successfully! {refreshStats.events} events, {refreshStats.rides} rides, and{" "}
                {refreshStats.users} user records updated.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle>Refresh Platform Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">
                      <RefreshCw className={`h-16 w-16 text-hopin-orange ${isRefreshing ? "animate-spin" : ""}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Sync Your Platform</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                      Refresh your platform data to ensure all events, rides, and user information is up-to-date with
                      the latest changes from the backend.
                    </p>
                    <Button
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="bg-hopin-orange hover:bg-hopin-orange-dark text-white"
                      size="lg"
                    >
                      {isRefreshing ? (
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
                          Refreshing Data...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-5 w-5" />
                          Refresh All Data
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="bg-hopin-orange/10 p-3 rounded-full mr-3">
                          <Calendar className="h-6 w-6 text-hopin-orange" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Events</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto text-hopin-orange hover:bg-transparent hover:text-hopin-orange-dark"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                          >
                            Refresh Events
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="bg-hopin-orange/10 p-3 rounded-full mr-3">
                          <Car className="h-6 w-6 text-hopin-orange" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Rides</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto text-hopin-orange hover:bg-transparent hover:text-hopin-orange-dark"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                          >
                            Refresh Rides
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="p-4">
                      <div className="flex items-center">
                        <div className="bg-hopin-orange/10 p-3 rounded-full mr-3">
                          <Users className="h-6 w-6 text-hopin-orange" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">Users</div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-0 h-auto text-hopin-orange hover:bg-transparent hover:text-hopin-orange-dark"
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                          >
                            Refresh Users
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
                  <CardTitle>Refresh Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Last Refreshed</div>
                    <div className="text-lg">
                      {lastRefreshed
                        ? lastRefreshed.toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "Never"}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium mb-3">Data Status</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Ticket className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">Events</span>
                        </div>
                        <Badge
                          className={
                            lastRefreshed
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }
                        >
                          {lastRefreshed ? "Synced" : "Needs Sync"}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">Rides</span>
                        </div>
                        <Badge
                          className={
                            lastRefreshed
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }
                        >
                          {lastRefreshed ? "Synced" : "Needs Sync"}
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">Users</span>
                        </div>
                        <Badge
                          className={
                            lastRefreshed
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }
                        >
                          {lastRefreshed ? "Synced" : "Needs Sync"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium mb-3">Sync Schedule</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>Automatic sync is scheduled every 6 hours.</p>
                      <p className="mt-1">Next automatic sync: 6:00 PM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Refresh Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">🔄</span>
                      <span className="text-sm">Refresh data before generating reports for accuracy</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">⏱️</span>
                      <span className="text-sm">Syncing may take longer during peak hours</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">📊</span>
                      <span className="text-sm">You can refresh specific data types individually</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">🔔</span>
                      <span className="text-sm">Set up notifications for failed sync attempts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
