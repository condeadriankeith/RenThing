"use client";

import React from "react";

interface SpinningLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export const SpinningLogo: React.FC<SpinningLogoProps> = ({ 
  className = "", 
  size = "md" 
}) => {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg 
        className="animate-spin"
        viewBox="0 0 120 120" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="renthing-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E40AF" />
          </linearGradient>
        </defs>
        <circle 
          cx="60" 
          cy="60" 
          r="50" 
          fill="none" 
          stroke="url(#renthing-gradient)" 
          strokeWidth="4" 
          strokeDasharray="70 30"
          className="animate-spin origin-center"
        />
        <text 
          x="60" 
          y="68" 
          textAnchor="middle" 
          fill="url(#renthing-gradient)" 
          fontSize="20" 
          fontWeight="bold"
          fontFamily="system-ui, -apple-system, sans-serif"
        >
          R
        </text>
      </svg>
    </div>
  );
};