import { useEffect, useState } from "react";

type LocationType = {
  lat: number;
  lon: number;
  accuracy: number;
} | null;

function UserLocation(): LocationType {
  const [location, setLocation] = useState<LocationType>(null);

  useEffect(() => {
    let bestLocation: LocationType = null;
    let timeoutId: NodeJS.Timeout;

    // Step 1: Get initial location quickly
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const current = { lat: latitude, lon: longitude, accuracy };
        bestLocation = current;
        setLocation(current); // show something immediately
      },
      (error) => console.error("getCurrentPosition error:", error),
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    // Step 2: Watch for better location
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const current = { lat: latitude, lon: longitude, accuracy };

        // Replace if more accurate
        if (!bestLocation || accuracy < bestLocation.accuracy) {
          bestLocation = current;
        }

        // If really accurate, accept and stop watching
        if (accuracy <= 30) {
          setLocation(current);
          navigator.geolocation.clearWatch(watchId);
          clearTimeout(timeoutId);
        }
      },
      (error) => {
        console.error("watchPosition error:", error);
        clearTimeout(timeoutId);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );

    // Step 3: Fallback after timeout
    timeoutId = setTimeout(() => {
      if (bestLocation) {
        setLocation(bestLocation); // use best seen so far
      }
      navigator.geolocation.clearWatch(watchId);
    }, 15000);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(timeoutId);
    };
  }, []);

  return location;
}

export default UserLocation;
