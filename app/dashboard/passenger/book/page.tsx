"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Car, Check, Clock, CreditCard, MapPin, Star, Users } from "lucide-react"
import { format } from "date-fns"
import Mapbox from "@/components/mapbox"


export default function BookRidePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rideId = searchParams.get("ride")

  const [ride, setRide] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [passengerCount, setPassengerCount] = useState("1")
  const [specialRequests, setSpecialRequests] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [contactNumber, setContactNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const fetchRideDetails = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/passenger/rides/${rideId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch ride details")
        }
        const { data } = await response.json()
        const rideDetails = {
          id: data.id,
          driverName: data.driver.name,
          driverAvatar: "/placeholder.svg", // Placeholder for driver avatar
          driverRating: 4.5, // Placeholder rating
          eventName: data.event.title,
          eventDate: `${data.event.date}T${data.event.time}`,
          departureTime: data.departure_time,
          pickupLocation: data.start_location,
          pickupCoordinates: { lat: 28.6129, lng: 77.2295 }, // Placeholder coordinates
          destinationCoordinates: { lat: 28.6139, lng: 77.209 }, // Placeholder coordinates
          passengers: data.passenger_ids.length,
          maxPassengers: data.available_seats + data.passenger_ids.length,
          cost: data.cost,
          carModel: data.driver.vehicle_info.make + data.driver.vehicle_info.model, // Placeholder car model
          carColor: data.driver.vehicle_info.color, // Placeholder car color
          licensePlate: data.driver.vehicle_info.licensePlate, // Placeholder license plate
        }
        setRide(rideDetails)
      } catch (error) {
        console.error(error)
        setRide(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (rideId) {
      fetchRideDetails()
    }
  }, [rideId])

  const handleBookRide = () => {
    setIsSubmitting(true)

    // Simulate API call to book ride
    setTimeout(() => {
      setIsSubmitting(false)
      setShowSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/passenger")
      }, 3000)
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
     
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hopin-orange mb-4"></div>
            <h2 className="text-xl font-semibold">Loading ride details...</h2>
          </div>
        </main>
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
       
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6 text-center">
              <div className="mb-4">
                <Car className="h-12 w-12 mx-auto text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Ride Not Found</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The ride you're looking for doesn't exist or has been cancelled.
              </p>
              <Button
                className="bg-hopin-orange hover:bg-hopin-orange-dark text-white"
                onClick={() => router.push("/dashboard/passenger/find")}
              >
                Find Another Ride
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
     

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Book Your Ride</h1>
            <p className="text-gray-600 dark:text-gray-400">Complete your booking for {ride.eventName}</p>
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
                Your ride has been booked successfully! Redirecting to your dashboard...
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
                <CardTitle>Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-6">
                  <Mapbox
                    height="300px"
                    showDirections={true}
                    origin={ride.pickupCoordinates}
                    destination={ride.destinationCoordinates}
                    markers={[
                      {
                        position: ride.pickupCoordinates,
                        title: "Pickup: " + ride.pickupLocation,
                        info: `Departure: ${ride.departure_time}`,
                      },
                      {
                        position: ride.destinationCoordinates,
                        title: "Event: " + ride.eventName,
                        info: `Start time: ${ride.eventDate}`,
                      },
                    ]}
                    showTraffic={true}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="passenger-count">Number of Passengers</Label>
                    <Select value={passengerCount} onValueChange={setPassengerCount}>
                      <SelectTrigger id="passenger-count">
                        <SelectValue placeholder="Select number of passengers" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: ride.maxPassengers - ride.passengers + 1 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} {i === 0 ? "passenger" : "passengers"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="contact-number">Contact Number</Label>
                    <Input
                      id="contact-number"
                      placeholder="Your phone number"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="special-requests">Special Requests (Optional)</Label>
                  <Textarea
                    id="special-requests"
                    placeholder="Any special requirements or messages for the driver..."
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>

                <div>
                  <Label>Payment Method</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {/* <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        paymentMethod === "card"
                          ? "border-hopin-orange bg-hopin-orange/5"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-hopin-orange" />
                        <span>Credit Card</span>
                      </div>
                    </div> */}
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        paymentMethod === "upi"
                          ? "border-hopin-orange bg-hopin-orange/5"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => setPaymentMethod("upi")}
                    >
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 mr-2 text-hopin-orange"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 2L2 7L12 12L22 7L12 2Z"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 17L12 22L22 17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 12L12 17L22 12"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>UPI</span>
                      </div>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        paymentMethod === "cash"
                          ? "border-hopin-orange bg-hopin-orange/5"
                          : "border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => setPaymentMethod("cash")}
                    >
                      <div className="flex items-center">
                        <svg
                          className="h-5 w-5 mr-2 text-hopin-orange"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="2"
                            y="6"
                            width="20"
                            height="12"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6 12H6.01"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18 12H18.01"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>Cash</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Ride cost</span>
                    <span>₹{ride.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Passengers</span>
                    <span>× {passengerCount}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Service fee</span>
                    <span>₹{(0.1 * ride.cost * Number.parseInt(passengerCount)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-semibold">Total</span>
                    <span className="font-semibold text-hopin-orange">
                      ₹{(ride.cost * Number.parseInt(passengerCount) * 1.1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleBookRide}
                  className="w-full bg-hopin-orange hover:bg-hopin-orange-dark text-white"
                  disabled={!contactNumber || isSubmitting}
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
                      Processing...
                    </>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
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
                  <CardTitle>Ride Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={ride.driverAvatar || "/placeholder.svg"} alt={ride.driverName} />
                      <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">
                        {ride.driverName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{ride.driverName}</div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{ride.driverRating}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                    <div className="flex items-start">
                      <Calendar className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                      <div>
                        <div className="font-medium">{ride.eventName}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(ride.eventDate), "EEEE, MMMM d, yyyy")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Clock className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                      <div>
                        <div className="font-medium">Departure Time</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {format(new Date(ride.departureTime), "h:mm a")}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                      <div>
                        <div className="font-medium">Pickup Location</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{ride.pickupLocation}</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Users className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                      <div>
                        <div className="font-medium">Available Seats</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {ride.maxPassengers - ride.passengers} of {ride.maxPassengers}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Car className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
                      <div>
                        <div className="font-medium">Vehicle</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {ride.carColor} {ride.carModel} • {ride.licensePlate}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Cost per person</span>
                      <Badge className="bg-hopin-orange text-white">₹{ride.cost.toFixed(2)}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">•</span>
                      <span>Free cancellation up to 24 hours before departure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">•</span>
                      <span>50% refund for cancellations between 24 and 6 hours before departure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">•</span>
                      <span>No refund for cancellations less than 6 hours before departure</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">•</span>
                      <span>Be at the pickup location at least 5 minutes before the scheduled departure time</span>
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
