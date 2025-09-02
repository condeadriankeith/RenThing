"use client"

import dynamic from 'next/dynamic'
import React from 'react'

interface NoSSRProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

// Component to prevent hydration issues
const NoSSR: React.FC<NoSSRProps> = ({ children, fallback = null }) => {
  return <>{children}</>
}

// Export as dynamic component with no SSR
export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
})