import { useState, useEffect } from 'react';
import { showError } from '../utils/notifications';

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

interface GeolocationState {
  isSupported: boolean;
  position: GeolocationPosition | null;
  error: GeolocationPositionError | null;
  isLoading: boolean;
}

const defaultOptions: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 0,
  timeout: Infinity,
};

export default function useGeolocation(options: UseGeolocationOptions = {}): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    isSupported: 'geolocation' in navigator,
    position: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!state.isSupported) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setState((prev) => ({
        ...prev,
        position,
        error: null,
        isLoading: false,
      }));
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setState((prev) => ({
        ...prev,
        position: null,
        error,
        isLoading: false,
      }));
    };

    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options, state.isSupported]);

  return state;
}

// Example usage:
// const {
//   isSupported,
//   position,
//   error,
//   isLoading
// } = useGeolocation({
//   enableHighAccuracy: true,
//   maximumAge: 15000,
//   timeout: 12000,
//   showNotifications: true,
//   onSuccess: (position) => {
//     console.log('Location updated:', position.coords);
//   },
//   onError: (error) => {
//     console.error('Location error:', error.message);
//   },
// });
//
// if (!isSupported) {
//   return <div>Geolocation is not supported</div>;
// }
//
// if (isLoading) {
//   return <div>Loading location...</div>;
// }
//
// if (error) {
//   return <div>Error: {error.message}</div>;
// }
//
// return (
//   <div>
//     Latitude: {position?.coords.latitude}
//     Longitude: {position?.coords.longitude}
//     Accuracy: {position?.coords.accuracy}m
//   </div>
// ); 