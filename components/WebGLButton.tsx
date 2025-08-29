"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { forwardRef } from "react"

interface WebGLButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  children: React.ReactNode
  loading?: boolean
}

export const WebGLButton = forwardRef<HTMLButtonElement, WebGLButtonProps>(
  ({ className, variant = "default", size = "default", children, loading, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          ref={ref}
          variant={variant}
          size={size}
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            "hover:shadow-lg hover:shadow-blue-500/25",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
            loading && "cursor-not-allowed opacity-50",
            className
          )}
          {...props}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
          />
          
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-4 w-4 border-2 border-current border-t-transparent rounded-full"
              />
            )}
            {children}
          </span>
        </Button>
      </motion.div>
    )
  }
)

WebGLButton.displayName = "WebGLButton"