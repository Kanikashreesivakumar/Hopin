"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CostCalculatorProps {
  className?: string
}

export default function CostCalculator({ className }: CostCalculatorProps) {
  const [fuelCost, setFuelCost] = useState(500)
  const [distance, setDistance] = useState(25)
  const [passengers, setPassengers] = useState(3)
  const [costPerPerson, setCostPerPerson] = useState(0)
  const [costPerKm, setCostPerKm] = useState(0)
  const [totalSavings, setTotalSavings] = useState(0)

  useEffect(() => {
    // Calculate cost per person
    const perPerson = fuelCost / passengers
    setCostPerPerson(perPerson)

    // Calculate cost per km
    const perKm = fuelCost / distance
    setCostPerKm(perKm)

    // Calculate total savings (what would have been paid if everyone drove separately)
    const savings = fuelCost * (passengers - 1)
    setTotalSavings(savings)
  }, [fuelCost, distance, passengers])

  return (
    <Card className={`hopin-card ${className}`}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Fuel Cost (₹)</Label>
            <Input
              type="number"
              className="hopin-input"
              placeholder="500"
              value={fuelCost}
              onChange={(e) => setFuelCost(Number(e.target.value))}
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Distance (km)</Label>
            <Input
              type="number"
              className="hopin-input"
              placeholder="25"
              value={distance}
              onChange={(e) => setDistance(Number(e.target.value))}
              min={0}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Number of Passengers</Label>
            <span className="text-sm font-medium text-hopin-orange">{passengers}</span>
          </div>
          <Slider
            value={[passengers]}
            min={1}
            max={6}
            step={1}
            onValueChange={(value) => setPassengers(value[0])}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="pt-4"
        >
          <div className="bg-hopin-orange/10 rounded-lg p-6 text-center">
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cost per Person</div>
            <div className="text-3xl font-bold text-hopin-orange">₹ {costPerPerson.toFixed(2)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Based on equal split among {passengers} passengers
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 text-center text-sm">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-gray-600 dark:text-gray-400">Cost per km</div>
            <div className="font-semibold">₹ {costPerKm.toFixed(2)}</div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-gray-600 dark:text-gray-400">Total Savings</div>
            <div className="font-semibold text-green-600">₹ {totalSavings.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
