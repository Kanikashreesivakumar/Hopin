"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Clock, ImageIcon, MapPin, Plus, Upload } from "lucide-react"
import PageHeader from "@/components/page-header"

export default function CreateEvent() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState("")
  const [eventName, setEventName] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // This would connect to backend in a real app
    alert("Event created successfully!")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title="Create Event" description="Add a new campus event that students can find rides to" icon="📝" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70 border border-gray-100 dark:border-gray-700"
        >
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
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={5}
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
                        className="relative cursor-pointer rounded-md font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 focus-within:outline-none"
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

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="sticky top-24">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70 border border-gray-100 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold mb-4">Event Preview</h3>

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
            </div>

            <div className="bg-gradient-to-r from-green-500/10 via-violet-500/10 to-pink-500/10 dark:from-green-900/20 dark:via-violet-900/20 dark:to-pink-900/20 rounded-xl p-6 backdrop-blur-sm border border-white/20 dark:border-white/5 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Event Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">🎓</span>
                  <span className="text-sm">Include all important details about your event</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">🏫</span>
                  <span className="text-sm">Add a high-quality banner image to attract attention</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">🚗</span>
                  <span className="text-sm">Be specific about the location for easier ride coordination</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">🎉</span>
                  <span className="text-sm">Share your event link with students to boost attendance</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
