import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [permission, setPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  async function checkPermission() {
    const { status } = await Location.getForegroundPermissionsAsync();
    setPermission(status === 'granted');
  }

  async function requestPermission(): Promise<boolean> {
    const { status } = await Location.requestForegroundPermissionsAsync();
    const granted = status === 'granted';
    setPermission(granted);
    return granted;
  }

  async function getCurrentLocation(): Promise<LocationData | null> {
    if (!permission) {
      const granted = await requestPermission();
      if (!granted) return null;
    }

    setLoading(true);
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const address = addressResult
        ? [addressResult.street, addressResult.city, addressResult.region]
            .filter(Boolean)
            .join(', ')
        : undefined;

      const data: LocationData = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        address,
      };

      setLocation(data);
      return data;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    location,
    permission,
    loading,
    requestPermission,
    getCurrentLocation,
  };
}
