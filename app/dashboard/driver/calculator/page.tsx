"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import RoleNavbar from "@/components/role-navbar"
import CostSplitCalculator from "@/components/cost-split-calculator"
import { Info } from "lucide-react"

export default function DriverCostCalculatorPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <RoleNavbar role="driver" userName="Alex Johnson" />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cost Split Calculator</h1>
            <p className="text-gray-600 dark:text-gray-400">Calculate fair ride cost sharing for your passengers</p>
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
                    Driver Benefits
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    As a driver, the Cost Split Calculator helps you determine a fair price for each passenger while
                    covering your expenses.
                  </p>

                  <div className="space-y-3">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <h3 className="font-medium text-sm mb-1">Cost Recovery</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Recover your fuel costs and vehicle maintenance expenses by fairly splitting them among
                        passengers.
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <h3 className="font-medium text-sm mb-1">Transparent Pricing</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Show passengers exactly how their contribution is calculated, building trust and satisfaction.
                      </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <h3 className="font-medium text-sm mb-1">Optimize Earnings</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Find the sweet spot between affordability for passengers and fair compensation for your service.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="font-medium text-sm mb-2">How to Use</h3>
                    <ul className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
                      <li className="flex items-start">
                        <span className="text-hopin-orange mr-2">1.</span>
                        <span>Enter your total fuel cost for the trip</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hopin-orange mr-2">2.</span>
                        <span>Input the total distance in kilometers</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hopin-orange mr-2">3.</span>
                        <span>Set the number of passengers (excluding yourself)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-hopin-orange mr-2">4.</span>
                        <span>Share the calculated per-person cost with your passengers</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Driver Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">💰</span>
                      <span className="text-sm">Consider adding a small service fee for your time and effort</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">🚗</span>
                      <span className="text-sm">Factor in vehicle depreciation for longer trips</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">📊</span>
                      <span className="text-sm">Keep track of your earnings and expenses for tax purposes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-hopin-orange mr-2">🤝</span>
                      <span className="text-sm">Communicate the cost breakdown clearly to passengers</span>
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
