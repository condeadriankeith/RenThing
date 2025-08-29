"use client"

import { useState } from "react"
import { WebGLButton } from "./WebGLButton"
import { WebGLProductCard } from "./WebGLProductCard"
import { motion } from "framer-motion"
import { animationVariants } from "./AnimationProvider"

export function AnimationDemo() {
  const [showDemo, setShowDemo] = useState(false)

  const demoListings = [
    {
      id: "1",
      title: "Professional Camera Kit",
      price: 2500,
      location: "Makati",
      rating: 4.8,
      image: "/professional-camera-kit.png",
      category: "Photography"
    },
    {
      id: "2",
      title: "Tesla Model 3",
      price: 3500,
      location: "BGC",
      rating: 4.9,
      image: "/white-tesla-model-3.png",
      category: "Automotive"
    },
    {
      id: "3",
      title: "Cordless Drill Set",
      price: 800,
      location: "Quezon City",
      rating: 4.5,
      image: "/cordless-drill.png",
      category: "Tools"
    }
  ]

  return (
    <div className="p-8 space-y-8">
      <motion.div
        {...animationVariants.fadeIn}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          WebGL-Enhanced 2D Animations
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experience smoother, hardware-accelerated 2D animations powered by WebGL through framer-motion
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <motion.div
          {...animationVariants.slideIn}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold">Interactive Buttons</h2>
          <div className="space-y-3">
            <WebGLButton onClick={() => setShowDemo(!showDemo)}>
              Toggle Demo
            </WebGLButton>
            <WebGLButton variant="destructive" loading={showDemo}>
              Loading State
            </WebGLButton>
            <WebGLButton variant="outline">
              Outline Style
            </WebGLButton>
          </div>
        </motion.div>

        <motion.div
          {...animationVariants.scaleIn}
          className="space-y-4"
        >
          <h2 className="text-2xl font-semibold">Animation Controls</h2>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-600">
              Current State: {showDemo ? "Demo Active" : "Demo Inactive"}
            </p>
          </div>
        </motion.div>
      </div>

      {showDemo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center">Enhanced Product Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {demoListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <WebGLProductCard
                  listing={listing}
                  onClick={() => console.log(`Clicked: ${listing.title}`)}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}