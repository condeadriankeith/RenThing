"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface GeolocationContextType {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

const GeolocationContext = createContext<GeolocationContextType | undefined>(undefined);

export function GeolocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if geolocation is available
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    // Get current position
    const getPosition = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      setLoading(false);
    };

    const handleError = (err: GeolocationPositionError) => {
      setError(`Unable to retrieve your location: ${err.message}`);
      setLoading(false);
    };

    // Request geolocation permission
    navigator.geolocation.getCurrentPosition(getPosition, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    });

    // Watch position for updates (optional)
    const watchId = navigator.geolocation.watchPosition(getPosition, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    });

    // Clean up
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <GeolocationContext.Provider 
      value={{ 
        latitude: location.latitude, 
        longitude: location.longitude, 
        error, 
        loading 
      }}
    >
      {children}
    </GeolocationContext.Provider>
  );
}

export function useGeolocation() {
  const context = useContext(GeolocationContext);
  if (context === undefined) {
    throw new Error('useGeolocation must be used within a GeolocationProvider');
  }
  return context;
}