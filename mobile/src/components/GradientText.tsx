import React, { useEffect, useRef } from 'react';
import { Animated, Text, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientTextProps {
  children: React.ReactNode;
  style?: TextStyle;
  animated?: boolean;
}

export default function GradientText({ children, style, animated = true }: GradientTextProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: false,
          }),
        ])
      );
      animation.start();
      return () => animation.stop();
    }
  }, [animated, animatedValue]);

  // For now, use a simpler gradient effect without masking
  // This provides better compatibility across different React Native versions
  return (
    <LinearGradient
      colors={['#2563eb', '#7c3aed', '#dc2626']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        borderRadius: 4,
        paddingHorizontal: 2,
      }}
    >
      <Text style={[style, { color: 'white', fontWeight: 'bold' }]}>
        {children}
      </Text>
    </LinearGradient>
  );
}