"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Clock, ImageIcon, MapPin, Plus, Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Check } from "lucide-react"
import GoogleMaps from "@/components/google-maps"
import { supabase } from "@/utils/supabaseClient"
import { useAuth } from "@/hooks/AuthContext"

type LatLngLiteral = { lat: number; lng: number }

export default function AddEventPage() {
  const router = useRouter()
  const { user } = useAuth();

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("")
  const [eventName, setEventName] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<LatLngLiteral | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [attendees, setAttendees] = useState(1)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLocationSelect = (location: LatLngLiteral) => {
    setSelectedLocation(location)
    // In a real app, you would use a geocoding service to get the address
    setLocation(`Location at ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowSuccess(false);

    let imageUrl: string | undefined = undefined;
    if (imageFile) {
  
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${eventName.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.${fileExt}`;
      const { data, error } = await supabase.storage.from("event-banners").upload(fileName, imageFile, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) {
        alert("Image upload failed: " + error.message);
        setIsSubmitting(false);
        return;
      }
   
      const { data: publicUrlData } = supabase.storage.from("event-banners").getPublicUrl(fileName);
      imageUrl = publicUrlData?.publicUrl;
    }

    const eventData = {
      title: eventName,
      date: date ? date.toISOString() : undefined,
      time,
      location,
      description,
      image: imageUrl || undefined,
      attendees,
    };
    console.log(eventData)
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          router.push("/dashboard/admin/manage-events");
        }, 2000);
      } else {
        alert(data.error || "Failed to create event");
      }
    } catch (err) {
      alert("An error occurred while creating the event.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Add New Event</h1>
            <p className="text-gray-600 dark:text-gray-400">Create a new event for users to find rides to</p>
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
              <AlertDescription>Event created successfully!</AlertDescription>
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
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="event-name">Event Name</Label>
                    <Input
                      id="event-name"
                      placeholder="e.g. Spring Music Festival"
                      value={eventName}
                      onChange={(e) => setEventName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !date && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(newDate: Date | undefined) => {
                              setDate(newDate)
                            }}
                            initialFocus
                            disabled={(date) => date < new Date()}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="time">Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="time"
                          type="time"
                          className="pl-9"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        placeholder="e.g. Student Union Building"
                        className="pl-9"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>
                  </div>

               
                  <div>
                    <Label htmlFor="description">Event Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide details about your event..."
                      rows={5}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="image">Event Banner Image</Label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
                      <div className="space-y-1 text-center">
                        <div className="flex flex-col items-center">
                          {imagePreview ? (
                            <div className="relative w-full">
                              <img
                                src={imagePreview || "/placeholder.svg"}
                                alt="Preview"
                                className="mx-auto h-40 object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => setImagePreview(null)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                          )}
                          <div className="flex text-sm text-gray-600 dark:text-gray-400">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md font-medium text-hopin-orange hover:text-hopin-orange-dark focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 10MB</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="attendees">Attendees</Label>
                    <Input
                      id="attendees"
                      type="number"
                      min={1}
                      value={attendees}
                      onChange={e => setAttendees(Number(e.target.value))}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-hopin-orange hover:bg-hopin-orange-dark text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
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
                        Creating Event...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="sticky top-24">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Event Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-video mb-4">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Event banner preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-xl">{eventName || "Event Name"}</h4>

                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {date ? format(date, "PPP") : "Date"}
                      {time && `, ${time}`}
                    </div>

                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      {location || "Location"}
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                      {description || "Event description will appear here..."}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Event Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">🎓</span>
                      <span className="text-sm">Include all important details about your event</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">🏫</span>
                      <span className="text-sm">Add a high-quality banner image to attract attention</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">🚗</span>
                      <span className="text-sm">Be specific about the location for easier ride coordination</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">🎉</span>
                      <span className="text-sm">Share your event link with students to boost attendance</span>
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
