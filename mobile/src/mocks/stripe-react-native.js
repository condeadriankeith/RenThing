module.exports = {
  CardField: () => null,
  useStripe: () => ({
    confirmPayment: () => Promise.resolve({ error: { message: 'Stripe not available on web.' } }),
  }),
  // Add other exports that might be used from @stripe/stripe-react-native if needed
};