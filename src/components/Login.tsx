import React, { useState } from 'react';
import { SHARED_PASSWORD, AUTH_KEY } from '../constants';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SHARED_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="win-window w-full max-w-[380px]">
        <div className="win-title-bar">
          <div className="win-title-text">
            Benvenuti in Windows
          </div>
          <div className="flex">
            <button className="win-btn-control">?</button>
            <button className="win-btn-control">×</button>
          </div>
        </div>
        
        <div className="p-6 flex gap-6">
          <div className="hidden sm:block">
             <div className="w-16 h-16 bg-zinc-400 border-2 border-white border-r-zinc-600 border-b-zinc-600 flex items-center justify-center">
                <div className="w-10 h-10 border border-black flex items-center justify-center bg-white">
                  <span className="text-2xl">🔑</span>
                </div>
             </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-4">
            <p className="text-[11px] leading-tight">
              Digitare la password per accedere al sistema Prompt Desktop.
            </p>
            
            <div className="space-y-1">
              <label className="text-[11px] block">Nome utente:</label>
              <input
                type="text"
                disabled
                value="TEAM_USER"
                className="win-sunken w-full px-1 py-0.5 text-[11px] bg-zinc-200 text-zinc-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] block">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`win-sunken w-full px-1 py-0.5 text-[11px] focus:outline-none ${error ? 'bg-red-50' : ''}`}
                autoFocus
              />
              {error && (
                <p className="text-red-700 text-[10px] mt-1">Password non valida.</p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button type="submit" className="win-button min-w-[75px]">
                OK
              </button>
              <button type="button" className="win-button min-w-[75px]">
                Annulla
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
