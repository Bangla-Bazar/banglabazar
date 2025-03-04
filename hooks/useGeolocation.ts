import { useState, useEffect, useCallback } from 'react';
import { showError } from '../utils/notifications';

interface GeolocationState {
  isSupported: boolean;
  position: GeolocationPosition | null;
  error: GeolocationError | null;
  isLoading: boolean;
}

interface UseGeolocationOptions extends PositionOptions {
  showNotifications?: boolean;
  onSuccess?: (position: GeolocationPosition) => void;
  onError?: (error: GeolocationError) => void;
}

const defaultOptions: PositionOptions = {
  enableHighAccuracy: false,
  maximumAge: 0,
  timeout: Infinity,
};

export default function useGeolocation({
  showNotifications = true,
  onSuccess,
  onError,
  ...positionOptions
}: UseGeolocationOptions = {}): GeolocationState {
  const [state, setState] = useState<GeolocationState>({
    isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
    position: null,
    error: null,
    isLoading: true,
  });

  const handleSuccess = useCallback(
    (position: GeolocationPosition) => {
      setState(prev => ({
        ...prev,
        position,
        error: null,
        isLoading: false,
      }));
      onSuccess?.(position);
    },
    [onSuccess]
  );

  const handleError = useCallback(
    (error: GeolocationError) => {
      setState(prev => ({
        ...prev,
        position: null,
        error,
        isLoading: false,
      }));

      if (showNotifications) {
        showError(`Geolocation error: ${error.message}`);
      }

      onError?.(error);
    },
    [onError, showNotifications]
  );

  useEffect(() => {
    if (!state.isSupported) {
      setState(prev => ({
        ...prev,
        error: new Error('Geolocation is not supported') as GeolocationError,
        isLoading: false,
      }));
      return;
    }

    const options = {
      ...defaultOptions,
      ...positionOptions,
    };

    // Get initial position
    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [
    state.isSupported,
    handleSuccess,
    handleError,
    positionOptions.enableHighAccuracy,
    positionOptions.maximumAge,
    positionOptions.timeout,
  ]);

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