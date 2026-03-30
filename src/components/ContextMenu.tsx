import React, { useEffect, useRef } from 'react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onNewFile?: () => void;
  onNewFolder?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onOpen?: () => void;
  targetType?: 'file' | 'folder' | 'desktop';
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  onNewFile,
  onNewFolder,
  onRename,
  onDelete,
  onOpen,
  targetType = 'desktop'
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuWidth = 150;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 5);
  const adjustedY = Math.min(y, window.innerHeight - 150);

  return (
    <div
      ref={menuRef}
      className="fixed z-[100] w-[150px] win-raised py-0.5 shadow-md"
      style={{ left: adjustedX, top: adjustedY }}
    >
      {targetType === 'desktop' ? (
        <>
          <button
            onClick={() => { onNewFolder?.(); onClose(); }}
            className="w-full flex items-center px-4 py-1 text-[11px] hover:bg-[#000080] hover:text-white transition-none text-left cursor-default"
          >
            Nuova cartella
          </button>
          <button
            onClick={() => { onNewFile?.(); onClose(); }}
            className="w-full flex items-center px-4 py-1 text-[11px] hover:bg-[#000080] hover:text-white transition-none text-left cursor-default"
          >
            Nuovo file di testo
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => { onOpen?.(); onClose(); }}
            className="w-full flex items-center px-4 py-1 text-[11px] font-bold hover:bg-[#000080] hover:text-white transition-none text-left cursor-default"
          >
            Apri
          </button>
          <div className="h-[1px] bg-zinc-500 my-1 mx-1" />
          <button
            onClick={() => { onRename?.(); onClose(); }}
            className="w-full flex items-center px-4 py-1 text-[11px] hover:bg-[#000080] hover:text-white transition-none text-left cursor-default"
          >
            Rinomina
          </button>
          <button
            onClick={() => { onDelete?.(); onClose(); }}
            className="w-full flex items-center px-4 py-1 text-[11px] hover:bg-[#000080] hover:text-white transition-none text-left cursor-default"
          >
            Elimina
          </button>
        </>
      )}
    </div>
  );
};
