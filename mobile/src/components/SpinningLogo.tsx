import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';
import Svg, { Circle, Text, Defs, LinearGradient, Stop } from 'react-native-svg';

interface SpinningLogoProps {
  size?: number;
  color?: string;
}

export const SpinningLogo: React.FC<SpinningLogoProps> = ({ 
  size = 40, 
  color = "#3B82F6" 
}) => {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    const spin = () => {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    };
    spin();
  }, []);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={{ width: size, height: size }}>
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
        >
          <Defs>
            <LinearGradient id="renthing-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#3B82F6" />
              <Stop offset="50%" stopColor="#1D4ED8" />
              <Stop offset="100%" stopColor="#1E40AF" />
            </LinearGradient>
          </Defs>
          <Circle 
            cx="60" 
            cy="60" 
            r="50" 
            fill="none" 
            stroke="url(#renthing-gradient)" 
            strokeWidth="4" 
            strokeDasharray="70 30"
          />
          <Text 
            x="60" 
            y="68" 
            textAnchor="middle" 
            fill="url(#renthing-gradient)" 
            fontSize="20" 
            fontWeight="bold"
            fontFamily="system-ui, -apple-system, sans-serif"
          >
            R
          </Text>
        </Svg>
      </Animated.View>
    </View>
  );
};