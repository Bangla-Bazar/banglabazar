import { useEffect, useCallback, useRef } from 'react';

type KeyCombo = string[];
type KeyHandler = (event: KeyboardEvent) => void;

interface ShortcutOptions {
  preventDefault?: boolean;
  stopPropagation?: boolean;
  repeat?: boolean;
  enabled?: boolean;
}

interface UseKeyboardShortcutOptions extends ShortcutOptions {
  targetKey: string | string[];
  callback: KeyHandler;
}

function normalizeKeys(keys: string | string[]): KeyCombo {
  const keyArray = Array.isArray(keys) ? keys : [keys];
  return keyArray.map(key => key.toLowerCase());
}

function areKeysPressed(pressedKeys: Set<string>, targetKeys: KeyCombo): boolean {
  return (
    targetKeys.length === pressedKeys.size &&
    targetKeys.every(key => pressedKeys.has(key))
  );
}

export default function useKeyboardShortcut({
  targetKey,
  callback,
  preventDefault = true,
  stopPropagation = true,
  repeat = false,
  enabled = true,
}: UseKeyboardShortcutOptions) {
  const pressedKeys = useRef(new Set<string>());
  const normalizedKeys = useRef(normalizeKeys(targetKey));

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;
      if (!repeat && event.repeat) return;

      const key = event.key.toLowerCase();
      pressedKeys.current.add(key);

      if (areKeysPressed(pressedKeys.current, normalizedKeys.current)) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        callback(event);
      }
    },
    [callback, enabled, preventDefault, stopPropagation, repeat]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      pressedKeys.current.delete(key);
    },
    []
  );

  const clearPressedKeys = useCallback(() => {
    pressedKeys.current.clear();
  }, []);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', clearPressedKeys);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', clearPressedKeys);
      pressedKeys.current.clear();
    };
  }, [enabled, handleKeyDown, handleKeyUp, clearPressedKeys]);
}

// Example usage:
// useKeyboardShortcut({
//   targetKey: ['Meta', 'k'],
//   callback: (event) => {
//     console.log('Command + K pressed!');
//   },
// });
//
// useKeyboardShortcut({
//   targetKey: 'Escape',
//   callback: (event) => {
//     console.log('Escape pressed!');
//   },
//   enabled: isModalOpen,
// }); 