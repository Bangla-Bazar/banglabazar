import { useState, useEffect, useCallback } from 'react';

function isClient(): boolean {
  return typeof window !== 'undefined';
}

function getStorageValue<T>(key: string, defaultValue: T): T {
  if (!isClient()) {
    return defaultValue;
  }

  try {
    const item = window.localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
}

export default function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
  } = {}
) {
  const [storedValue, setStoredValue] = useState<T>(() =>
    getStorageValue(key, defaultValue)
  );

  const setValue = useCallback(
    (value: T | ((prevValue: T) => T)) => {
      try {
        // Allow value to be a function so we have the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        
        // Save state
        setStoredValue(valueToStore);
        
        // Save to localStorage
        if (isClient()) {
          const serialized = options.serialize
            ? options.serialize(valueToStore)
            : JSON.stringify(valueToStore);
          window.localStorage.setItem(key, serialized);
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue, options]
  );

  const remove = useCallback(() => {
    try {
      // Remove from localStorage
      if (isClient()) {
        window.localStorage.removeItem(key);
      }
      
      // Reset state to default
      setStoredValue(defaultValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, defaultValue]);

  // Update stored value if localStorage changes in another tab/window
  useEffect(() => {
    if (!isClient()) {
      return;
    }

    function handleStorageChange(e: StorageEvent) {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = options.deserialize
            ? options.deserialize(e.newValue)
            : JSON.parse(e.newValue);
          setStoredValue(newValue);
        } catch (error) {
          console.warn(
            `Error parsing localStorage change for key "${key}":`,
            error
          );
        }
      } else if (e.key === key) {
        // If newValue is null, the key was removed
        setStoredValue(defaultValue);
      }
    }

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, defaultValue, options]);

  return [storedValue, setValue, remove] as const;
} 