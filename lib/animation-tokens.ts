// Animation tokens based on the design document
export const animationTokens = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    standard: [0.4, 0, 0.2, 1],
    accelerate: [0.4, 0, 1, 1],
    decelerate: [0, 0, 0.2, 1],
  },
};

// Animation variants for Framer Motion
export const animationVariants = {
  page: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
    },
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