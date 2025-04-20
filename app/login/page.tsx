"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Car, ChevronRight, Key, Lock, Mail, MapPin, Shield, User } from "lucide-react"
import Logo from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"

type UserRole = "driver" | "passenger" | "admin" | null

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<UserRole>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRole || !email || !password) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Redirect based on role
      router.push(`/dashboard/${selectedRole}`)
    }, 1500)
  }

  const roleCards = [
    {
      role: "driver",
      title: "Driver",
      icon: <Car className="h-12 w-12 text-hopin-orange" />,
      description: "Offer rides to events and earn",
    },
    {
      role: "passenger",
      title: "Passenger",
      icon: <User className="h-12 w-12 text-hopin-orange" />,
      description: "Find and book rides to events",
    },
    {
      role: "admin",
      title: "Admin",
      icon: <Shield className="h-12 w-12 text-hopin-orange" />,
      description: "Manage events and platform",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <header className="py-4 px-6 flex justify-between items-center">
        <Logo />
        <ThemeToggle />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to HOPIN</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            The AI-powered event ride-sharing platform that connects you with the perfect ride
          </p>
        </motion.div>

        {!selectedRole ? (
          <>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-semibold mb-6 text-center"
            >
              Select your role to continue
            </motion.h2>

            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
            >
              {roleCards.map((card) => (
                <motion.div
                  key={card.role}
                  variants={item}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md cursor-pointer border-2 transition-all duration-300 ${
                    selectedRole === card.role
                      ? "border-hopin-orange animate-glow"
                      : "border-transparent hover:border-hopin-orange/50"
                  }`}
                  onClick={() => setSelectedRole(card.role as UserRole)}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-hopin-orange/10 p-4 rounded-full mb-4">{card.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{card.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg max-w-md w-full border border-hopin-gray/20 dark:border-hopin-gray/10"
          >
            <div className="flex items-center mb-6">
              <button
                onClick={() => setSelectedRole(null)}
                className="text-gray-500 hover:text-hopin-orange transition-colors mr-2"
              >
                <ChevronRight className="h-5 w-5 transform rotate-180" />
              </button>
              <h2 className="text-xl font-semibold">
                Login as{" "}
                <span className="text-hopin-orange">
                  {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
                </span>
              </h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-10 hopin-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-hopin-orange hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 hopin-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full hopin-button" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center justify-center">
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
                    Logging in...
                  </div>
                ) : (
                  "Login"
                )}
              </Button>

              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <a href="#" className="text-hopin-orange hover:underline">
                    Sign up
                  </a>
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </main>

      <footer className="py-6 px-6 border-t border-hopin-gray/20 dark:border-hopin-gray/10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Logo size="small" />
          </div>
          <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <a href="#" className="hover:text-hopin-orange transition-colors">
              About
            </a>
            <a href="#" className="hover:text-hopin-orange transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-hopin-orange transition-colors">
              Contact
            </a>
          </div>
          <div className="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-500 flex items-center">
            <span>Powered by</span>
            <MapPin className="h-4 w-4 mx-1 text-hopin-orange" />
            <span>+</span>
            <Key className="h-4 w-4 mx-1 text-hopin-orange" />
          </div>
        </div>
      </footer>
    </div>
  )
}
