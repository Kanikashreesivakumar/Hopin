"use client"

import { motion } from "framer-motion"

interface LogoProps {
  size?: "small" | "medium" | "large"
  variant?: "default" | "white"
}

export default function Logo({ size = "medium", variant = "default" }: LogoProps) {
  const sizeClasses = {
    small: "h-8",
    medium: "h-10",
    large: "h-20",
  }

  const textSizeClasses = {
    small: "text-lg",
    medium: "text-xl",
    large: "text-4xl",
  }

  const textColorClass = variant === "white" ? "text-white" : "text-gray-900 dark:text-white"

  return (
    <div className="flex items-center">
      <div className={`relative ${sizeClasses[size]}`}>
        <svg viewBox="0 0 100 100" className={`${sizeClasses[size]} w-auto`} xmlns="http://www.w3.org/2000/svg">
          
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill={variant === "white" ? "#FFFFFF" : "#FFA500"}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

         
          <motion.path
            d="M30 55C30 50 35 50 40 50H60C65 50 70 50 70 55V65H30V55Z"
            fill={variant === "white" ? "#FFA500" : "#FFFFFF"}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />

         
          <motion.circle
            cx="40"
            cy="65"
            r="5"
            fill="#333333"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
          <motion.circle
            cx="60"
            cy="65"
            r="5"
            fill="#333333"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />

          <motion.path
            d="M50 20C42 20 35 27 35 35C35 45 50 60 50 60C50 60 65 45 65 35C65 27 58 20 50 20ZM50 40C47 40 45 38 45 35C45 32 47 30 50 30C53 30 55 32 55 35C55 38 53 40 50 40Z"
            fill={variant === "white" ? "#FFA500" : "#FFFFFF"}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </svg>
      </div>

      <motion.span
        className={`ml-2 font-bold ${textColorClass} ${textSizeClasses[size]}`}
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        HOPIN
      </motion.span>
    </div>
  )
}
