"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { LogOut } from "lucide-react"
import RoleNavbar from "@/components/role-navbar"

export default function LogoutPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // Simulate logout process
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Redirect to login page after countdown
          setTimeout(() => {
            router.push("/auth")
          }, 500)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <RoleNavbar role="admin" userName="Admin User" />

      <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <Card className="border-hopin-orange/20">
            <CardContent className="pt-6 pb-8 text-center">
              <div className="mb-6 flex justify-center">
                <div className="bg-hopin-orange/10 p-4 rounded-full">
                  <LogOut className="h-12 w-12 text-hopin-orange" />
                </div>
              </div>
              <h1 className="text-2xl font-bold mb-2">Logging Out</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You are being securely logged out of your account.
              </p>

              <div className="relative h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-hopin-orange"
                  initial={{ width: "100%" }}
                  animate={{ width: `${(countdown / 3) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                />
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting to login page in {countdown} {countdown === 1 ? "second" : "seconds"}...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
