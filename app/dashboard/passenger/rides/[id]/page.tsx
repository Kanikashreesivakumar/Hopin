"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Calendar, Car, ChevronLeft, Clock, MapPin, Phone, Star, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import DynamicNavbar from "@/components/dynamic-navbar"

// Define the Ride interface if not already defined elsewhere
interface Ride {
  id: string;
  eventName: string;
  date: string;
  time: string;
  status: string;
  driverName: string;
  driverRating: number;
  cost: number;
}

interface RideDetails extends Ride {
  driver: {
    phone: string;
    carDetails: {
      make: string;
      model: string;
      color: string;
      plateNumber: string;
    };
  };
  pickup: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  dropoff: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

export default function RideDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const [ride, setRide] = useState<RideDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  useEffect(() => {
    fetchRideDetails()
  }, [params.id])

  const fetchRideDetails = async () => {
    try {
      const response = await fetch(`/api/rides/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch ride details')
      const data = await response.json()
      setRide(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load ride details",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelRide = async () => {
    setIsCancelling(true);
    try {
      const response = await fetch(`/api/rides/${params.id}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to cancel ride');
      }

      toast({
        title: "Success",
        description: "Ride cancelled successfully",
        variant: "default",
      });

      // Update the ride status locally
      setRide(prev => prev ? { ...prev, status: 'cancelled' } : null);
      
      // Close the dialog
      setShowCancelDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to cancel ride",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <DynamicNavbar role="passenger" />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-hopin-orange"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <DynamicNavbar role="passenger" />
        <main className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Ride Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The ride you're looking for doesn't exist or has been removed.
            </p>
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="mx-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <DynamicNavbar role="passenger" />
      
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold mb-2">{ride.eventName}</h1>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{ride.date}</span>
                  <span className="mx-2">•</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{ride.time}</span>
                </div>
              </div>
              <Badge
                className={
                  ride.status === "confirmed"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : ride.status === "cancelled"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }
              >
                {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Driver Details</h3>
                  <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">
                        {ride.driverName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{ride.driverName}</div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                        <span>{ride.driverRating}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <Phone className="h-4 w-4 mr-1" />
                        <span>{ride.driver.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Vehicle Details</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Car</div>
                        <div className="font-medium">
                          {ride.driver.carDetails.make} {ride.driver.carDetails.model}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Color</div>
                        <div className="font-medium">{ride.driver.carDetails.color}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Plate Number</div>
                        <div className="font-medium">{ride.driver.carDetails.plateNumber}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Ride Details</h3>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Pickup Location</div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-hopin-orange mr-2" />
                        <span>{ride.pickup.address}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Dropoff Location</div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-hopin-orange mr-2" />
                        <span>{ride.dropoff.address}</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cost</div>
                      <div className="text-2xl font-bold text-hopin-orange">₹{ride.cost}</div>
                    </div>
                  </div>
                </div>

                {ride.status !== "cancelled" && ride.status !== "completed" && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowCancelDialog(true)}
                    disabled={isCancelling}
                  >
                    {isCancelling ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      "Cancel Ride"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </main>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Ride</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this ride? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, keep ride</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelRide}
              className="bg-red-500 hover:bg-red-600"
            >
              Yes, cancel ride
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}