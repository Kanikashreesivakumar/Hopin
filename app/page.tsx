"use client"

import { useRef, useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Car, ChevronRight, MapPin, MessageCircle, User, Key } from "lucide-react"
import Logo from "@/components/logo"
import * as THREE from "three"
import CostSplitCalculator from "@/components/cost-split-calculator"

export default function Home() {
  const howItWorksRef = useRef(null)
  const isHowItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.3 })

  const eventsRef = useRef(null)
  const isEventsInView = useInView(eventsRef, { once: true, amount: 0.3 })

  const mapRef = useRef(null)
  const isMapInView = useInView(mapRef, { once: true, amount: 0.3 })

  const calculatorRef = useRef(null)
  const isCalculatorInView = useInView(calculatorRef, { once: true, amount: 0.3 })

  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const carModelRef = useRef<THREE.Group | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

 
  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    sceneRef.current = scene


    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(200, 200)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(0, 1, 1)
    scene.add(directionalLight)

    const carGroup = new THREE.Group()

    const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 1)
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0xffa500 })
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial)
    carGroup.add(body)

    
    const topGeometry = new THREE.BoxGeometry(1.2, 0.4, 0.8)
    const topMaterial = new THREE.MeshPhongMaterial({ color: 0xffa500 })
    const top = new THREE.Mesh(topGeometry, topMaterial)
    top.position.y = 0.45
    carGroup.add(top)

   
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32)
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 })

    const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel1.position.set(0.6, -0.3, 0.5)
    wheel1.rotation.z = Math.PI / 2
    carGroup.add(wheel1)

    const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel2.position.set(0.6, -0.3, -0.5)
    wheel2.rotation.z = Math.PI / 2
    carGroup.add(wheel2)

    const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel3.position.set(-0.6, -0.3, 0.5)
    wheel3.rotation.z = Math.PI / 2
    carGroup.add(wheel3)

    const wheel4 = new THREE.Mesh(wheelGeometry, wheelMaterial)
    wheel4.position.set(-0.6, -0.3, -0.5)
    wheel4.rotation.z = Math.PI / 2
    carGroup.add(wheel4)

    scene.add(carGroup)
    carModelRef.current = carGroup

 
    const animate = () => {
      requestAnimationFrame(animate)

      if (carModelRef.current) {
        carModelRef.current.rotation.y += 0.01
      }

      renderer.render(scene, camera)
    }

    animate()

    
    return () => {
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
      }
    }
  }, [])

  
  const [events, setEvents] = useState<any[]>([]);
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        if (data.events) {
          setEvents(data.events.map((event: any) => ({
            ...event,
            id: event._id,
            title: event.name, 
          })));
        }
      } catch (err) {
       
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
    
      <header className="py-4 px-6 flex justify-between items-center">
        <Logo />
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button asChild className="bg-hopin-orange hover:bg-hopin-orange-dark text-white">
            <Link href="/auth">Login</Link>
          </Button>

          <Button asChild className="bg-hopin-orange hover:bg-hopin-orange-dark text-white">
              <Link href="/signup">Sign Up</Link>
            </Button>
      
        </div>
      </header>

      
      <section className="relative py-20 overflow-hidden">
        
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-hopin-orange/5 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
          <div className="absolute inset-0 before:content-[''] before:absolute before:w-[200%] before:h-full before:bg-[url(/wave.svg)] before:bg-repeat-x before:animate-wave"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                Find your next event ride with <span className="text-hopin-orange">HOPIN</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg text-gray-600 dark:text-gray-300 mb-8"
              >
                Smart, AI-powered, cost-efficient ride coordination for all your events. Save money, reduce emissions,
                and make new connections.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button asChild className="bg-hopin-orange hover:bg-hopin-orange-dark text-white text-lg px-8 py-3">
                  <Link href="/auth">Get Started</Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="lg:w-1/2 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-hopin-orange/20 rounded-full filter blur-3xl"></div>
                <div ref={containerRef} className="w-64 h-64 flex items-center justify-center animate-float"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section ref={howItWorksRef} className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              How <span className="text-hopin-orange">HOPIN</span> Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Our platform connects event-goers with drivers heading to the same destination, making travel easier,
              cheaper, and more sustainable.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-hopin-orange/10 p-4 rounded-full mb-6">
                  <Car className="h-10 w-10 text-hopin-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-3">For Drivers</h3>
                <ol className="space-y-4 text-left">
                  <li className="flex items-start">
                    <span className="bg-hopin-orange text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Register your vehicle and verify your identity</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-hopin-orange text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>List your upcoming event rides and available seats</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-hopin-orange text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Accept passengers and earn money while reducing your costs</span>
                  </li>
                </ol>
              </div>
            </motion.div>

           
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-hopin-orange/10 p-4 rounded-full mb-6">
                  <User className="h-10 w-10 text-hopin-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-3">For Passengers</h3>
                <ol className="space-y-4 text-left">
                  <li className="flex items-start">
                    <span className="bg-hopin-orange text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Create an account and set up your profile</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-hopin-orange text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Browse events and find available rides nearby</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-hopin-orange text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Book your seat, pay securely, and enjoy the ride</span>
                  </li>
                </ol>
              </div>
            </motion.div>

           
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHowItWorksInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-hopin-orange/10 p-4 rounded-full mb-6">
                  <Calendar className="h-10 w-10 text-hopin-orange" />
                </div>
                <h3 className="text-xl font-semibold mb-3">For Event Organizers</h3>
                <ol className="space-y-4 text-left">
                  <li className="flex items-start">
                    <span className="bg-hopin-orange text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Register as an event organizer and verify your status</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-hopin-orange text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Create and manage events with detailed information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-hopin-orange text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Monitor ride activity and help attendees coordinate</span>
                  </li>
                </ol>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

     
      <section ref={eventsRef} className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
          
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isEventsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
             
              className="text-3xl md:text-4xl font-bold mb-4"
            >              
            Upcoming <span className="text-hopin-orange">Events</span>
            </motion.h2>

        
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isEventsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Discover popular events in your area and find rides to attend them
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 30 }}
                animate={isEventsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group"
              >
                <div className="relative h-40 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-hopin-orange text-white">Event</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-hopin-orange font-medium">12 rides available</span>
                   
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild className="bg-hopin-orange hover:bg-hopin-orange-dark text-white">
              <Link href="/auth">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      <section ref={mapRef} className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isMapInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Smart <span className="text-hopin-orange">Route Planning</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isMapInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Our AI-powered system finds the most efficient routes and matches riders along the way
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isMapInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md h-80 relative overflow-hidden">
                
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
                  <div className="w-full h-full bg-[url('/loclogo.jpg?height=400&width=600')] bg-cover bg-center"></div>

                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg width="80%" height="60%" viewBox="0 0 100 60" className="overflow-visible">
                      <path
                        d="M10,30 Q30,10 50,30 Q70,50 90,30"
                        fill="none"
                        stroke="black"
                        strokeWidth="3"
                        strokeDasharray="5,3"
                        className="animate-pulse"
                      />
                      <circle cx="10" cy="30" r="4" fill="white" />
                      <circle cx="90" cy="30" r="4" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isMapInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Route Details</h3>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-hopin-orange/20 p-2 rounded-full mr-3">
                        <MapPin className="h-5 w-5 text-hopin-orange" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Starting Point</div>
                        <div className="font-medium">123 Main Street, Anytown</div>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-hopin-orange/20 p-2 rounded-full mr-3">
                        <MapPin className="h-5 w-5 text-hopin-orange" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Destination</div>
                        <div className="font-medium">Central Park Event Center</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="bg-hopin-orange/10 rounded-lg p-3 text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Distance</div>
                        <div className="text-lg font-semibold text-hopin-orange">12.5 km</div>
                      </div>

                      <div className="bg-hopin-orange/10 rounded-lg p-3 text-center">
                        <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                        <div className="text-lg font-semibold text-hopin-orange">25 min</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                  <h3 className="text-xl font-semibold mb-4">Passengers</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
                        <span>Sarah M.</span>
                      </div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Confirmed
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
                        <span>John D.</span>
                      </div>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        Confirmed
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 mr-3"></div>
                        <span>1 seat available</span>
                      </div>
                      <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">Open</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>


      <section ref={calculatorRef} className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isCalculatorInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Cost Split <span className="text-hopin-orange">Calculator</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isCalculatorInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            >
              Easily calculate how much each passenger should contribute for a fair ride-sharing experience
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isCalculatorInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-xl mx-auto"
          >
            <CostSplitCalculator />
          </motion.div>
        </div>
      </section>

   
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1 }}
          whileHover={{ scale: 1.1 }}
          className="relative"
        >
          <Button
            className="w-16 h-16 rounded-full bg-hopin-orange hover:bg-hopin-orange-dark shadow-lg flex items-center justify-center"
            aria-label="Open chat assistant"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            1
          </span>
        </motion.div>
      </div>


      <footer className="bg-gray-50 dark:bg-gray-800/50 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <Logo />
              <p className="mt-4 text-gray-600 dark:text-gray-400 text-sm hover:text-hopin-orange dark:hover:text-hopin-orange transition-colors">
                The smart way to share rides to events. Save money, reduce emissions, and make connections.
              </p>
            </div>

            

            
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Features</h3>
              <ul className="space-y-2">
                <li
                    className="text-gray-600 dark:text-gray-400 hover:text-hopin-orange dark:hover:text-hopin-orange transition-colors"
                  >
                    Map integration
                
                </li>
                <li
                    className="text-gray-600 dark:text-gray-400 hover:text-hopin-orange dark:hover:text-hopin-orange transition-colors"
                  >
                   Cost splitting
                 
                </li>
                <li
                    className="text-gray-600 dark:text-gray-400 hover:text-hopin-orange dark:hover:text-hopin-orange transition-colors"
                  >
                    AI Chatbot
                  
                </li>
                <li
                    className="text-gray-600 dark:text-gray-400 hover:text-hopin-orange dark:hover:text-hopin-orange transition-colors"
                  >
                    Eco friendly drive
                  
                </li>
              </ul>
            </div>
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Login</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/auth"
                    className="text-gray-600 dark:text-gray-400 hover:text-hopin-orange dark:hover:text-hopin-orange transition-colors"
                  >
                   Admin
                  </a>
                </li>
                <li>
                  <a
                    href="/auth"
                    className="text-gray-600 dark:text-gray-400 hover:text-hopin-orange dark:hover:text-hopin-orange transition-colors"
                  >
                   Passenger
                  </a>
                </li>
                <li>
                  <a
                    href="/auth"
                    className="text-gray-600 dark:text-gray-400 hover:text-hopin-orange dark:hover:text-hopin-orange transition-colors"
                  >
                    Driver
                  </a>
                </li>
                
              </ul>
            </div>

            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li >
               <a href="mailto:kanikashreesivakumar16@gmail.com" className="text-black dark:text-gray-400 hover:text-hopin-orange dark:hover:text-hopin-orange transition-colors">hopin@gmail.com</a>
                </li>
                <li>
                  <a href="phone:+917418761589" className="text-black dark:text-gray-400 hover:text-hopin-orange dark:hover:text-hopin-orange transition-colors">+19 7418761589</a>
                  </li>
                <li className="text-black dark:text-gray-400 hover:text-hopin-orange dark:hover:text-hopin-orange transition-colors">3rd floor, B-block, Excel institutions , komarapalayam, tamilnadu </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 md:mb-0">
              © 2023 HOPIN. All rights reserved.
            </div>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>Powered by</span>
              <MapPin className="h-4 w-4 mx-1 text-hopin-orange" />
              <span>+</span>
              <Key className="h-4 w-4 mx-1 text-hopin-orange" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
