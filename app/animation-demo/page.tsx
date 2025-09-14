"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedWrapper } from "@/components/ui/animations";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export default function AnimationDemoPage() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <AnimatedWrapper variant="page">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Animation Demo</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Demonstrating the new animation system
            </p>
            {prefersReducedMotion && (
              <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg inline-block">
                Reduced motion is enabled in your system preferences
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <AnimatedWrapper key={item} variant="card" delay={index * 0.1}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Card {item}</CardTitle>
                    <CardDescription>Animated card component</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400">
                      This card demonstrates the staggered entrance animation.
                    </p>
                  </CardContent>
                </Card>
              </AnimatedWrapper>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <AnimatedWrapper variant="button">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg">Hover Me</Button>
              </motion.div>
            </AnimatedWrapper>
            
            <AnimatedWrapper variant="button" delay={0.1}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg">Hover Me Too</Button>
              </motion.div>
            </AnimatedWrapper>
            
            <AnimatedWrapper variant="button" delay={0.2}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="secondary" size="lg">And Me</Button>
              </motion.div>
            </AnimatedWrapper>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Modal Animation</CardTitle>
                <CardDescription>Example of modal entrance animation</CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatedWrapper variant="modal">
                  <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-gray-700 dark:text-gray-300">
                      This content is animated with the modal variant, which includes scale and opacity transitions.
                    </p>
                  </div>
                </AnimatedWrapper>
              </CardContent>
            </Card>
          </div>
        </AnimatedWrapper>
      </div>
    </div>
  );
}