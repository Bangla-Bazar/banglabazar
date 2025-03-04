import { useState, useCallback } from 'react';

interface CookieOptions {
  path?: string;
  expires?: Date | number;
  maxAge?: number;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

interface UseCookieReturn<T> {
  value: T | null;
  updateCookie: (newValue: T, options?: CookieOptions) => void;
  deleteCookie: () => void;
}

function parseCookie<T>(value: string): T | null {
  try {
    return JSON.parse(decodeURIComponent(value));
  } catch {
    return null;
  }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  const cookie = cookies.find(c => c.trim().startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return cookie.split('=')[1].trim();
}

function formatCookieString(
  name: string,
  value: string,
  options: CookieOptions = {}
): string {
  const {
    path = '/',
    expires,
    maxAge,
    domain,
    secure,
    sameSite = 'Lax',
  } = options;

  let cookieString = `${name}=${value}`;

  if (path) cookieString += `; path=${path}`;
  if (domain) cookieString += `; domain=${domain}`;
  if (secure) cookieString += '; secure';
  if (sameSite) cookieString += `; samesite=${sameSite}`;

  if (maxAge !== undefined) {
    cookieString += `; max-age=${maxAge}`;
  } else if (expires) {
    const expiresDate =
      expires instanceof Date ? expires : new Date(Date.now() + expires);
    cookieString += `; expires=${expiresDate.toUTCString()}`;
  }

  return cookieString;
}

export default function useCookie<T>(
  name: string,
  initialValue?: T
): UseCookieReturn<T> {
  const [storedValue, setStoredValue] = useState<T | null>(() => {
    if (typeof document === 'undefined') {
      return initialValue ?? null;
    }

    const cookie = getCookie(name);
    if (cookie) {
      return parseCookie<T>(cookie);
    }

    if (initialValue !== undefined) {
      updateCookie(initialValue);
      return initialValue;
    }

    return null;
  });

  const updateCookie = useCallback(
    (value: T, options?: CookieOptions) => {
      if (typeof document === 'undefined') {
        return;
      }

      const stringValue = encodeURIComponent(JSON.stringify(value));
      document.cookie = formatCookieString(name, stringValue, options);
      setStoredValue(value);
    },
    [name]
  );

  const deleteCookie = useCallback(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.cookie = formatCookieString(name, '', {
      expires: new Date(0),
    });
    setStoredValue(null);
  }, [name]);

  return {
    value: storedValue,
    updateCookie,
    deleteCookie,
  };
}

// Example usage:
// function App() {
//   const {
//     value: theme,
//     updateCookie: setTheme,
//     deleteCookie: resetTheme,
//   } = useCookie<'light' | 'dark'>('theme', 'light');
//
//   const {
//     value: user,
//     updateCookie: setUser,
//     deleteCookie: logout,
//   } = useCookie<{ id: number; name: string }>('user');
//
//   const toggleTheme = () => {
//     setTheme(theme === 'light' ? 'dark' : 'light', {
//       maxAge: 60 * 60 * 24 * 365, // 1 year
//       secure: true,
//       sameSite: 'Strict',
//     });
//   };
//
//   const login = () => {
//     setUser(
//       { id: 1, name: 'John Doe' },
//       {
//         expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
//         secure: true,
//         sameSite: 'Strict',
//       }
//     );
//   };
//
//   return (
//     <div>
//       <h1>Cookie Demo</h1>
//       <p>Current theme: {theme}</p>
//       <button onClick={toggleTheme}>Toggle Theme</button>
//       <button onClick={resetTheme}>Reset Theme</button>
//
//       <p>User: {user ? JSON.stringify(user) : 'Not logged in'}</p>
//       <button onClick={login}>Log In</button>
//       <button onClick={logout}>Log Out</button>
//     </div>
//   );
// } 