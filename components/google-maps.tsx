"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, InfoWindow } from "@react-google-maps/api"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Navigation, AlertCircle } from "lucide-react"


declare global {
  interface Window {
    google: any
  }
}


const defaultCenter = { lat: 28.6139, lng: 77.209 } 

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "0.75rem",
}

interface GoogleMapsProps {
  height?: string
  width?: string
  center?: google.maps.LatLngLiteral
  zoom?: number
  markers?: Array<{
    position: google.maps.LatLngLiteral
    title?: string
    icon?: string
    info?: string
  }>
  showDirections?: boolean
  origin?: google.maps.LatLngLiteral
  destination?: google.maps.LatLngLiteral
  waypoints?: google.maps.DirectionsWaypoint[]
  showCurrentLocation?: boolean
  onLocationSelect?: (location: google.maps.LatLngLiteral) => void
  className?: string
}

export default function GoogleMaps({
  height = "400px",
  width = "100%",
  center = defaultCenter,
  zoom = 12,
  markers = [],
  showDirections = false,
  origin,
  destination,
  waypoints = [],
  showCurrentLocation = false,
  onLocationSelect,
  className = "",
}: GoogleMapsProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY_HERE",
    libraries: ["places"],
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null)
  const [isLoadingDirections, setIsLoadingDirections] = useState(false)
  const [directionsError, setDirectionsError] = useState<string | null>(null)

  const mapRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    if (showCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setCurrentLocation(pos)
          if (map) {
            map.panTo(pos)
          }
        },
        () => {
          console.error("Error getting current location")
        },
      )
    }
  }, [showCurrentLocation, map])

  
  useEffect(() => {
    if (isLoaded && showDirections && origin && destination) {
      const directionsService = new window.google.maps.DirectionsService()
      setIsLoadingDirections(true)
      setDirectionsError(null)

      directionsService.route(
        {
          origin,
          destination,
          waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true,
        },
        (result: google.maps.DirectionsResult, status: google.maps.DirectionsStatus) => {
          setIsLoadingDirections(false)
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result)
          } else {
            setDirectionsError("Could not calculate directions. Please try again.")
            console.error(`Directions request failed: ${status}`)
          }
        },
      )
    }
  }, [isLoaded, showDirections, origin, destination, waypoints])

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (onLocationSelect && e.latLng) {
        onLocationSelect({ lat: e.latLng.lat(), lng: e.latLng.lng() })
      }
    },
    [onLocationSelect],
  )

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    mapRef.current = null
    setMap(null)
  }, [])

  // Custom map styles for a cleaner look
  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  }

  if (loadError) {
    return (
      <Card className="p-4 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
        <p className="text-red-500">Error loading Google Maps</p>
        <p className="text-sm text-gray-500 mt-2">Please check your API key and try again.</p>
      </Card>
    )
  }

  if (!isLoaded) {
    return (
      <Card className="p-4">
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </Card>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <GoogleMap
        mapContainerStyle={{ ...containerStyle, height }}
        center={currentLocation || center}
        zoom={zoom}
        options={mapOptions}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onMapClick}
      >
        {/* Current location marker */}
        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#FFA500",
              fillOpacity: 1,
              strokeColor: "#FFFFFF",
              strokeWeight: 2,
            }}
            title="Your Location"
          />
        )}

        {/* Custom markers */}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            title={marker.title}
            icon={marker.icon}
            onClick={() => setSelectedMarker(index)}
          />
        ))}

        {/* Info window for selected marker */}
        {selectedMarker !== null && markers[selectedMarker]?.info && (
          <InfoWindow position={markers[selectedMarker].position} onCloseClick={() => setSelectedMarker(null)}>
            <div className="p-2 max-w-xs">
              <h3 className="font-medium">{markers[selectedMarker].title}</h3>
              <p className="text-sm">{markers[selectedMarker].info}</p>
            </div>
          </InfoWindow>
        )}

        {/* Directions renderer */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#FFA500",
                strokeWeight: 5,
                strokeOpacity: 0.7,
              },
              suppressMarkers: markers.length > 0,
            }}
          />
        )}
      </GoogleMap>

      {/* Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {showCurrentLocation && (
          <Button
            size="sm"
            variant="secondary"
            className="bg-white dark:bg-gray-800 shadow-md"
            onClick={() => {
              if (currentLocation && map) {
                map.panTo(currentLocation)
                map.setZoom(15)
              }
            }}
          >
            <Navigation className="h-4 w-4 mr-1" />
            Center
          </Button>
        )}
      </div>

      {/* Directions loading/error states */}
      {isLoadingDirections && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="animate-spin h-6 w-6 border-2 border-hopin-orange border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm">Calculating route...</p>
          </div>
        </div>
      )}

      {directionsError && (
        <div className="absolute bottom-4 left-4 right-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg shadow-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p className="text-sm">{directionsError}</p>
          </div>
        </div>
      )}
    </div>
  )
}
