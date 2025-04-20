"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Edit, MapPin, MoreHorizontal, Plus, Search, Trash2, Users } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import PageHeader from "@/components/page-header"

// Mock data for events
const initialEvents = [
  {
    id: "1",
    name: "Spring Music Festival",
    date: "2025-04-15T18:00:00",
    location: "Student Union Building",
    description: "Annual music festival featuring student bands and performers.",
    attendees: 120,
    image: "/placeholder.svg?height=200&width=400",
    status: "upcoming",
  },
  {
    id: "2",
    name: "Basketball Championship",
    date: "2025-04-20T19:30:00",
    location: "University Sports Center",
    description: "Final match of the inter-college basketball tournament.",
    attendees: 85,
    image: "/placeholder.svg?height=200&width=400",
    status: "upcoming",
  },
  {
    id: "3",
    name: "Career Fair",
    date: "2025-04-22T10:00:00",
    location: "Engineering Building",
    description: "Connect with potential employers and explore career opportunities.",
    attendees: 200,
    image: "/placeholder.svg?height=200&width=400",
    status: "upcoming",
  },
  {
    id: "4",
    name: "Hackathon 2025",
    date: "2025-04-25T08:00:00",
    location: "Computer Science Building",
    description: "24-hour coding competition with prizes for the best projects.",
    attendees: 75,
    image: "/placeholder.svg?height=200&width=400",
    status: "upcoming",
  },
  {
    id: "5",
    name: "Alumni Networking",
    date: "2025-03-28T17:00:00",
    location: "Business School Atrium",
    description: "Network with successful alumni and learn from their experiences.",
    attendees: 50,
    image: "/placeholder.svg?height=200&width=400",
    status: "past",
  },
]

interface Event {
  id: string
  name: string
  date: string
  location: string
  description: string
  attendees: number
  image: string
  status: "upcoming" | "past" | "draft"
}

export default function EventsManagement() {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(events)
  const [activeTab, setActiveTab] = useState("all")
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    name: "",
    date: "",
    location: "",
    description: "",
    status: "upcoming",
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  // Filter events based on search term and active tab
  useEffect(() => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((event) => event.status === activeTab)
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, activeTab])

  const handleAddEvent = () => {
    if (!newEvent.name || !newEvent.date || !newEvent.location) {
      return
    }

    const eventToAdd: Event = {
      id: Date.now().toString(),
      name: newEvent.name || "",
      date: newEvent.date || new Date().toISOString(),
      location: newEvent.location || "",
      description: newEvent.description || "",
      attendees: 0,
      image: "/placeholder.svg?height=200&width=400",
      status: (newEvent.status as "upcoming" | "past" | "draft") || "upcoming",
    }

    setEvents([eventToAdd, ...events])
    setIsAddEventOpen(false)
    setNewEvent({
      name: "",
      date: "",
      location: "",
      description: "",
      status: "upcoming",
    })
    setSelectedDate(undefined)

    // Show success alert
    setAlertMessage("Event added successfully!")
    setShowSuccessAlert(true)
    setTimeout(() => setShowSuccessAlert(false), 3000)
  }

  const handleUpdateEvent = () => {
    if (!editingEvent || !editingEvent.name || !editingEvent.date || !editingEvent.location) {
      return
    }

    setEvents(events.map((event) => (event.id === editingEvent.id ? editingEvent : event)))
    setEditingEvent(null)

    // Show success alert
    setAlertMessage("Event updated successfully!")
    setShowSuccessAlert(true)
    setTimeout(() => setShowSuccessAlert(false), 3000)
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id))

    // Show success alert
    setAlertMessage("Event deleted successfully!")
    setShowSuccessAlert(true)
    setTimeout(() => setShowSuccessAlert(false), 3000)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      setNewEvent({
        ...newEvent,
        date: date.toISOString(),
      })
    }
  }

  const handleEditDateSelect = (date: Date | undefined) => {
    if (date && editingEvent) {
      setEditingEvent({
        ...editingEvent,
        date: date.toISOString(),
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title="Event Management" description="Create, edit, and manage your campus events" icon="📅" />

      {/* Success Alert */}
      <AnimatePresence>
        {showSuccessAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50"
          >
            <Alert className="bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 w-72">
              <AlertDescription>{alertMessage}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-8 backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70 border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search events..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="draft">Drafts</TabsTrigger>
              </TabsList>
            </Tabs>

            <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Add New Event</DialogTitle>
                  <DialogDescription>Create a new event for students to find rides to.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="event-name">Event Name</Label>
                    <Input
                      id="event-name"
                      placeholder="Spring Music Festival"
                      value={newEvent.name}
                      onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Date & Time</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP p") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          initialFocus
                        />
                        <div className="p-3 border-t border-border">
                          <Input
                            type="time"
                            onChange={(e) => {
                              if (selectedDate) {
                                const date = new Date(selectedDate)
                                const [hours, minutes] = e.target.value.split(":").map(Number)
                                date.setHours(hours, minutes)
                                setNewEvent({
                                  ...newEvent,
                                  date: date.toISOString(),
                                })
                              }
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="event-location">Location</Label>
                    <Input
                      id="event-location"
                      placeholder="Student Union Building"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      placeholder="Provide details about your event..."
                      rows={3}
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="event-status">Status</Label>
                    <select
                      id="event-status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newEvent.status}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, status: e.target.value as "upcoming" | "past" | "draft" })
                      }
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddEvent}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    disabled={!newEvent.name || !newEvent.date || !newEvent.location}
                  >
                    Add Event
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Event Dialog */}
            <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Edit Event</DialogTitle>
                  <DialogDescription>Update the details of your event.</DialogDescription>
                </DialogHeader>
                {editingEvent && (
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-event-name">Event Name</Label>
                      <Input
                        id="edit-event-name"
                        value={editingEvent.name}
                        onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Date & Time</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {editingEvent.date ? (
                              format(new Date(editingEvent.date), "PPP p")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={editingEvent.date ? new Date(editingEvent.date) : undefined}
                            onSelect={handleEditDateSelect}
                            initialFocus
                          />
                          <div className="p-3 border-t border-border">
                            <Input
                              type="time"
                              defaultValue={editingEvent.date ? format(new Date(editingEvent.date), "HH:mm") : ""}
                              onChange={(e) => {
                                const date = new Date(editingEvent.date)
                                const [hours, minutes] = e.target.value.split(":").map(Number)
                                date.setHours(hours, minutes)
                                setEditingEvent({
                                  ...editingEvent,
                                  date: date.toISOString(),
                                })
                              }}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-event-location">Location</Label>
                      <Input
                        id="edit-event-location"
                        value={editingEvent.location}
                        onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-event-description">Description</Label>
                      <Textarea
                        id="edit-event-description"
                        rows={3}
                        value={editingEvent.description}
                        onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-event-status">Status</Label>
                      <select
                        id="edit-event-status"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={editingEvent.status}
                        onChange={(e) =>
                          setEditingEvent({ ...editingEvent, status: e.target.value as "upcoming" | "past" | "draft" })
                        }
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingEvent(null)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdateEvent}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    Update Event
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3 }}
                layout
              >
                <Card className="overflow-hidden backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700 shadow-lg">
                  <div className="relative">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingEvent(event)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Badge
                      className={`absolute top-2 left-2 ${
                        event.status === "upcoming"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                          : event.status === "past"
                            ? "bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-800"
                            : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                      }`}
                    >
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  </div>

                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-xl">{event.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-2" />
                        {format(new Date(event.date), "PPP p")}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-2" />
                        {event.attendees} attendees
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">{event.description}</p>
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button variant="outline" size="sm" onClick={() => setEditingEvent(event)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleDeleteEvent(event.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredEvents.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">No events found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                {searchTerm ? "Try adjusting your search terms or filters" : "Get started by creating your first event"}
              </p>
              <Button
                onClick={() => setIsAddEventOpen(true)}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Event
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
