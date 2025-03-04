import { useEffect, useCallback, useRef } from 'react';

type EventHandler<T extends Event> = (event: T) => void;

interface UseDocumentEventOptions {
  capture?: boolean;
  passive?: boolean;
  once?: boolean;
}

export default function useDocumentEvent<T extends Event>(
  eventName: string,
  handler: EventHandler<T>,
  {
    capture = false,
    passive = false,
    once = false,
  }: UseDocumentEventOptions = {}
): void {
  // Keep handler in ref to prevent unnecessary re-renders
  const savedHandler = useRef<EventHandler<T>>();

  // Update ref.current value if handler changes
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  // Create event listener that calls handler function stored in ref
  const eventListener = useCallback((event: T) => {
    if (savedHandler.current) {
      savedHandler.current(event);
    }
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const options: AddEventListenerOptions = {
      capture,
      passive,
      once,
    };

    document.addEventListener(eventName, eventListener as EventListener, options);

    return () => {
      document.removeEventListener(
        eventName,
        eventListener as EventListener,
        options
      );
    };
  }, [eventName, eventListener, capture, passive, once]);
}

// Example usage:
// function App() {
//   // Handle keyboard events
//   useDocumentEvent('keydown', (event: KeyboardEvent) => {
//     if (event.key === 'Escape') {
//       console.log('Escape key pressed');
//     }
//   });
//
//   // Handle mouse events with options
//   useDocumentEvent(
//     'click',
//     (event: MouseEvent) => {
//       console.log('Click coordinates:', event.clientX, event.clientY);
//     },
//     { passive: true }
//   );
//
//   // Handle copy events
//   useDocumentEvent('copy', (event: ClipboardEvent) => {
//     console.log('Text copied:', event.clipboardData?.getData('text'));
//   });
//
//   // Handle visibility change
//   useDocumentEvent('visibilitychange', () => {
//     console.log('Document visibility changed:', document.visibilityState);
//   });
//
//   return <div>Document Event Demo</div>;
// } 