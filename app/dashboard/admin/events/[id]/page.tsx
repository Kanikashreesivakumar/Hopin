"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Car,
  ArrowLeft,
  Phone,
  Mail,
  Navigation
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import DynamicNavbar from "@/components/dynamic-navbar"

interface EventDetails {
  id: string
  title: string
  date: string
  time: string
  location: string
  attendees: number
  totalRides: number
  status: "upcoming" | "in-progress" | "completed"
  description: string
  organizer: {
    name: string
    email: string
    phone: string
    avatar?: string
  }
  drivers: Array<{
    id: string
    name: string
    avatar?: string
    phone: string
    assignedPassengers: number
    status: "available" | "en-route" | "arrived"
  }>
}

export default function EventDetailsPage() {
  const params = useParams()
  const [event, setEvent] = useState<EventDetails | null>(null)

  useEffect(() => {
    // Mock data - Replace with actual API call
    const mockEvent: EventDetails = {
      id: params.id as string,
      title: "Summer Music Festival",
      date: "June 15, 2023",
      time: "6:00 PM",
      location: "Central Park, New York",
      attendees: 320,
      totalRides: 45,
      status: "upcoming",
      description: "Annual summer music festival featuring local and international artists.",
      organizer: {
        name: "John Smith",
        email: "john.smith@example.com",
        phone: "+1 234 567 8900",
        avatar: "/placeholder.svg"
      },
      drivers: [
        {
          id: "1",
          name: "Alex Johnson",
          phone: "+1 234 567 8901",
          assignedPassengers: 3,
          status: "available"
        },
        {
          id: "2",
          name: "Sarah Miller",
          phone: "+1 234 567 8902",
          assignedPassengers: 4,
          status: "en-route"
        }
      ]
    }
    setEvent(mockEvent)
  }, [params.id])

  if (!event) return null

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <DynamicNavbar role="admin" userName="Admin User" />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-6">
            <Button
              variant="ghost"
              className="mb-4 text-hopin-orange hover:text-hopin-orange/90"
              asChild
            >
              <Link href="/dashboard/admin">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>

            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
                <div className="flex items-center text-gray-600 dark:text-gray-400 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{event.time}</span>
                  </div>
                  <Badge className={
                    event.status === "upcoming" 
                      ? "bg-blue-100 text-blue-700" 
                      : event.status === "in-progress"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }>
                    {event.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Event Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-2 text-hopin-orange" />
                      <div>
                        <div className="font-medium">Location</div>
                        <div className="text-gray-600 dark:text-gray-400">{event.location}</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Users className="h-5 w-5 mr-2 text-hopin-orange" />
                      <div>
                        <div className="font-medium">Attendees</div>
                        <div className="text-gray-600 dark:text-gray-400">{event.attendees} registered</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Car className="h-5 w-5 mr-2 text-hopin-orange" />
                      <div>
                        <div className="font-medium">Total Rides</div>
                        <div className="text-gray-600 dark:text-gray-400">{event.totalRides} rides arranged</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Assigned Drivers</h2>
                  <div className="space-y-4">
                    {event.drivers.map((driver) => (
                      <div
                        key={driver.id}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">
                              {driver.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{driver.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {driver.assignedPassengers} passengers assigned
                            </div>
                          </div>
                        </div>
                        <Badge className={
                          driver.status === "available"
                            ? "bg-green-100 text-green-700"
                            : driver.status === "en-route"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }>
                          {driver.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Organizer Contact</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12 mr-3">
                        <AvatarImage src={event.organizer.avatar} />
                        <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">
                          {event.organizer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{event.organizer.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Event Organizer</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4 mr-2" />
                        {event.organizer.phone}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4 mr-2" />
                        {event.organizer.email}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Button className="w-full bg-hopin-orange hover:bg-hopin-orange/90">
                    <Navigation className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}