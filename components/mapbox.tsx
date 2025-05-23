"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"


mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || ""

interface MapboxProps {
  height?: string
  width?: string
  markers?: Array<{
    position: { lat: number; lng: number }
    title?: string
    info?: string
  }>
  showDirections?: boolean
  origin?: { lat: number; lng: number }
  destination?: { lat: number; lng: number }
  showTraffic?: boolean
  showRouteOptions?: boolean
  onLocationSelect?: (location: { lat: number; lng: number }) => void
  currentLocation?: { lat: number; lng: number } | null
  zoom?: number
  className?: string
}

export default function Mapbox({
  height = "400px",
  width = "100%",
  markers = [],
  showDirections = false,
  origin,
  destination,
  showTraffic = false,
  showRouteOptions = false,
  onLocationSelect,
  currentLocation = null,
  zoom = 12,
  className = "",
}: MapboxProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedRoute, setSelectedRoute] = useState(0)
  const [routes, setRoutes] = useState<any[]>([])

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: currentLocation || origin || destination || [77.209, 28.6139], 
      zoom: zoom,
    })

    map.current.on("load", () => {
      setIsLoading(false)

      if (showTraffic && map.current) {
        map.current.addSource("traffic", {
          type: "vector",
          url: "mapbox://mapbox.mapbox-traffic-v1",
        })

        map.current.addLayer(
          {
            id: "traffic",
            type: "line",
            source: "traffic",
            "source-layer": "traffic",
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-width": 1.5,
              "line-color": [
                "match",
                ["get", "congestion"],
                "low",
                "#4CAF50",
                "moderate",
                "#FFEB3B",
                "heavy",
                "#FF9800",
                "severe",
                "#F44336",
                "#4CAF50",
              ],
            },
          },
          "road-label",
        )
      }
    })

    if (onLocationSelect && map.current) {
      map.current.on("click", (e) => {
        onLocationSelect({
          lat: e.lngLat.lat,
          lng: e.lngLat.lng,
        })
      })
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [currentLocation, destination, onLocationSelect, origin, showTraffic, zoom])

 
  useEffect(() => {
    if (!map.current || !markers.length) return

    const markerElements: mapboxgl.Marker[] = []

    markers.forEach((marker) => {
      const el = document.createElement("div")
      el.className = "marker"
      el.style.backgroundImage = "url(https://docs.mapbox.com/mapbox-gl-js/assets/pin.svg)"
      el.style.width = "30px"
      el.style.height = "30px"
      el.style.backgroundSize = "100%"

      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h3>${marker.title || "Location"}</h3>${marker.info ? `<p>${marker.info}</p>` : ""}`,
      )

      const mapboxMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.position.lng, marker.position.lat])
        .setPopup(popup)
        .addTo(map.current!)

      markerElements.push(mapboxMarker)
    })

    return () => {
      markerElements.forEach((marker) => marker.remove())
    }
  }, [markers, map.current])


  useEffect(() => {
    if (!map.current || !currentLocation) return

    const el = document.createElement("div")
    el.className = "current-location-marker"
    el.style.backgroundImage = "url(https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png)"
    el.style.width = "50px"
    el.style.height = "50px"
    el.style.backgroundSize = "100%"

    const marker = new mapboxgl.Marker(el).setLngLat([currentLocation.lng, currentLocation.lat]).addTo(map.current)

    map.current.flyTo({
      center: [currentLocation.lng, currentLocation.lat],
      zoom: 15,
    })

    return () => {
      marker.remove()
    }
  }, [currentLocation])

 
  useEffect(() => {
    if (!map.current || !showDirections || !origin || !destination) return

    const getRoute = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?alternatives=true&geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`,
        )
        const data = await response.json()

        if (data.routes && data.routes.length > 0) {
          setRoutes(data.routes)
          drawRoute(data.routes[0], 0)
        }
      } catch (error) {
        console.error("Error fetching directions:", error)
      }
    }

    const drawRoute = (route: any, index: number) => {
      if (!map.current) return

     
      if (map.current.getSource("route")) {
        map.current.removeLayer("route")
        map.current.removeSource("route")
      }

      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: route.geometry,
        },
      })

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#FFA500",
          "line-width": 6,
          "line-opacity": 0.75,
        },
      })

      
      const bounds = new mapboxgl.LngLatBounds()
      route.geometry.coordinates.forEach((coord: [number, number]) => {
        bounds.extend(coord)
      })
      map.current.fitBounds(bounds, { padding: 50 })
    }

    getRoute()
  }, [showDirections, origin, destination])

  const handleRouteChange = (index: number) => {
    if (routes[index]) {
      setSelectedRoute(index)
      drawRoute(routes[index], index)
    }
  }

  const drawRoute = (route: any, index: number) => {
    if (!map.current) return


    if (map.current.getSource("route")) {
      map.current.removeLayer("route")
      map.current.removeSource("route")
    }

    
    map.current.addSource("route", {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: route.geometry,
      },
    })

    map.current.addLayer({
      id: "route",
      type: "line",
      source: "route",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#FFA500",
        "line-width": 6,
        "line-opacity": 0.75,
      },
    })

    const bounds = new mapboxgl.LngLatBounds()
    route.geometry.coordinates.forEach((coord: [number, number]) => {
      bounds.extend(coord)
    })
    map.current.fitBounds(bounds, { padding: 50 })
  }

  return (
    <div className={`relative rounded-lg overflow-hidden ${className}`}>
      <div ref={mapContainer} style={{ height, width }} />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80">
          <Loader2 className="h-8 w-8 animate-spin text-hopin-orange" />
        </div>
      )}

      {showRouteOptions && routes.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
          <div className="text-sm font-medium mb-2">Route Options:</div>
          <div className="flex flex-wrap gap-2">
            {routes.map((route, index) => (
              <Button
                key={index}
                variant={selectedRoute === index ? "default" : "outline"}
                size="sm"
                className={selectedRoute === index ? "bg-hopin-orange text-white" : ""}
                onClick={() => handleRouteChange(index)}
              >
                {Math.round(route.duration / 60)} min ({(route.distance / 1000).toFixed(1)} km)
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
