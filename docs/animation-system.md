# Animation System Documentation

## Overview

This document describes the new animation system implemented for the RenThing application. The system provides a consistent, performant, and accessible animation experience across all components while respecting user preferences.

## Animation Tokens

The system uses predefined animation tokens for consistency:

```typescript
// lib/animation-tokens.ts
export const animationTokens = {
  duration: {
    fast: 150,      // Immediate feedback
    normal: 300,    // Standard transitions
    slow: 500,      // Page transitions
  },
  easing: {
    standard: [0.4, 0, 0.2, 1],      // Default easing
    accelerate: [0.4, 0, 1, 1],      // Entrance animations
    decelerate: [0, 0, 0.2, 1],      // Exit animations
  },
};
```

## Animation Variants

Predefined animation variants are available for common UI elements:

```typescript
export const animationVariants = {
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
  card: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    whileHover: { y: -8 },
    transition: { duration: 0.3 },
  },
  button: {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.98 },
    transition: { type: "spring", stiffness: 500, damping: 30 },
  },
  modal: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
    transition: { type: "spring", stiffness: 300, damping: 30 },
  },
  skeleton: {
    animate: { opacity: [0.5, 1, 0.5] },
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
  },
};
```

## Components

### AnimatedWrapper Component

A reusable component that applies animations to any content:

```tsx
import { AnimatedWrapper } from "@/components/ui/animated-wrapper";

// Basic usage
<AnimatedWrapper variant="page">
  <div>Your content here</div>
</AnimatedWrapper>

// With delay for staggered animations
<AnimatedWrapper variant="card" delay={0.1}>
  <div>Card content</div>
</AnimatedWrapper>
```

### useReducedMotion Hook

A hook that detects if the user prefers reduced motion:

```tsx
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const MyComponent = () => {
  const prefersReducedMotion = useReducedMotion();
  
  // Use this to disable animations when needed
  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { y: [0, -5, 0] }}
      transition={prefersReducedMotion ? {} : { duration: 2, repeat: Infinity }}
    >
      Content
    </motion.div>
  );
};
```

## Implementation Guidelines

### Performance

1. Use hardware-accelerated properties (`transform`, `opacity`) for animations
2. Limit simultaneous animations to 5-7 elements
3. Use `will-change` property for complex animations
4. Implement animation queuing for list items

### Accessibility

1. Always respect the `prefers-reduced-motion` media query
2. Provide alternative visual feedback when animations are disabled
3. Ensure all functionality is accessible without animations
4. Maintain clear focus indicators during animations

### Consistency

1. Use the predefined animation tokens and variants
2. Apply the same easing functions throughout the application
3. Maintain consistent timing across similar interactions
4. Use the AnimatedWrapper component for common animation patterns

## Examples

### Page Transitions

```tsx
<AnimatedWrapper variant="page">
  <YourPageContent />
</AnimatedWrapper>
```

### Staggered Card Animations

```tsx
<div className="grid grid-cols-3 gap-4">
  {items.map((item, index) => (
    <AnimatedWrapper key={item.id} variant="card" delay={index * 0.05}>
      <Card>{item.content}</Card>
    </AnimatedWrapper>
  ))}
</div>
```

### Button Animations

```tsx
<motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.98 }}
  transition={{ type: "spring", stiffness: 500, damping: 30 }}
>
  Click me
</motion.button>
```

## Best Practices

1. Every animation should serve a functional purpose
2. Test animations on all supported browsers and devices
3. Monitor performance and adjust as needed
4. Document new animation patterns in this guide
5. Use the existing components and utilities rather than creating new ones