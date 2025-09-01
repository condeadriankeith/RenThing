import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface RenThingLogoProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function RenThingLogo({ 
  width = 40, 
  height = 40, 
  color = '#2563eb' 
}: RenThingLogoProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Defs>
        <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#2563eb" />
          <Stop offset="50%" stopColor="#7c3aed" />
          <Stop offset="100%" stopColor="#dc2626" />
        </LinearGradient>
      </Defs>
      
      {/* Main R shape */}
      <Path
        d="M3 2h8c2.21 0 4 1.79 4 4v2c0 1.5-.81 2.77-2 3.46L16 18h-3l-2.5-6H6v6H3V2z M6 5v4h5c.55 0 1-.45 1-1V6c0-.55-.45-1-1-1H6z"
        fill={color === '#2563eb' ? "url(#logoGradient)" : color}
      />
      
      {/* Decorative elements */}
      <Path
        d="M18 4h2v2h-2V4z M18 8h2v2h-2V8z M20 6h2v2h-2V6z"
        fill={color === '#2563eb' ? "url(#logoGradient)" : color}
        opacity="0.6"
      />
    </Svg>
  );
}