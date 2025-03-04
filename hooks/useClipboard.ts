import { useState, useCallback } from 'react';
import { showSuccess, showError } from '../utils/notifications';

interface UseClipboardOptions {
  timeout?: number;
  onSuccess?: (text: string) => void;
  onError?: (error: Error) => void;
  showNotification?: boolean;
}

interface UseClipboardReturn {
  value: string;
  error: Error | null;
  isSupported: boolean;
  isCopied: boolean;
  copyToClipboard: (text: string) => Promise<void>;
  readFromClipboard: () => Promise<void>;
}

export default function useClipboard({
  timeout = 2000,
  onSuccess,
  onError,
  showNotification = true,
}: UseClipboardOptions = {}): UseClipboardReturn {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // Check if clipboard API is supported
  const isSupported = typeof navigator !== 'undefined' &&
    typeof navigator.clipboard !== 'undefined';

  const copyToClipboard = useCallback(
    async (text: string) => {
      try {
        if (!isSupported) {
          throw new Error('Clipboard API not supported');
        }

        await navigator.clipboard.writeText(text);
        setValue(text);
        setError(null);
        setIsCopied(true);

        if (showNotification) {
          showSuccess('Copied to clipboard');
        }
        onSuccess?.(text);

        // Reset copied state after timeout
        setTimeout(() => {
          setIsCopied(false);
        }, timeout);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to copy');
        setError(error);
        setIsCopied(false);

        if (showNotification) {
          showError(error);
        }
        onError?.(error);
      }
    },
    [isSupported, timeout, onSuccess, onError, showNotification]
  );

  const readFromClipboard = useCallback(async () => {
    try {
      if (!isSupported) {
        throw new Error('Clipboard API not supported');
      }

      const text = await navigator.clipboard.readText();
      setValue(text);
      setError(null);

      onSuccess?.(text);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to read clipboard');
      setError(error);

      if (showNotification) {
        showError(error);
      }
      onError?.(error);
    }
  }, [isSupported, onSuccess, onError, showNotification]);

  return {
    value,
    error,
    isSupported,
    isCopied,
    copyToClipboard,
    readFromClipboard,
  };
}

// Example usage:
// const { copyToClipboard, readFromClipboard, value, isCopied } = useClipboard({
//   timeout: 3000,
//   onSuccess: (text) => console.log(`Copied: ${text}`),
// });
//
// <button onClick={() => copyToClipboard('Hello, World!')}>
//   {isCopied ? 'Copied!' : 'Copy'}
// </button>
//
// <button onClick={readFromClipboard}>Paste</button>
// {value && <p>Clipboard content: {value}</p>} 