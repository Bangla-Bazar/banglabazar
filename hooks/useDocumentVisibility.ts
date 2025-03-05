import { useState, useEffect } from 'react';

interface UseDocumentVisibilityOptions {
  onVisibilityChange?: (state: DocumentVisibilityState) => void;
}

interface DocumentVisibilityState {
  isVisible: boolean;
  visibilityState: 'visible' | 'hidden' | 'prerender';
}

export default function useDocumentVisibility({
  onVisibilityChange,
}: UseDocumentVisibilityOptions = {}) {
  const [visibilityState, setVisibilityState] = useState<DocumentVisibilityState>({
    isVisible: true,
    visibilityState: 'visible',
  });

  useEffect(() => {
    function handleVisibilityChange() {
      const nextState = {
        isVisible: document.visibilityState === 'visible',
        visibilityState: document.visibilityState as DocumentVisibilityState['visibilityState'],
      };
      setVisibilityState(nextState);
      onVisibilityChange?.(nextState);
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onVisibilityChange]);

  return visibilityState;
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