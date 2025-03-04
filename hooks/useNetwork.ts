import { useState, useEffect, useCallback } from 'react';
import { showError } from '../utils/notifications';

interface NetworkInformation extends EventTarget {
  effectiveType: string;
  downlink: number;
  rtt: number;
  saveData: boolean;
  type: string;
  onchange: ((this: NetworkInformation, ev: Event) => any) | null;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

interface NetworkState {
  online: boolean;
  effectiveType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

interface UseNetworkOptions {
  showNotifications?: boolean;
  onStatusChange?: (state: NetworkState) => void;
}

function getConnection(): NetworkInformation | undefined {
  if (typeof navigator !== 'undefined') {
    const nav = navigator as NavigatorWithConnection;
    return nav.connection || nav.mozConnection || nav.webkitConnection;
  }
  return undefined;
}

function getInitialState(): NetworkState {
  const connection = getConnection();

  return {
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    effectiveType: connection?.effectiveType,
    downlink: connection?.downlink,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
    type: connection?.type,
  };
}

export default function useNetwork({
  showNotifications = true,
  onStatusChange,
}: UseNetworkOptions = {}): NetworkState {
  const [state, setState] = useState<NetworkState>(getInitialState());

  const handleOnline = useCallback(() => {
    const newState = {
      ...getInitialState(),
      online: true,
    };
    setState(newState);
    onStatusChange?.(newState);
  }, [onStatusChange]);

  const handleOffline = useCallback(() => {
    const newState = {
      ...getInitialState(),
      online: false,
    };
    setState(newState);
    onStatusChange?.(newState);

    if (showNotifications) {
      showError('Network connection lost');
    }
  }, [onStatusChange, showNotifications]);

  const handleConnectionChange = useCallback(() => {
    const newState = getInitialState();
    setState(newState);
    onStatusChange?.(newState);
  }, [onStatusChange]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const connection = getConnection();
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);

      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [handleOnline, handleOffline, handleConnectionChange]);

  return state;
}

// Example usage:
// const network = useNetwork({
//   showNotifications: true,
//   onStatusChange: (state) => {
//     console.log('Network status changed:', state);
//   },
// });
//
// // Check network status
// if (!network.online) {
//   return <div>You are offline!</div>;
// }
//
// // Check connection quality
// if (network.effectiveType === 'slow-2g' || network.effectiveType === '2g') {
//   return <div>Slow connection detected!</div>;
// }
//
// // Check if user is on data-saving mode
// if (network.saveData) {
//   return <div>Data saving mode is enabled!</div>;
// } 