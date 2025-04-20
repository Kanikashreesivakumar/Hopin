"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RoleNavbar from "@/components/role-navbar"
import CostSplitCalculator from "@/components/cost-split-calculator"
import { Info } from "lucide-react"

export default function CostCalculatorPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <RoleNavbar role="passenger" userName="Emma Wilson" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cost Split Calculator</h1>
            <p className="text-gray-600 dark:text-gray-400">Calculate fair ride cost sharing between passengers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <CostSplitCalculator
              initialValues={{
                fuelCost: 500,
                distance: 25,
                passengers: 3,
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="sticky top-24 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="h-5 w-5 mr-2 text-hopin-orange" />
                    How It Works
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The Cost Split Calculator helps you determine a fair price for each passenger in a shared ride.
                  </p>

                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <h3 className="font-medium text-sm mb-1">Fuel Cost</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Enter the total cost of fuel for the entire trip.
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <h3 className="font-medium text-sm mb-1">Distance</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Enter the total distance of the trip in kilometers.
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <h3 className="font-medium text-sm mb-1">Passengers</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Adjust the number of passengers sharing the ride.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="font-medium text-sm mb-2">Results Explained</h3>
                    <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                      <li className="flex items-start">
                        <span className="text-hopin-orange mr-2">•</span>
                        <span>
                          <strong>Cost per Person:</strong> The amount each passenger should pay.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hopin-orange mr-2">•</span>
                        <span>
                          <strong>Cost per km:</strong> The fuel cost per kilometer traveled.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hopin-orange mr-2">•</span>
                        <span>
                          <strong>Total Savings:</strong> The amount saved by sharing the ride instead of each person
                          driving separately.
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Benefits of Ride Sharing</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">💰</span>
                      <span className="text-sm">Save money on transportation costs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">🌿</span>
                      <span className="text-sm">Reduce carbon emissions and environmental impact</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">🚗</span>
                      <span className="text-sm">Decrease traffic congestion around event venues</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">👥</span>
                      <span className="text-sm">Meet new people and build connections</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
