"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Filter, MapPin, Search, Users } from "lucide-react"
import { format } from "date-fns"
import RoleNavbar from "@/components/role-navbar"

const mockEvents = [
  {
    id: 1,
    title: "Spring Music Festival",
    date: "2025-04-15T18:00:00",
    location: "Student Union Building",
    description: "Annual music festival featuring student bands and performers.",
    attendees: 120,
    ridesAvailable: 12,
    image: "/music.jpg?height=200&width=400",
  },
  {
    id: 2,
    title: "Basketball Championship",
    date: "2025-04-20T19:30:00",
    location: "University Sports Center",
    description: "Final match of the inter-college basketball tournament.",
    attendees: 85,
    ridesAvailable: 8,
    image: "/music.jpg?height=200&width=400",
  },
  {
    id: 3,
    title: "Career Fair",
    date: "2025-04-22T10:00:00",
    location: "Engineering Building",
    description: "Connect with potential employers and explore career opportunities.",
    attendees: 200,
    ridesAvailable: 15,
    image: "/music.jpg?height=200&width=400",
  },
  {
    id: 4,
    title: "Hackathon 2025",
    date: "2025-04-25T08:00:00",
    location: "Computer Science Building",
    description: "24-hour coding competition with prizes for the best projects.",
    attendees: 75,
    ridesAvailable: 5,
    image: "/music.jpg?height=200&width=400",
  },
  {
    id: 5,
    title: "Alumni Networking",
    date: "2025-04-28T17:00:00",
    location: "Business School Atrium",
    description: "Network with successful alumni and learn from their experiences.",
    attendees: 50,
    ridesAvailable: 6,
    image: "/music.jpg?height=200&width=400",
  },
]

export default function ViewEventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEvents, setFilteredEvents] = useState(mockEvents)
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = () => {
    setIsLoading(true)

  
    setTimeout(() => {
      const results = mockEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredEvents(results)
      setIsLoading(false)
    }, 500)
  }

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

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <RoleNavbar role="passenger" userName="Emma Wilson" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Upcoming Events</h1>
            <p className="text-gray-600 dark:text-gray-400">Browse events and find rides to attend</p>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-hopin-orange hover:bg-hopin-orange-dark text-white"
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
                    Search
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <motion.div key={event.id} variants={item}>
                <Card className="overflow-hidden h-full border border-gray-200 dark:border-gray-700 hover:border-hopin-orange/50 transition-colors">
                  <div className="h-48 relative">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-hopin-orange text-white">{event.ridesAvailable} rides available</Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{format(new Date(event.date), "EEEE, MMMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{format(new Date(event.date), "h:mm a")}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        <span>{event.attendees} attendees</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 border-hopin-orange text-hopin-orange hover:bg-hopin-orange/10"
                        asChild
                      >
                        <Link href={`/dashboard/passenger/events/${event.id}`}>View Details</Link>
                      </Button>
                      <Button className="flex-1 bg-hopin-orange hover:bg-hopin-orange-dark text-white" asChild>
                        <Link href={`/dashboard/passenger/find?event=${event.id}`}>Find Rides</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
