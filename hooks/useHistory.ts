import { useState, useEffect, useCallback } from 'react';

interface HistoryState {
  canGoBack: boolean;
  canGoForward: boolean;
  length: number;
  currentPath: string;
}

interface UseHistoryOptions {
  onNavigate?: (path: string) => void;
}

export default function useHistory({
  onNavigate,
}: UseHistoryOptions = {}): {
  state: HistoryState;
  goBack: () => void;
  goForward: () => void;
  push: (path: string) => void;
  replace: (path: string) => void;
} {
  const [state, setState] = useState<HistoryState>(() => ({
    canGoBack: typeof window !== 'undefined' ? window.history.length > 1 : false,
    canGoForward: false,
    length: typeof window !== 'undefined' ? window.history.length : 0,
    currentPath: typeof window !== 'undefined' ? window.location.pathname : '/',
  }));

  const updateState = useCallback(() => {
    setState({
      canGoBack: window.history.length > 1,
      canGoForward: false, // We can't reliably determine this
      length: window.history.length,
      currentPath: window.location.pathname,
    });
  }, []);

  const goBack = useCallback(() => {
    if (state.canGoBack) {
      window.history.back();
    }
  }, [state.canGoBack]);

  const goForward = useCallback(() => {
    if (state.canGoForward) {
      window.history.forward();
    }
  }, [state.canGoForward]);

  const push = useCallback(
    (path: string) => {
      window.history.pushState(null, '', path);
      updateState();
      onNavigate?.(path);
    },
    [updateState, onNavigate]
  );

  const replace = useCallback(
    (path: string) => {
      window.history.replaceState(null, '', path);
      updateState();
      onNavigate?.(path);
    },
    [updateState, onNavigate]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    // Update state when user navigates using browser buttons
    const handlePopState = () => {
      updateState();
      onNavigate?.(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [updateState, onNavigate]);

  return {
    state,
    goBack,
    goForward,
    push,
    replace,
  };
}

// Example usage:
// const {
//   state: { canGoBack, canGoForward, length, currentPath },
//   goBack,
//   goForward,
//   push,
//   replace,
// } = useHistory({
//   onNavigate: (path) => {
//     console.log('Navigated to:', path);
//   },
// });
//
// // Navigation buttons
// <button disabled={!canGoBack} onClick={goBack}>
//   Back
// </button>
// <button disabled={!canGoForward} onClick={goForward}>
//   Forward
// </button>
//
// // Programmatic navigation
// <button onClick={() => push('/new-path')}>
//   Go to New Path
// </button>
// <button onClick={() => replace('/replace-path')}>
//   Replace Current Path
// </button>
//
// // Current location info
// <div>Current path: {currentPath}</div>
// <div>History length: {length}</div> 