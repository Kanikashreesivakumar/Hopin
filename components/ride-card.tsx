"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { format } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar, Car, Clock, DollarSign, MapPin, Route, Star, User } from "lucide-react"

interface RideCardProps {
  ride: {
    id: number
    driverName: string
    driverRating: number
    eventName: string
    eventDate: string
    pickupPoint: string
    cost: number
    availableSeats: number
    carModel: string
    departureTime: string
  }
  onViewRoute?: () => void
  onBookRide?: () => void
  className?: string
}

export default function RideCard({ ride, onViewRoute, onBookRide, className = "" }: RideCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={className}
    >
      <Card className="overflow-hidden h-full border border-gray-200 dark:border-gray-700 hover:border-hopin-orange/50 transition-colors">
        <CardHeader className="p-4 pb-0">
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src={`/perlogo.jpg?height=40&width=40`} alt={ride.driverName} />
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
            <Badge className="bg-hopin-orange text-white">₹{ride.cost}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-gray-500" />
              <span>{format(new Date(ride.eventDate), "MMM d, yyyy")}</span>
            </div>
            <div className="flex items-center text-sm font-medium">
              <Clock className="h-4 w-4 mr-2 text-gray-500" />
              <span>Departure: {format(new Date(ride.departureTime), "h:mm a")}</span>
            </div>
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
              <span>{ride.pickupPoint}</span>
            </div>
            <div className="flex items-center text-sm">
              <Car className="h-4 w-4 mr-2 text-gray-500" />
              <span>{ride.carModel}</span>
            </div>
            <div className="flex items-center text-sm">
              <User className="h-4 w-4 mr-2 text-gray-500" />
              <span>{ride.availableSeats} seats available</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-hopin-orange text-hopin-orange hover:bg-hopin-orange/10"
            onClick={onViewRoute}
          >
            <Route className="h-4 w-4 mr-2" />
            View Route
          </Button>
          <Button asChild className="w-full bg-hopin-orange hover:bg-hopin-orange-dark text-white" onClick={onBookRide}>
            <Link href={`/dashboard/passenger/book?ride=${ride.id}`}>
              <DollarSign className="h-4 w-4 mr-2" />
              Book Ride
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
