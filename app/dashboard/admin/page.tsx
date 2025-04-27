"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  BarChart3,
  Calendar,
  Car,
  ChevronRight,
  Clock,
  Download,
  Loader2,  // Add this
  MapPin,
  Plus,
  RefreshCw,
  Settings,
  Ticket,
  Users,
} from "lucide-react"
import DynamicNavbar from "@/components/dynamic-navbar"
import { generateEventDescription } from "@/utils/gemini"
import AnalyticsChart from "@/components/analytics-chart"
import { exportAnalytics } from "@/utils/exportAnalytics";
import { useToast } from "@/components/ui/use-toast";

export default function AdminDashboard() {
  const [userName] = useState("Admin User")
  const [userAvatar] = useState("/placeholder.svg?height=64&width=64")

  const [isLoading, setIsLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const platformStats = {
    totalUsers: 1248,
    totalRides: 856,
    totalEvents: 42,
    activeRides: 18,
  }

  
  const upcomingEvents = [
    {
      id: 1,
      title: "Summer Music Festival",
      date: "June 15, 2023",
      time: "6:00 PM",
      location: "Central Park",
      attendees: 320,
      rides: 45,
    },
    {
      id: 2,
      title: "Tech Conference 2023",
      date: "July 10, 2023",
      time: "9:00 AM",
      location: "Convention Center",
      attendees: 180,
      rides: 28,
    },
  ]

  // Sample recent rides data
  const recentRides = [
    {
      id: 1,
      driverName: "Alex Johnson",
      passengerCount: 3,
      eventName: "Spring Concert",
      date: "May 28, 2023",
      status: "completed",
    },
    {
      id: 2,
      driverName: "Sarah Miller",
      passengerCount: 2,
      eventName: "Tech Meetup",
      date: "May 27, 2023",
      status: "completed",
    },
    {
      id: 3,
      driverName: "Mike Chen",
      passengerCount: 4,
      eventName: "Summer Music Festival",
      date: "June 15, 2023",
      status: "upcoming",
    },
  ]

  const handleGenerateDescription = async (event: any) => {
    try {
      setIsLoading(true); 
      const description = await generateEventDescription({
        title: event.title,
        type: event.type || 'Event', 
        location: event.location
      });
      
      if (description) {
        
        console.log("Generated description:", description);
      
      }
    } catch (error) {
      console.error("Error:", error);
      
    } finally {
      setIsLoading(false);
    }
  }

  const { toast } = useToast();
  const [timeFrame, setTimeFrame] = useState("year");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAnalytics(timeFrame);
      toast({
        title: "Export Successful",
        description: "Analytics data has been downloaded",
        variant: "default",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error instanceof Error ? error.message : "Failed to export analytics data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <DynamicNavbar role="admin" userName={userName} userAvatar={userAvatar} />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">Platform overview and management</p>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" className="border-hopin-gray/30">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button asChild className="hopin-button">
              <Link href="/dashboard/admin/add-events">
                <Plus className="mr-2 h-4 w-4" />
                Add Event
              </Link>
            </Button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="hopin-card">
              <div className="flex items-center">
                <div className="bg-hopin-orange/10 p-4 rounded-full mr-4">
                  <Users className="h-6 w-6 text-hopin-orange" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
                  <div className="text-2xl font-bold">{platformStats.totalUsers}</div>
                </div>
              </div>
            </Card>

            <Card className="hopin-card">
              <div className="flex items-center">
                <div className="bg-hopin-orange/10 p-4 rounded-full mr-4">
                  <Car className="h-6 w-6 text-hopin-orange" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Rides</div>
                  <div className="text-2xl font-bold">{platformStats.totalRides}</div>
                </div>
              </div>
            </Card>

            <Card className="hopin-card">
              <div className="flex items-center">
                <div className="bg-hopin-orange/10 p-4 rounded-full mr-4">
                  <Ticket className="h-6 w-6 text-hopin-orange" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
                  <div className="text-2xl font-bold">{platformStats.totalEvents}</div>
                </div>
              </div>
            </Card>

            <Card className="hopin-card">
              <div className="flex items-center">
                <div className="bg-hopin-orange/10 p-4 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-hopin-orange" />
                </div>
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Rides</div>
                  <div className="text-2xl font-bold">{platformStats.activeRides}</div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="hopin-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Upcoming Events</h2>
                <Link
                  href="/dashboard/admin/manage-events"
                  className="text-hopin-orange hover:underline text-sm flex items-center"
                >
                  Manage Events
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="border border-hopin-gray/20 dark:border-hopin-gray/10 rounded-lg p-4 hover:border-hopin-orange/50 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{event.date}</span>
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{event.time}</span>
                        </div>
                      </div>
                      <Badge className="bg-hopin-orange text-white">{event.rides} rides</Badge>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end gap-2">
                      <Button variant="outline" className="border-hopin-gray/30">
                        Edit
                      </Button>
                      <Button asChild className="hopin-button">
                        <Link href={`/dashboard/admin/events/${event.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-center">
                <Button asChild className="hopin-button">
                  <Link href="/dashboard/admin/add-events">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Event
                  </Link>
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card className="hopin-card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Recent Rides</h2>
                <Link
                  href="/dashboard/admin/rides"
                  className="text-hopin-orange hover:underline text-sm flex items-center"
                >
                  View All
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <div className="space-y-4">
                {recentRides.map((ride) => (
                  <div
                    key={ride.id}
                    className="flex items-center justify-between p-3 border border-hopin-gray/20 dark:border-hopin-gray/10 rounded-lg hover:border-hopin-orange/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">
                          {ride.driverName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm">{ride.driverName}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{ride.eventName}</div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="text-xs text-gray-500 dark:text-gray-400 mr-3 text-right">
                        <div>{ride.date}</div>
                        <div>{ride.passengerCount} passengers</div>
                      </div>
                      <Badge
                        className={
                          ride.status === "completed"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        }
                      >
                        {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-hopin-gray/20 dark:border-hopin-gray/10">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-hopin-orange text-hopin-orange hover:bg-hopin-orange/10"
                >
                  <Link href="/dashboard/admin/rides">View All Rides</Link>
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="hopin-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Platform Analytics</h2>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-hopin-gray/30"
                onClick={handleExport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <select 
                className="bg-transparent border border-hopin-gray/30 rounded-md px-3 py-1 text-sm"
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value)}
              >
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
                <option value="year">Last Year</option>
              </select>
            </div>

            <div className="h-64 rounded-lg mb-6">
              <AnalyticsChart />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-hopin-orange/10 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">New Users</div>
                <div className="text-xl font-bold text-hopin-orange">+24%</div>
              </div>

              <div className="bg-hopin-orange/10 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">Ride Bookings</div>
                <div className="text-xl font-bold text-hopin-orange">+18%</div>
              </div>

              <div className="bg-hopin-orange/10 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">Event Growth</div>
                <div className="text-xl font-bold text-hopin-orange">+32%</div>
              </div>

              <div className="bg-hopin-orange/10 rounded-lg p-3 text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">Revenue</div>
                <div className="text-xl font-bold text-hopin-orange">+41%</div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
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
                <Link href="/dashboard/admin/add-events">
                  <Plus className="h-6 w-6 mb-2 text-hopin-orange" />
                  <span>Add Event</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center border-hopin-gray/30 hover:border-hopin-orange hover:bg-hopin-orange/5"
              >
                <Link href="/dashboard/admin/manage-events">
                  <Calendar className="h-6 w-6 mb-2 text-hopin-orange" />
                  <span>Manage Events</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center border-hopin-gray/30 hover:border-hopin-orange hover:bg-hopin-orange/5"
              >
                <Link href="/dashboard/admin/rides">
                  <Car className="h-6 w-6 mb-2 text-hopin-orange" />
                  <span>View Rides</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto py-6 flex flex-col items-center justify-center border-hopin-gray/30 hover:border-hopin-orange hover:bg-hopin-orange/5"
              >
                <Link href="/dashboard/admin/settings">
                  <Settings className="h-6 w-6 mb-2 text-hopin-orange" />
                  <span>Platform Settings</span>
                </Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
