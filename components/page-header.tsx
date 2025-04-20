"use client"

import { motion } from "framer-motion"

interface PageHeaderProps {
  title: string
  description: string
  icon?: string
}

export default function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="mb-12 text-center">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {icon && <span className="inline-block text-4xl mb-4">{icon}</span>}
        <h1 className="text-3xl md:text-4xl font-bold mb-3">{title}</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{description}</p>
      </motion.div>
    </div>
  )
}
