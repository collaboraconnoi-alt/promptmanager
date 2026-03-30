import React, { useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title: string;
  defaultValue?: string;
  type: 'prompt' | 'confirm';
  message?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  defaultValue = '',
  type,
  message
}) => {
  const [value, setValue] = useState(defaultValue);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/10">
      <div className="win-window w-full max-w-sm">
        <div className="win-title-bar">
          <div className="win-title-text">{title}</div>
          <div className="flex">
            <button onClick={onClose} className="win-btn-control">×</button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {message && <p className="text-[11px] leading-tight">{message}</p>}

          {type === 'prompt' && (
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="win-sunken w-full px-1 py-0.5 text-[11px] focus:outline-none"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && onConfirm(value)}
            />
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => onConfirm(value)}
              className="win-button min-w-[75px]"
            >
              {type === 'confirm' ? 'Sì' : 'OK'}
            </button>
            <button
              onClick={onClose}
              className="win-button min-w-[75px]"
            >
              {type === 'confirm' ? 'No' : 'Annulla'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
