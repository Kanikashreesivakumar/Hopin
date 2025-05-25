"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import PageHeader from "@/components/page-header"
import SecurePaymentGateway from "@/components/secure-payment-gateway"

export default function Payment() {
  const router = useRouter()

 
  const rideDetails = {
    eventName: "Spring Music Festival",
    driverName: "Alex Johnson",
    pickupPoint: "Student Union Building",
    date: "April 15, 2025",
    time: "5:30 PM",
    costPerSeat: 5.5,
    serviceFee: 0.5,
    total: 6.0,
  }

  const handlePaymentComplete = (paymentInfo: any) => {
    console.log("Payment completed:", paymentInfo)
    router.push("/track-ride")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <PageHeader title="Payment" description="Complete your booking with a secure payment" icon="💳" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3"
        >
          <SecurePaymentGateway
            amount={rideDetails.total}
            currency="USD"
            onPaymentComplete={handlePaymentComplete}
            paymentMethods={["card", "wallet"]}
            showSummary={true}
            summaryDetails={rideDetails}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="sticky top-24 space-y-6">
            <div className="bg-gradient-to-r from-green-500/10 via-violet-500/10 to-pink-500/10 dark:from-green-900/20 dark:via-violet-900/20 dark:to-pink-900/20 rounded-xl p-6 backdrop-blur-sm border border-white/20 dark:border-white/5 shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Payment Security</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">🔒</span>
                  <span className="text-sm">Your payment information is encrypted end-to-end</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">🛡️</span>
                  <span className="text-sm">We use tokenization to protect your card details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">🔍</span>
                  <span className="text-sm">Advanced fraud detection keeps your transactions safe</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-sm">PCI DSS compliant for maximum security standards</span>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg backdrop-blur-sm bg-opacity-70 dark:bg-opacity-70 border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                If you're having trouble with your payment or have questions about the booking process, our support team
                is here to help.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">📧</span>
                  <span className="text-sm">support@hopin.com</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">📞</span>
                  <span className="text-sm">(555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">💬</span>
                  <span className="text-sm">Live chat available 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
