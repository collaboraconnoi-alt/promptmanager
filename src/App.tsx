/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Desktop } from './components/Desktop';
import { AUTH_KEY } from './constants';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(auth === 'true');
  }, []);

  if (isAuthenticated === null) return null;

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-white selection:text-black">
      {isAuthenticated ? (
        <Desktop />
      ) : (
        <Login onLogin={() => setIsAuthenticated(true)} />
      )}
    </div>
  );
}
