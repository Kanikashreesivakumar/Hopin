"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, DollarSign, Users, Car } from "lucide-react"

interface CostCalculatorProps {
  className?: string
  initialValues?: {
    fuelCost?: number
    distance?: number
    passengers?: number
  }
  onCalculate?: (result: {
    costPerPerson: number
    costPerKm: number
    totalSavings: number
  }) => void
}

export default function CostSplitCalculator({ className = "", initialValues, onCalculate }: CostCalculatorProps) {

  const [costPerKmInput, setCostPerKmInput] = useState(initialValues?.fuelCost || 20)
  const [distance, setDistance] = useState(initialValues?.distance || 25)
  const [passengers, setPassengers] = useState(initialValues?.passengers || 3)

  
  const [costPerPerson, setCostPerPerson] = useState(0)
  const [costPerKm, setCostPerKm] = useState(0)
  const [totalSavings, setTotalSavings] = useState(0)
  const [isCalculating, setIsCalculating] = useState(false)


  const calculateCosts = () => {
    setIsCalculating(true)
    setTimeout(() => {
      const totalCost = costPerKmInput * distance
      const perPerson = passengers > 0 ? totalCost / passengers : 0
      setCostPerPerson(perPerson)
      setCostPerKm(costPerKmInput)
      const savings = totalCost * (passengers - 1)
      setTotalSavings(savings)
      if (onCalculate) {
        onCalculate({
          costPerPerson: perPerson,
          costPerKm: costPerKmInput,
          totalSavings: savings,
        })
      }
      setIsCalculating(false)
    }, 300)
  }


  useEffect(() => {
    calculateCosts()
    
  }, [])

  return (
    <Card className={`shadow-md ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2 text-hopin-orange" />
          Cost Split Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <DollarSign className="h-4 w-4 mr-1 text-hopin-orange" />
              Cost per km (₹)
            </Label>
            <Input
              type="number"
              className="focus-visible:ring-hopin-orange"
              placeholder="20"
              value={costPerKmInput}
              onChange={e => setCostPerKmInput(Number(e.target.value) || 0)}
              min={0}
            />
          </div>
          <div className="space-y-2">
            <Label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Car className="h-4 w-4 mr-1 text-hopin-orange" />
              Distance (km)
            </Label>
            <Input
              type="number"
              className="focus-visible:ring-hopin-orange"
              placeholder="25"
              value={distance}
              onChange={e => setDistance(Number(e.target.value) || 0)}
              min={0}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <Users className="h-4 w-4 mr-1 text-hopin-orange" />
              Number of Passengers
            </Label>
            <span className="text-sm font-medium text-hopin-orange">{passengers}</span>
          </div>
          <Slider
            value={[passengers]}
            min={1}
            max={6}
            step={1}
            onValueChange={value => setPassengers(value[0])}
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
            <div className="text-3xl font-bold text-hopin-orange">
              {isCalculating ? (
                <span className="inline-block w-24 h-10 bg-hopin-orange/20 rounded animate-pulse"></span>
              ) : (
                `₹ ${costPerPerson.toFixed(2)}`
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Based on equal split among {passengers} passengers
            </div>
          </div>
        </motion.div>
        <div className="grid grid-cols-2 gap-4 text-center text-sm">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-gray-600 dark:text-gray-400">Cost per km</div>
            <div className="font-semibold">
              {isCalculating ? (
                <span className="inline-block w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
              ) : (
                `₹ ${costPerKm.toFixed(2)}`
              )}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-gray-600 dark:text-gray-400">Total Savings</div>
            <div className="font-semibold text-green-600">
              {isCalculating ? (
                <span className="inline-block w-16 h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></span>
              ) : (
                `₹ ${totalSavings.toFixed(2)}`
              )}
            </div>
          </div>
        </div>
        <Button onClick={calculateCosts} className="w-full bg-hopin-orange hover:bg-hopin-orange-dark text-white">
          Recalculate
        </Button>
      </CardContent>
    </Card>
  )
}
