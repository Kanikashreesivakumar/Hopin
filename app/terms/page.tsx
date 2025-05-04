"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Button
              variant="ghost"
              asChild
              className="mb-4"
            >
              <Link href="/auth">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Login
              </Link>
            </Button>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4"
            >
              Terms of Service
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose dark:prose-invert max-w-none"
          >
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using HOPIN's services, you agree to be bound by these Terms of Service.
            </p>

            <h2>2. Service Description</h2>
            <p>
              HOPIN provides a platform connecting drivers and passengers for event-based ridesharing services.
            </p>

            <h2>3. User Responsibilities</h2>
            <ul>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Comply with all applicable laws and regulations</li>
              <li>Treat other users with respect</li>
            </ul>

            <h2>4. Driver Requirements</h2>
            <ul>
              <li>Valid driver's license</li>
              <li>Vehicle insurance</li>
              <li>Clean driving record</li>
              <li>Vehicle maintenance standards</li>
            </ul>

            <h2>5. Passenger Guidelines</h2>
            <ul>
              <li>Accurate pickup locations</li>
              <li>Timely arrivals</li>
              <li>Respectful behavior</li>
              <li>Payment obligations</li>
            </ul>

            <h2>6. Payment Terms</h2>
            <p>
              All payments are processed securely through our platform. Drivers receive compensation as per our payment schedule.
            </p>

            <h2>7. Cancellation Policy</h2>
            <p>
              Users must provide reasonable notice for cancellations. Fees may apply for late cancellations.
            </p>

            <h2>8. Liability</h2>
            <p>
              HOPIN is not liable for indirect, incidental, special, or consequential damages.
            </p>

            <h2>9. Termination</h2>
            <p>
              We reserve the right to terminate or suspend accounts for violations of these terms.
            </p>

            <h2>10. Changes to Terms</h2>
            <p>
              We may update these terms. Users will be notified of significant changes.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}