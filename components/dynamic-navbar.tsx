"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Bell,
  Calendar,
  Car,
  ChevronDown,
  Home,
  LogOut,
  MapPin,
  Menu,
  Plus,
  Search,
  Settings,
  User,
  Users,
  X,
} from "lucide-react"
import { motion } from "framer-motion"
import Logo from "@/components/logo"
import { useMobile } from "@/hooks/use-mobile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/AuthContext"

type UserRole = "driver" | "passenger" | "admin"

export default function DynamicNavbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(3)

  const isAuthenticated = !!user
  console.log(isAuthenticated, user)
  const role = user?.role as UserRole | undefined
  const userName = user?.name || "Guest"
  const userAvatar = user?.avatar || "/placeholder.svg?height=32&width=32"

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { href: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
        { href: "/find-ride", label: "Find Ride", icon: <Search className="h-4 w-4 mr-2" /> },
        { href: "/offer-ride", label: "Offer Ride", icon: <Car className="h-4 w-4 mr-2" /> },
        { href: "/create-event", label: "Create Event", icon: <Plus className="h-4 w-4 mr-2" /> },
        { href: "/track-ride", label: "Track Ride", icon: <MapPin className="h-4 w-4 mr-2" /> },
      ]
    }
    switch (role) {
      case "driver":
        return [
          { href: "/dashboard/driver", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
          { href: "/dashboard/driver/rides", label: "My Rides", icon: <Car className="h-4 w-4 mr-2" /> },
          { href: "/dashboard/driver/alerts", label: "Pickup Alerts", icon: <Bell className="h-4 w-4 mr-2" /> },
          { href: "/dashboard/driver/location", label: "Share Location", icon: <MapPin className="h-4 w-4 mr-2" /> },
          { href: "/dashboard/driver/profile", label: "Profile", icon: <User className="h-4 w-4 mr-2" /> },
        ]
      case "passenger":
        return [
          { href: "/dashboard/passenger", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
          { href: "/dashboard/passenger/events", label: "View Events", icon: <Calendar className="h-4 w-4 mr-2" /> },
          { href: "/dashboard/passenger/find", label: "Find Rides", icon: <Search className="h-4 w-4 mr-2" /> },
          { href: "/dashboard/passenger/book", label: "Book Ride", icon: <Car className="h-4 w-4 mr-2" /> },
          {
            href: "/dashboard/passenger/calculator",
            label: "Cost Split Calculator",
            icon: <Users className="h-4 w-4 mr-2" />,
          },
          { href: "/dashboard/passenger/profile", label: "Profile", icon: <User className="h-4 w-4 mr-2" /> },
        ]
      case "admin":
        return [
          { href: "/dashboard/admin", label: "Admin Dashboard", icon: <Home className="h-4 w-4 mr-2" /> },
          { href: "/dashboard/admin/add-events", label: "Add Events", icon: <Plus className="h-4 w-4 mr-2" /> },
          {
            href: "/dashboard/admin/manage-events",
            label: "Manage Events",
            icon: <Calendar className="h-4 w-4 mr-2" />,
          },
          { href: "/dashboard/admin/rides", label: "View All Rides", icon: <Car className="h-4 w-4 mr-2" /> },
        ]
      default:
        return []
    }
  }

  const navLinks = getNavLinks()

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href={isAuthenticated ? `/dashboard/${role}` : "/"} className="flex items-center space-x-2">
            <Logo />
          </Link>

          {!isMobile ? (
            <nav className="mx-auto flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link.href
                      ? "bg-hopin-orange/10 text-hopin-orange"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50"
                  }`}
                >
                  <div className="flex items-center">
                    {link.icon}
                    {link.label}
                  </div>
                  {pathname === link.href && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-hopin-orange"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          ) : null}

          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {!isMobile ? (
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                          <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                          {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-hopin-orange text-[10px] text-white">
                              {notificationCount}
                            </span>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-80">
                        <div className="flex items-center justify-between p-4 border-b border-hopin-gray/20 dark:border-hopin-gray/10">
                          <h3 className="font-medium">Notifications</h3>
                          <Badge className="bg-hopin-orange text-white">{notificationCount} New</Badge>
                        </div>
                        <div className="max-h-80 overflow-y-auto">
                          {[1, 2, 3].map((i) => (
                            <DropdownMenuItem key={i} className="cursor-pointer p-4 hover:bg-hopin-orange/5">
                              <div className="flex items-start gap-4">
                                <Avatar className="h-9 w-9 border border-hopin-gray/20">
                                  <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
                                  <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">U</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                  <p className="text-sm font-medium leading-none">
                                    {role === "driver"
                                      ? "New ride request"
                                      : role === "passenger"
                                        ? "Ride confirmed"
                                        : "New event created"}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {role === "driver"
                                      ? "Sarah Miller wants to join your ride to Spring Music Festival"
                                      : role === "passenger"
                                        ? "Your ride to Spring Music Festival has been confirmed"
                                        : "New event 'Summer Concert' has been created"}
                                  </p>
                                  <div className="flex items-center pt-1">
                                    <Badge variant="outline" className="text-xs mr-2 border-hopin-gray/20">
                                      5 min ago
                                    </Badge>
                                    <Badge className="bg-hopin-orange/20 text-hopin-orange text-xs">New</Badge>
                                  </div>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))}
                        </div>
                        <div className="p-2 border-t border-hopin-gray/20 dark:border-hopin-gray/10">
                          <Button
                            variant="ghost"
                            className="w-full text-hopin-orange hover:bg-hopin-orange/10 hover:text-hopin-orange"
                          >
                            View all notifications
                          </Button>
                        </div>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 flex items-center gap-2 pl-2 pr-1">
                          <Avatar className="h-8 w-8 border border-hopin-gray/20">
                            <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
                            <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">
                              {userName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium hidden sm:block">{userName}</span>
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-56" align="end">
                        <div className="flex items-center gap-2 p-2 border-b border-hopin-gray/20 dark:border-hopin-gray/10">
                          <div className="bg-hopin-orange/10 text-hopin-orange rounded-md px-2 py-1 text-xs font-medium">
                            {role?.charAt(0).toUpperCase() + role?.slice(1)}
                          </div>
                          <div className="text-xs text-gray-500">ID: {role?.charAt(0).toUpperCase()}12345</div>
                        </div>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-500 focus:text-red-500" onClick={logout}>
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <Button variant="outline" className="text-hopin-orange hover:bg-hopin-orange/10">
                    Login
                  </Button>
                )}
              </div>
            ) : (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="border-hopin-gray/30">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] sm:w-[350px] border-hopin-gray/20">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <Logo />
                      <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                    </div>

                    {isAuthenticated ? (
                      <div className="flex items-center space-x-4 mb-6 p-4 bg-hopin-orange/5 rounded-lg">
                        <Avatar className="h-10 w-10 border border-hopin-gray/20">
                          <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
                          <AvatarFallback className="bg-hopin-orange/20 text-hopin-orange">
                            {userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{userName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                            <span className="capitalize">{role}</span>
                            <span className="mx-1">•</span>
                            <span>ID: {role?.charAt(0).toUpperCase()}12345</span>
                          </div>
                        </div>
                      </div>
                    ) : null}

                    <nav className="flex flex-col space-y-1">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`px-3 py-2 text-base font-medium rounded-lg transition-colors ${
                            pathname === link.href
                              ? "bg-hopin-orange/10 text-hopin-orange"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <div className="flex items-center">
                            {link.icon}
                            {link.label}
                          </div>
                        </Link>
                      ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-hopin-gray/20 dark:border-hopin-gray/10">
                      {isAuthenticated ? (
                        <Button
                          variant="outline"
                          className="w-full border-red-300 text-red-500 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                          onClick={logout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full text-hopin-orange hover:bg-hopin-orange/10">
                          Login
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
