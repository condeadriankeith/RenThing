"use client"

import { motion, AnimatePresence } from "framer-motion"
import { createContext, useContext, ReactNode } from "react"

interface AnimationContextType {
  enableWebGLAnimations: boolean
}

const AnimationContext = createContext<AnimationContextType>({
  enableWebGLAnimations: true,
})

export function useAnimations() {
  return useContext(AnimationContext)
}

interface AnimationProviderProps {
  children: ReactNode
  enableWebGLAnimations?: boolean
}

export function AnimationProvider({ 
  children, 
  enableWebGLAnimations = true 
}: AnimationProviderProps) {
  return (
    <AnimationContext.Provider value={{ enableWebGLAnimations }}>
      <AnimatePresence>
        {children}
      </AnimatePresence>
    </AnimationContext.Provider>
  )
}

// Utility animation variants for consistent 2D WebGL animations
export const animationVariants = {
  fadeIn: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: "easeOut" }
  },
  
  slideIn: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
    transition: { duration: 0.4, ease: "easeOut" }
  },
  
  scaleIn: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
    transition: { duration: 0.2, ease: "easeOut" }
  },
  
  staggerChildren: {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }
}

// Hook for optimized 2D WebGL animations
export function useWebGLAnimation() {
  const { enableWebGLAnimations } = useAnimations()
  
  return {
    shouldAnimate: enableWebGLAnimations,
    transition: enableWebGLAnimations ? 
      { type: "spring", stiffness: 300, damping: 30 } : 
      { duration: 0.2 }
  }
}