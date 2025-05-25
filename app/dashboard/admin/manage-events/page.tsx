"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useRouter } from "next/navigation"


interface Event {
  id: string
  title: string
  date: string | Date
  location: string
  description?: string
  attendees?: number
  image?: string
  status?: "upcoming" | "past" | "draft"
}

export default function ManageEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: "",
    date: "",
    location: "",
    description: "",
    status: "upcoming",
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEvents = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/admin/events")
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }
      const result = await response.json()
      if (result.success) {
        // status is now set by backend, so just use it
        const mappedEvents = result.data.map((eventData: any) => ({
          ...eventData,
          _id: eventData._id,
          title: eventData.title,
          date: eventData.date,
          status: eventData.status,
        }))
        setEvents(mappedEvents)
        setFilteredEvents(mappedEvents)
      } else {
        throw new Error(result.error || "Failed to fetch events")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    let filtered = events

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((event) => event.status === activeTab)
    }

    setFilteredEvents(filtered)
  }, [events, searchTerm, activeTab])

  

  const handleUpdateEvent = async () => {
    if (!editingEvent || !editingEvent.title || !editingEvent.date || !editingEvent.location) {
      setAlertMessage("Invalid event data for update.")
      setShowSuccessAlert(true)
      setTimeout(() => setShowSuccessAlert(false), 3000)
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      console.log("Editing event:", editingEvent)
      const response = await fetch(`/api/admin/events?eventId=${editingEvent.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingEvent.title,
          date: editingEvent.date,
          location: editingEvent.location,
          description: editingEvent.description,
          attendees: editingEvent.attendees,
          image: editingEvent.image,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to update event")
      }

      fetchEvents()
      setEditingEvent(null)
      setAlertMessage("Event updated successfully!")
      setShowSuccessAlert(true)
      setTimeout(() => setShowSuccessAlert(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event")
      setAlertMessage(err instanceof Error ? err.message : "Failed to update event")
      setShowSuccessAlert(true)
      setTimeout(() => setShowSuccessAlert(false), 4000)
      console.error("Update event error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/events?eventId=${id}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to delete event")
      }

      fetchEvents()

      setAlertMessage("Event deleted successfully!")
      setShowSuccessAlert(true)
      setTimeout(() => setShowSuccessAlert(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event")
      setAlertMessage(err instanceof Error ? err.message : "Failed to delete event")
      setShowSuccessAlert(true)
      setTimeout(() => setShowSuccessAlert(false), 4000)
      console.error("Delete event error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
    if (date) {
      const currentTime = newEvent.date ? new Date(newEvent.date).toTimeString().split(" ")[0] : "00:00:00"
      const [hours, minutes] = currentTime.split(":").map(Number)
      date.setHours(hours, minutes)
      setNewEvent({
        ...newEvent,
        date: date.toISOString(),
      })
    }
  }

  const handleTimeSelect = (timeString: string, target: "new" | "edit") => {
    const [hours, minutes] = timeString.split(":").map(Number)
    if (target === "new") {
      const baseDate = selectedDate || new Date()
      baseDate.setHours(hours, minutes, 0, 0)
      setNewEvent({ ...newEvent, date: baseDate.toISOString() })
    } else if (editingEvent && editingEvent.date) {
      const baseDate = new Date(editingEvent.date)
      baseDate.setHours(hours, minutes, 0, 0)
      setEditingEvent({ ...editingEvent, date: baseDate.toISOString() })
    }
  }

  const handleEditDateSelect = (date: Date | undefined) => {
    if (date && editingEvent) {
      const currentTime = editingEvent.date ? new Date(editingEvent.date).toTimeString().split(" ")[0] : "00:00:00"
      const [hours, minutes] = currentTime.split(":").map(Number)
      date.setHours(hours, minutes)
      setEditingEvent({
        ...editingEvent,
        date: date.toISOString(),
      })
    }
  }

  if (isLoading && events.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
        <main className="container mx-auto px-4 py-8 text-center">
          <p>Loading events...</p>
        </main>
      </div>
    )
  }

  if (error && events.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center">
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error loading events</h1>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <Button onClick={fetchEvents} className="mt-4">
            Try Again
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Events</h1>
            <p className="text-gray-600 dark:text-gray-400">Create, edit, and manage your events</p>
          </div>
        </div>

        <AnimatePresence>
          {showSuccessAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 right-4 z-50"
            >
              <Alert
                className={`${
                  error
                    ? "bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                    : "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                } w-72`}
              >
                <AlertDescription>{alertMessage}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        <Card className="mb-8">
          <CardContent className="pt-6">
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
                  </TabsList>
                </Tabs>
                <Button className="bg-hopin-orange hover:bg-hopin-orange-dark text-white" onClick={() => router.push("/dashboard/admin/add-events")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Event
                </Button>
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
                          alt={event.title}
                          className="w-full h-40 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
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
                        {event.status && (
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
                        )}
                      </div>

                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="text-xl">{event.title}</CardTitle>
                      </CardHeader>

                      <CardContent className="p-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="h-4 w-4 mr-2" />
                            {event.date ? format(new Date(event.date), "PPP p") : "No date"}
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin className="h-4 w-4 mr-2" />
                            {event.location}
                          </div>
                          {event.attendees !== undefined && (
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <Users className="h-4 w-4 mr-2" />
                              {event.attendees} attendees
                            </div>
                          )}
                          {event.description && (
                            <p className="text-gray-600 dark:text-gray-400 line-clamp-2 mt-2">{event.description}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!isLoading && filteredEvents.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                    <Calendar className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">No events found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    {searchTerm
                      ? "Try adjusting your search terms or filters"
                      : "Get started by creating your first event"}
                  </p>
                  <Button
                    onClick={() => setIsAddEventOpen(true)}
                    className="bg-hopin-orange hover:bg-hopin-orange-dark text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Event
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
                                value={editingEvent.title}
                                onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
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
                  
      </main>
    </div>
  )
}
