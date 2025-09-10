import React from 'react';
import { Image } from 'react-native';

interface RenThingLogoProps {
  width?: number;
  height?: number;
}

export default function RenThingLogo({ 
  width = 40, 
  height = 40 
}: RenThingLogoProps) {
  return (
    <Image
      source={require('../../assets/RenThing_Logo.png')}
      style={{ width, height }}
      resizeMode="contain"
    />
  );
}
