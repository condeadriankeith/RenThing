"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { animationVariants } from "@/lib/animation-tokens";

interface AnimatedWrapperProps {
  children: React.ReactNode;
  variant?: "page" | "card" | "button" | "modal" | "skeleton";
  className?: string;
  delay?: number;
  [key: string]: any;
}

export function AnimatedWrapper({
  children,
  variant = "page",
  className,
  delay = 0,
  ...props
}: AnimatedWrapperProps) {
  const prefersReducedMotion = useReducedMotion();
  
  // Get the appropriate animation variant
  const variantConfig = animationVariants[variant] || animationVariants.page;
  
  // Modify transition for delay if provided
  const transition = delay > 0 
    ? { ...variantConfig.transition, delay } 
    : variantConfig.transition;
  
  // For reduced motion, we simplify animations
  const reducedMotionVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? reducedMotionVariants.initial : variantConfig.initial}
      animate={prefersReducedMotion ? reducedMotionVariants.animate : variantConfig.animate}
      exit={prefersReducedMotion ? reducedMotionVariants.exit : variantConfig.exit}
      transition={prefersReducedMotion ? { duration: 0.1 } : transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}