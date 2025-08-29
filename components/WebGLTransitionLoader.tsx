"use client"

import { useEffect, useRef } from "react"
import { motion, useAnimation } from "framer-motion"
import { ShoppingBag } from "lucide-react"

export default function WebGLTransitionLoader({ show = false }: { show?: boolean }) {
  const controls = useAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (show) {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3 }
      })
    } else {
      controls.start({
        opacity: 0,
        scale: 0.8,
        transition: { duration: 0.3 }
      })
    }
  }, [show, controls])

  if (!show) return null

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={controls}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-100/80 to-indigo-200/80 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm"
    >
      <div className="relative">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="flex flex-col items-center"
        >
          <ShoppingBag className="h-20 w-20 text-blue-600 drop-shadow-lg" />
        </motion.div>
        
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-32 h-32 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
        </motion.div>
        
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-lg font-bold text-blue-700 dark:text-white tracking-wide"
        >
          Loading...
        </motion.span>
      </div>
    </motion.div>
  )
}