"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Bell, Calendar, CreditCard, LogIn, LogOut, Menu, Settings, User, X } from "lucide-react"
import { motion } from "framer-motion"
import Logo from "@/components/logo"
import { useMobile } from "@/hooks/use-mobile"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Mock authentication state - in a real app, this would come from an auth context
const isAuthenticated = false
const user = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatar: "/placeholder.svg?height=32&width=32",
}

export default function Navbar() {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

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

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/find-ride", label: "Find Ride" },
    { href: "/offer-ride", label: "Offer Ride" },
    { href: "/create-event", label: "Create Event" },
    { href: "/track-ride", label: "Track Ride" },
  ]

  const authenticatedLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/dashboard/events", label: "Events" },
    { href: "/profile", label: "Profile" },
  ]

  // Combine links based on authentication state
  const links = isAuthenticated ? [...navLinks, ...authenticatedLinks] : navLinks

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Logo />
          </Link>

          {!isMobile ? (
            <nav className="mx-auto flex items-center space-x-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-2 py-1 text-sm font-medium transition-colors ${
                    pathname === link.href
                      ? "text-green-600 dark:text-green-400"
                      : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
                  }`}
                >
                  {link.label}
                  {pathname === link.href && (
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-green-500 to-emerald-600"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          ) : null}

          <div className="flex items-center space-x-2">
            <ModeToggle />

            {!isMobile ? (
              isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                          3
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="max-h-80 overflow-y-auto">
                        {[1, 2, 3].map((i) => (
                          <DropdownMenuItem key={i} className="cursor-pointer p-4">
                            <div className="flex items-start gap-4">
                              <Avatar className="h-9 w-9">
                                <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
                                <AvatarFallback>U</AvatarFallback>
                              </Avatar>
                              <div className="space-y-1">
                                <p className="text-sm font-medium leading-none">New ride request</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Sarah Miller wants to join your ride to Spring Music Festival
                                </p>
                                <div className="flex items-center pt-1">
                                  <Badge variant="outline" className="text-xs mr-2">
                                    5 min ago
                                  </Badge>
                                  <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs">
                                    New
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer justify-center">
                        View all notifications
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Payments</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Events</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button
                  asChild
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                >
                  <Link href="/auth">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              )
            ) : (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-6">
                      <Logo />
                      <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                        <X className="h-5 w-5" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                    </div>

                    {isAuthenticated && (
                      <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    )}

                    <nav className="flex flex-col space-y-4">
                      {links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`px-2 py-2 text-base font-medium rounded-md transition-colors ${
                            pathname === link.href
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                          }`}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>

                    <div className="mt-auto pt-6">
                      {isAuthenticated ? (
                        <Button variant="outline" className="w-full" onClick={() => setIsOpen(false)}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      ) : (
                        <Button
                          asChild
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                        >
                          <Link href="/auth" onClick={() => setIsOpen(false)}>
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                          </Link>
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
