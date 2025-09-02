import * as React from "react"
import { cn } from "@/lib/utils"

interface SpinnerLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: 'text-sm',   // 14px
  md: 'text-lg',   // 18px  
  lg: 'text-2xl',  // 24px
  xl: 'text-4xl'   // 36px
}

export function SpinnerLoader({ size = 'md', className }: SpinnerLoaderProps) {
  return (
    <div className={cn("spinner", sizeMap[size], className)}>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
      <div className="spinner-blade"></div>
    </div>
  )
}

export default SpinnerLoader