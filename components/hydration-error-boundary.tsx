"use client"

import React from 'react'

interface HydrationErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface HydrationErrorBoundaryProps {
  children: React.ReactNode
}

class HydrationErrorBoundary extends React.Component<
  HydrationErrorBoundaryProps,
  HydrationErrorBoundaryState
> {
  constructor(props: HydrationErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): HydrationErrorBoundaryState {
    // Check if it's a hydration error
    if (error.message.includes('hydration') || error.message.includes('Hydration')) {
      console.warn('Hydration error caught and handled:', error.message)
      return { hasError: true, error }
    }
    // For other errors, let them bubble up
    throw error
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log hydration errors but don't crash the app
    if (error.message.includes('hydration') || error.message.includes('Hydration')) {
      console.warn('Hydration error details:', { error, errorInfo })
    }
  }

  render() {
    if (this.state.hasError) {
      // Force a client-side re-render to fix hydration issues
      return (
        <div suppressHydrationWarning>
          {this.props.children}
        </div>
      )
    }

    return this.props.children
  }
}

export default HydrationErrorBoundary