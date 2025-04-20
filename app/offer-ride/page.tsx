"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Car, Clock, DollarSign, MapPin, Plus, Users } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import PageHeader from "@/components/page-header"
import Mapbox from "@/components/mapbox"

// Mock data for events
const mockEvents = [
  { id: 1, name: "Spring Music Festival", date: "2025-04-15T18:00:00" },
  { id: 2, name: "Basketball Championship", date: "2025-04-20T19:30:00" },
  { id: 3, name: "Career Fair", date: "2025-04-22T10:00:00" },
  { id: 4, name: "Hackathon 2025", date: "2025-04-25T08:00:00" },
  { id: 5, name: "Alumni Networking", date: "2025-04-28T17:00:00" },
]

export default function OfferRide() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState('')
  const [event, setEvent] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [pickupCoordinates, setPickupCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [seats, setSeats] = useState('3')
  const [costPerSeat, setCostPerSeat] = useState('')
  const [carModel, setCarModel] = useState('')
  const [notes, setNotes] = useState('')

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setPickupCoordinates(location)
    // You would typically use a geocoding service here to get the address
    setPickupLocation(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!pickupCoordinates) {
      alert("Please select a pickup location on the map")
      return
    }
    // This would connect to backend in a real app
    alert('Ride offer submitted successfully!')
  }

  // Default coordinates (centered on your city/campus)
  const defaultLocation = { lat: 28.6129, lng: 77.2295 }

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader 
        title="Offer a Ride" 
        description="Share your ride with fellow students heading to campus events"
        icon="🚗"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70 border border-gray-100 dark:border-gray-700"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="event">Event</Label>
              <Select value={event} onValueChange={setEvent} required>
                <SelectTrigger id="event">
                  <SelectValue placeholder="Select event" />
                </SelectTrigger>
                <SelectContent>
                  {mockEvents.map(event => (
                    <SelectItem key={event.id} value={event.name}>{event.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label htmlFor="time">Departure Time</Label>
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
              <Label htmlFor="pickup">Pickup Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="pickup"
                  placeholder="Click on the map to set location"
                  className="pl-9"
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  required
                  readOnly
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="seats">Available Seats</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Select value={seats} onValueChange={setSeats} required>
                    <SelectTrigger id="seats" className="pl-9">
                      <SelectValue placeholder="Seats" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="cost">Cost per Seat ($)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="cost"
                    type="number"
                    min="0"
                    step="0.50"
                    placeholder="5.00"
                    className="pl-9"
                    value={costPerSeat}
                    onChange={(e) => setCostPerSeat(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="car">Car Model</Label>
                <div className="relative">
                  <Car className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="car"
                    placeholder="e.g. Honda Civic"
                    className="pl-9"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional information riders should know..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
                rows={3}
              />
            </div>
            
            <Button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Submit Ride Offer
            </Button>
          </form>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="sticky top-24">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70 border border-gray-100 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-semibold mb-4">Pickup Location</h3>
              <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <Mapbox
                  height="300px"
                  width="100%"
                  markers={pickupCoordinates ? [
                    {
                      position: pickupCoordinates,
                      title: "Pickup Location",
                      info: "Your selected pickup point",
                    },
                  ] : []}
                  zoom={14}
                  onLocationSelect={handleLocationSelect}
                  origin={pickupCoordinates || defaultLocation}
                />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-6">
                Click on the map to set your exact pickup location
              </p>
            </div>
          
          <div className="bg-gradient-to-r from-green-500/10 via-violet-500/10 to-pink-500/10 dark:from-green-900/20 dark:via-violet-900/20 dark:to-pink-900/20 rounded-xl p-6 backdrop-blur-sm border border-white/20 dark:border-white/5 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Driver Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">🎓</span>
                <span className="text-sm">Arrive 5-10 minutes early at the pickup location</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">🏫</span>
                <span className="text-sm">Confirm your passengers' identities before departing</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">🚗</span>
                <span className="text-sm">Keep your vehicle clean and comfortable</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">🎉</span>
                <span className="text-sm">Share your contact info with riders for easy communication</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
