import { useState, useEffect, useCallback } from 'react';

interface UseDocumentVisibilityOptions {
  onVisible?: () => void;
  onHidden?: () => void;
}

interface DocumentVisibilityState {
  isVisible: boolean;
  visibilityState: VisibilityState;
}

export default function useDocumentVisibility({
  onVisible,
  onHidden,
}: UseDocumentVisibilityOptions = {}): DocumentVisibilityState {
  const [state, setState] = useState<DocumentVisibilityState>(() => ({
    isVisible: typeof document !== 'undefined' ? !document.hidden : true,
    visibilityState:
      typeof document !== 'undefined'
        ? document.visibilityState
        : 'visible',
  }));

  const handleVisibilityChange = useCallback(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const isVisible = !document.hidden;
    const visibilityState = document.visibilityState;

    setState({ isVisible, visibilityState });

    if (isVisible) {
      onVisible?.();
    } else {
      onHidden?.();
    }
  }, [onVisible, onHidden]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleVisibilityChange]);

  return state;
}

// Example usage:
// function App() {
//   const { isVisible, visibilityState } = useDocumentVisibility({
//     onVisible: () => {
//       console.log('Document became visible');
//       // Resume animations, reconnect websockets, etc.
//     },
//     onHidden: () => {
//       console.log('Document became hidden');
//       // Pause animations, disconnect websockets, etc.
//     },
//   });
//
//   useEffect(() => {
//     console.log('Visibility state:', visibilityState);
//     console.log('Is visible:', isVisible);
//   }, [isVisible, visibilityState]);
//
//   return (
//     <div>
//       <h1>Document Visibility Demo</h1>
//       <p>Current state: {visibilityState}</p>
//       <p>Is visible: {isVisible ? 'Yes' : 'No'}</p>
//     </div>
//   );
// } 