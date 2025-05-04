"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PrivacyPage() {
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
              Privacy Policy
            </motion.h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose dark:prose-invert max-w-none"
          >
            <h2>1. Information We Collect</h2>
            <p>We collect information that you provide directly to us:</p>
            <ul>
              <li>Personal identification information</li>
              <li>Contact information</li>
              <li>Payment details</li>
              <li>Location data</li>
              <li>Device information</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use the collected information for:</p>
            <ul>
              <li>Providing our services</li>
              <li>Processing payments</li>
              <li>Improving user experience</li>
              <li>Communication about services</li>
              <li>Safety and security</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>
              We share information only as described in this policy and with:
            </p>
            <ul>
              <li>Service providers</li>
              <li>Legal authorities when required</li>
              <li>Other users as needed for rides</li>
            </ul>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information.
            </p>

            <h2>5. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to data processing</li>
            </ul>

            <h2>6. Cookies</h2>
            <p>
              We use cookies to improve user experience and analyze website traffic.
            </p>

            <h2>7. Third-Party Services</h2>
            <p>
              Our service may contain links to third-party websites. We are not responsible for their privacy practices.
            </p>

            <h2>8. Changes to Privacy Policy</h2>
            <p>
              We may update this privacy policy. Users will be notified of significant changes.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              For questions about this privacy policy, please contact us at privacy@hopin.com
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}