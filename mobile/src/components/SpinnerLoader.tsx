import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface SpinnerLoaderProps {
  size?: number;
  color?: string;
}

export const SpinnerLoader: React.FC<SpinnerLoaderProps> = ({ 
  size = 28, 
  color = '#69717d' 
}) => {
  // Create animated values for each blade
  const animatedValues = useRef(
    Array.from({ length: 12 }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    // Create staggered fade animations for each blade
    const animations = animatedValues.map((animatedValue, index) => {
      const delay = (index * 83); // 83ms delay between each blade
      
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      );
    });

    // Start all animations
    Animated.parallel(animations).start();

    // Cleanup function
    return () => {
      animatedValues.forEach(value => value.stopAnimation());
    };
  }, [animatedValues]);

  const renderBlade = (index: number) => {
    const rotation = index * 30; // 30 degrees apart
    const animatedValue = animatedValues[index];
    
    const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0], // Fade from visible to transparent
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.blade,
          {
            transform: [{ rotate: `${rotation}deg` }],
            opacity,
            backgroundColor: color,
            width: size * 0.074 / 28 * size,
            height: size * 0.2777 / 28 * size,
            borderRadius: size * 0.0555 / 28 * size,
            left: size * 0.4629 / 28 * size,
            transformOrigin: `center ${-size * 0.2222 / 28 * size}px`,
          },
        ]}
      />
    );
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {Array.from({ length: 12 }, (_, index) => renderBlade(index))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  blade: {
    position: 'absolute',
    bottom: 0,
  },
});

export default SpinnerLoader;