"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowRight, Car, Clock, Compass, Layers, MapPin, Navigation, RotateCcw, Zap } from "lucide-react"

interface AIMapProps {
  startLocation?: string
  endLocation?: string
  showTraffic?: boolean
  showRouteOptions?: boolean
  height?: string
  width?: string
  className?: string
  onRouteSelect?: (route: RouteOption) => void
  isTracking?: boolean
  driverLocation?: { lat: number; lng: number }
}

interface RouteOption {
  id: string
  name: string
  duration: number
  distance: number
  trafficLevel: "low" | "medium" | "high"
  etaTime: string
  etaArrival: string
}

export default function AIMap({
  startLocation = "",
  endLocation = "",
  showTraffic = true,
  showRouteOptions = true,
  height = "400px",
  width = "100%",
  className = "",
  onRouteSelect,
  isTracking = false,
  driverLocation,
}: AIMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [trafficEnabled, setTrafficEnabled] = useState(showTraffic)
  const [isAIOptimizing, setIsAIOptimizing] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(14)

  const routeOptions: RouteOption[] = [
    {
      id: "route1",
      name: "Fastest Route",
      duration: 18,
      distance: 5.2,
      trafficLevel: "low",
      etaTime: "18 min",
      etaArrival: "5:48 PM",
    },
    {
      id: "route2",
      name: "Shortest Distance",
      duration: 22,
      distance: 4.8,
      trafficLevel: "medium",
      etaTime: "22 min",
      etaArrival: "5:52 PM",
    },
    {
      id: "route3",
      name: "Least Traffic",
      duration: 25,
      distance: 6.1,
      trafficLevel: "low",
      etaTime: "25 min",
      etaArrival: "5:55 PM",
    },
  ]


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMapLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const optimizeRoute = () => {
    setIsAIOptimizing(true)
    setTimeout(() => {
      setIsAIOptimizing(false)
      setSelectedRoute("route1")
      if (onRouteSelect) {
        onRouteSelect(routeOptions[0])
      }
    }, 2000)
  }

  const getTrafficColor = (level: "low" | "medium" | "high") => {
    switch (level) {
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-red-500"
      default:
        return "bg-green-500"
    }
  }

  return (
    <div className={`relative ${className}`} style={{ height, width }}>
   
      <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
    
        {!isMapLoaded ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center">
          
            <div className="absolute inset-0 flex items-center justify-center opacity-0">
              <span>Map API would render here</span>
            </div>

    
            {startLocation && (
              <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <MapPin className="h-8 w-8 text-green-500 drop-shadow-md" />
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-md text-xs whitespace-nowrap">
                    {startLocation}
                  </div>
                </div>
              </div>
            )}

            {endLocation && (
              <div className="absolute bottom-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <MapPin className="h-8 w-8 text-red-500 drop-shadow-md" />
                  <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 px-2 py-1 rounded-md shadow-md text-xs whitespace-nowrap">
                    {endLocation}
                  </div>
                </div>
              </div>
            )}

            
            {isTracking && driverLocation && (
              <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  >
                    <Car className="h-8 w-8 text-violet-500 drop-shadow-md" />
                  </motion.div>
                  <motion.div
                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-violet-500 rounded-full opacity-20"
                    initial={{ scale: 0.5, opacity: 0.2 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                  />
                </div>
              </div>
            )}

        
            {selectedRoute && (
              <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
                <path
                  d={`M ${window.innerWidth * 0.25} ${window.innerHeight * 0.33} 
                      C ${window.innerWidth * 0.35} ${window.innerHeight * 0.4}, 
                        ${window.innerWidth * 0.5} ${window.innerHeight * 0.5}, 
                        ${window.innerWidth * 0.75} ${window.innerHeight * 0.67}`}
                  stroke="#8b5cf6"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="8 4"
                  className="drop-shadow-md"
                />
              </svg>
            )}

            {trafficEnabled && (
              <>
                <div className="absolute top-1/4 right-1/3 w-16 h-3 bg-red-500 opacity-50 rounded-full transform rotate-45"></div>
                <div className="absolute top-2/3 left-1/3 w-20 h-3 bg-yellow-500 opacity-50 rounded-full transform -rotate-20"></div>
                <div className="absolute bottom-1/4 right-1/4 w-12 h-3 bg-green-500 opacity-50 rounded-full transform rotate-75"></div>
              </>
            )}
          </div>
        )}
      </div>

     
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button variant="secondary" size="icon" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md">
          <Layers className="h-4 w-4" />
        </Button>
        <Button variant="secondary" size="icon" className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md">
          <Compass className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md"
          onClick={() => setZoomLevel(Math.min(zoomLevel + 1, 20))}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-md"
          onClick={() => setZoomLevel(Math.max(zoomLevel - 1, 5))}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className={`${trafficEnabled ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-white/80 dark:bg-gray-800/80"} backdrop-blur-sm shadow-md`}
          onClick={() => setTrafficEnabled(!trafficEnabled)}
        >
          <Car className="h-4 w-4" />
        </Button>
      </div>

      {showRouteOptions && isMapLoaded && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md"
        >
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Navigation className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-semibold">Route Options</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1"
                    onClick={optimizeRoute}
                    disabled={isAIOptimizing}
                  >
                    {isAIOptimizing ? (
                      <RotateCcw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Zap className="h-3 w-3 text-yellow-500" />
                    )}
                    <span className="text-xs">AI Optimize</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                {routeOptions.map((route) => (
                  <div
                    key={route.id}
                    className={`p-2 rounded-lg cursor-pointer transition-all ${
                      selectedRoute === route.id
                        ? "bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800"
                        : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent"
                    }`}
                    onClick={() => {
                      setSelectedRoute(route.id)
                      if (onRouteSelect) onRouteSelect(route)
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-full rounded-full ${getTrafficColor(route.trafficLevel)}`}></div>
                        <div>
                          <div className="font-medium text-sm">{route.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {route.distance} miles • {route.etaTime}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {route.etaArrival}
                        </Badge>
                        {selectedRoute === route.id && <ArrowRight className="h-4 w-4 ml-2 text-violet-500" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedRoute && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>Traffic conditions</span>
                    <span>Updated 2 min ago</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}


      {trafficEnabled && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="absolute top-4 left-4 max-w-xs"
        >
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-2 shadow-md backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-xs font-medium text-red-700 dark:text-red-400">Heavy traffic on Main St</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}


function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}

function Minus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
    </svg>
  )
}
