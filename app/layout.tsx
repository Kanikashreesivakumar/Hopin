import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AIChatbot from "@/components/ai-chatbot"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HOPIN - AI-Powered Event Ride-Sharing",
  description: "Find your next event ride with HOPIN",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main>{children}</main>
          <AIChatbot />
        </ThemeProvider>
      </body>
    </html>
  )
}
