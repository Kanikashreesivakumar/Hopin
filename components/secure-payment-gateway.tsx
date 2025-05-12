"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Calendar, Check, CreditCard, Lock, Shield, User, Wallet } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SecurePaymentGatewayProps {
  amount: number
  currency?: string
  onPaymentComplete?: (paymentInfo: PaymentInfo) => void
  onCancel?: () => void
  paymentMethods?: string[]
  showSummary?: boolean
  summaryDetails?: RideSummary
}

interface PaymentInfo {
  paymentMethod: string
  cardNumber?: string
  cardholderName?: string
  expiryDate?: string
  cvv?: string
  billingAddress?: string
  tokenizedData?: string
}

interface RideSummary {
  eventName: string
  driverName: string
  pickupPoint: string
  date: string
  time: string
  costPerSeat: number
  serviceFee: number
  total: number
}

export default function SecurePaymentGateway({
  amount,
  currency = "USD",
  onPaymentComplete,
  onCancel,
  paymentMethods = ["card", "wallet"],
  showSummary = true,
  summaryDetails,
}: SecurePaymentGatewayProps) {
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [cardNumber, setCardNumber] = useState("")
  const [cardholderName, setCardholderName] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvc, setCvc] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSecure, setIsSecure] = useState(true)
  const [cardType, setCardType] = useState<string | null>(null)
  const [tokenizedCard, setTokenizedCard] = useState<string | null>(null)
  const [fraudScore, setFraudScore] = useState<number | null>(null)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  // Detect card type based on number
  useEffect(() => {
    if (cardNumber.startsWith("4")) {
      setCardType("visa")
    } else if (cardNumber.startsWith("5")) {
      setCardType("mastercard")
    } else if (cardNumber.startsWith("3")) {
      setCardType("amex")
    } else if (cardNumber.startsWith("6")) {
      setCardType("discover")
    } else {
      setCardType(null)
    }
  }, [cardNumber])

  // Simulate tokenization when card details are complete
  useEffect(() => {
    if (cardNumber.length >= 16 && cardholderName.length > 3 && expiry.length === 5 && cvc.length >= 3) {
      // In a real implementation, this would call a secure API to tokenize the card
      const mockToken = `tok_${Math.random().toString(36).substring(2, 10)}`
      setTokenizedCard(mockToken)

      // Simulate fraud detection score (0-100, higher is riskier)
      const mockFraudScore = Math.floor(Math.random() * 30) // Low score for demo
      setFraudScore(mockFraudScore)

      // Clear any previous errors
      setPaymentError(null)
    } else {
      setTokenizedCard(null)
      setFraudScore(null)
    }
  }, [cardNumber, cardholderName, expiry, cvc])

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value)
    setCardNumber(formattedValue)
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")

    if (value.length > 2) {
      value = value.substring(0, 2) + "/" + value.substring(2, 4)
    }

    setExpiry(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentError(null)

    // Validate card details
    if (paymentMethod === "card") {
      if (!cardNumber || !cardholderName || !expiry || !cvc) {
        setPaymentError("Please fill in all card details")
        return
      }

      if (!tokenizedCard) {
        setPaymentError("Card details could not be processed")
        return
      }
    }

    setIsProcessing(true)

    // Simulate payment processing with a small chance of failure
    setTimeout(() => {
      const isSuccessful = Math.random() > 0.1 // 90% success rate

      if (isSuccessful) {
        setPaymentSuccess(true)

        setTimeout(() => {
          setIsProcessing(false)

          if (onPaymentComplete) {
            onPaymentComplete({
              paymentMethod,
              cardNumber: cardNumber.replace(/\s/g, ""),
              cardholderName,
              expiryDate: expiry,
              cvv: cvc,
              tokenizedData: tokenizedCard || undefined,
            })
          }
        }, 1000)
      } else {
        setIsProcessing(false)
        setPaymentError("Payment failed. Please try again or use a different payment method.")
      }
    }, 2000)
  }

  const getFraudRiskLevel = () => {
    if (fraudScore === null) return null
    if (fraudScore < 20) return "low"
    if (fraudScore < 50) return "medium"
    return "high"
  }

  const riskLevel = getFraudRiskLevel()

  return (
    <div className="w-full">
      {paymentSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700 shadow-lg">
            <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Your payment of {currency} {amount.toFixed(2)} has been processed successfully.
              </p>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6 w-full max-w-md">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Payment method:</span>
                  <span className="font-medium">
                    {paymentMethod === "card"
                      ? `${cardType?.toUpperCase() || "Card"} •••• ${cardNumber.slice(-4)}`
                      : "Digital Wallet"}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-medium">
                    {currency} {amount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                  <span className="font-medium">TXN_{Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
                </div>
              </div>
              <Button
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                onClick={() => {
                  if (onPaymentComplete) {
                    onPaymentComplete({
                      paymentMethod,
                      cardNumber: cardNumber.replace(/\s/g, ""),
                      cardholderName,
                      expiryDate: expiry,
                      cvv: cvc,
                      tokenizedData: tokenizedCard || undefined,
                    })
                  }
                }}
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
          {paymentError && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4 mr-2" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{paymentError}</AlertDescription>
              </Alert>
            </motion.div>
          )}

          <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="card" disabled={!paymentMethods.includes("card")}>
                <CreditCard className="h-4 w-4 mr-2" />
                Credit Card
              </TabsTrigger>
              <TabsTrigger value="wallet" disabled={!paymentMethods.includes("wallet")}>
                <Wallet className="h-4 w-4 mr-2" />
                Digital Wallet
              </TabsTrigger>
            </TabsList>

            <TabsContent value="card">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700 shadow-lg">
                <form onSubmit={handleSubmit}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Payment Details</CardTitle>
                        <CardDescription>Enter your card information securely</CardDescription>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Badge
                          variant="default"
                          className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                        >
                          <Lock className="h-3 w-3 mr-1" />
                          PCI DSS
                        </Badge>
                        <Badge
                          variant="default"
                          className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                        >
                          <Shield className="h-3 w-3 mr-1" />
                          Secure
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="relative h-44 w-full perspective">
                      <motion.div
                        className={`absolute inset-0 rounded-xl p-6 shadow-md bg-gradient-to-br ${
                          cardType === "visa"
                            ? "from-blue-500 to-blue-700"
                            : cardType === "mastercard"
                              ? "from-red-500 to-orange-500"
                              : cardType === "amex"
                                ? "from-indigo-500 to-indigo-700"
                                : cardType === "discover"
                                  ? "from-orange-500 to-orange-700"
                                  : "from-gray-700 to-gray-900"
                        } text-white flex flex-col justify-between`}
                        initial={{ rotateY: 0 }}
                        animate={{ rotateY: cvc.length > 0 ? 180 : 0 }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                      >
                        <div>
                          <div className="flex justify-between items-start">
                            <div className="text-xs opacity-80">Secure Payment</div>
                            {cardType && <div className="text-right font-bold uppercase">{cardType}</div>}
                          </div>
                          <div className="mt-6">
                            <div className="h-8 w-12 rounded bg-yellow-200 mb-6"></div>
                            <div className="font-mono text-xl tracking-wider">
                              {cardNumber || "•••• •••• •••• ••••"}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-xs opacity-80">Card Holder</div>
                            <div className="font-medium truncate max-w-[150px]">{cardholderName || "YOUR NAME"}</div>
                          </div>
                          <div>
                            <div className="text-xs opacity-80">Expires</div>
                            <div>{expiry || "MM/YY"}</div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Card back */}
                      <motion.div
                        className="absolute inset-0 rounded-xl p-6 shadow-md bg-gradient-to-br from-gray-700 to-gray-900 text-white"
                        initial={{ rotateY: 180 }}
                        animate={{ rotateY: cvc.length > 0 ? 0 : 180 }}
                        transition={{ duration: 0.6 }}
                        style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
                      >
                        <div className="h-10 bg-gray-800 mt-6"></div>
                        <div className="mt-6 flex justify-end">
                          <div className="bg-white h-8 w-16 flex items-center justify-center">
                            <span className="text-gray-900 font-mono">{cvc || "CVC"}</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>

                    <div>
                      <Label htmlFor="card-number">Card Number</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          className="pl-9"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          maxLength={19}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="card-name">Cardholder Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="card-name"
                          placeholder="Jenisha"
                          className="pl-9"
                          value={cardholderName}
                          onChange={(e) => setCardholderName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            className="pl-9"
                            value={expiry}
                            onChange={handleExpiryChange}
                            maxLength={5}
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="cvc">CVC</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="cvc"
                            placeholder="123"
                            className="pl-9"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value.replace(/\D/g, "").substring(0, 3))}
                            maxLength={3}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {tokenizedCard && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert
                          variant="default"
                          className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                        >
                          <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                          <AlertTitle className="text-green-800 dark:text-green-400 text-sm font-medium">
                            Card Tokenized
                          </AlertTitle>
                          <AlertDescription className="text-green-700 dark:text-green-500 text-xs">
                            Your card details are securely tokenized and not stored on our servers.
                          </AlertDescription>
                        </Alert>
                      </motion.div>
                    )}

                    {riskLevel && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">Fraud Detection:</span>
                        <Badge
                          variant="outline"
                          className={`
                          ${
                            riskLevel === "low"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                              : riskLevel === "medium"
                                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800"
                                : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800"
                          }
                        `}
                        >
                          {riskLevel === "low" ? (
                            <Check className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertCircle className="h-3 w-3 mr-1" />
                          )}
                          {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} Risk
                        </Badge>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex flex-col space-y-4">
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      disabled={isProcessing || !tokenizedCard}
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
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
                          Processing...
                        </div>
                      ) : (
                        `Pay ${currency} ${amount.toFixed(2)}`
                      )}
                    </Button>
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 flex items-center justify-center">
                      <Lock className="inline h-3 w-3 mr-1" />
                      Your payment information is secure and encrypted
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="wallet">
              <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border border-gray-100 dark:border-gray-700 shadow-lg">
                <CardHeader>
                  <CardTitle>Digital Wallet</CardTitle>
                  <CardDescription>Choose your preferred digital wallet</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <svg className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#000" />
                        <path d="M9 9.5H15M9 14.5H15" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      Apple Pay
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <svg className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#4285F4" />
                        <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      Google Pay
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <svg className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#0070BA" />
                        <path d="M8 12H16M12 8V16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      PayPal
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                      <svg className="h-6 w-6 mb-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="#6772E5" />
                        <path d="M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      Venmo
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    onClick={() => {
                      setIsProcessing(true)
                      setTimeout(() => {
                        setPaymentSuccess(true)
                        setIsProcessing(false)
                      }, 2000)
                    }}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
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
                        Processing...
                      </div>
                    ) : (
                      `Pay ${currency} ${amount.toFixed(2)}`
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          {showSummary && summaryDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6"
            >
              <Card className="backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Booking Summary</h3>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Event</h4>
                      <p className="font-medium">{summaryDetails.eventName}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Driver</h4>
                      <p className="font-medium">{summaryDetails.driverName}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pickup Location</h4>
                      <p className="font-medium">{summaryDetails.pickupPoint}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date</h4>
                        <p className="font-medium">{summaryDetails.date}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Time</h4>
                        <p className="font-medium">{summaryDetails.time}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Ride cost</span>
                      <span>${summaryDetails.costPerSeat.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Service fee</span>
                      <span>${summaryDetails.serviceFee.toFixed(2)}</span>
                    </div>

                    <Separator className="my-2" />

                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${summaryDetails.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-sm text-green-700 dark:text-green-400">
                      <p className="flex items-center">
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        You'll only be charged when the driver confirms your booking
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
