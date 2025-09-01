import React, { useEffect } from 'react';
import { View, Animated } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

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
          viewBox="0 0 3000 3000"
        >
          <Defs>
            <LinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#3B82F6" />
              <Stop offset="50%" stopColor="#1D4ED8" />
              <Stop offset="100%" stopColor="#1E40AF" />
            </LinearGradient>
          </Defs>
          <Path 
            d="M0 0 C1.6460509 0.02028424 3.29231728 0.02985229 4.93847656 0.02246094 C16.39769358 -0.02716868 27.35245959 1.94564615 38.52978516 4.28271484 C39.23180054 4.42701935 39.93381592 4.57132385 40.65710449 4.72000122 C50.02500825 6.66874771 58.80038578 9.35515496 67.65478516 13.03271484 C69.4543759 13.74017775 71.25512505 14.44470248 73.05712891 15.14599609 C86.08388311 20.30625034 99.00401847 25.69226532 111.90478516 31.15771484 C123.54518542 36.08863001 135.19611191 40.90483757 147.04931641 45.30615234 C152.91487104 47.48453567 158.70747559 49.84126533 164.50878906 52.18408203 C169.36343494 54.13741935 174.23676339 55.99529354 179.15478516 57.78271484 C187.82725521 60.96029346 196.26213086 64.69378959 204.73681641 68.35888672 C216.61919937 73.48300602 228.62005836 78.2803304 240.65478516 83.03271484" 
            fill="url(#logoGradient)"
          />
        </Svg>
      </Animated.View>
    </View>
  );
};