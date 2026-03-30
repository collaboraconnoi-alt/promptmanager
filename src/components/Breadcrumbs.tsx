import React from 'react';
import { FolderItem } from '../types';

interface BreadcrumbsProps {
  path: FolderItem[];
  onNavigate: (folderId: string | null) => void;
  onNavigateUp: () => void;
  canNavigateUp: boolean;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ path, onNavigate, onNavigateUp, canNavigateUp }) => {
  return (
    <div className="win-raised flex items-center gap-1 p-1 mb-4">
      <div className="flex items-center gap-1 px-1 border-r border-zinc-500 mr-1">
        <button
          onClick={onNavigateUp}
          disabled={!canNavigateUp}
          className={`win-button py-0 px-1 h-5 flex items-center justify-center ${!canNavigateUp ? 'opacity-50 grayscale' : ''}`}
          title="Livello superiore"
        >
          <span className="text-[14px] leading-none">⬆️</span>
        </button>
        <div className="w-[1px] h-4 bg-zinc-400 mx-1" />
        <span className="text-[11px] font-bold text-zinc-600">Indirizzo</span>
      </div>
      
      <div className="win-sunken flex-1 flex items-center gap-1 px-1 h-5 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <button
          onClick={() => onNavigate(null)}
          className="text-[11px] hover:underline cursor-default"
        >
          Desktop
        </button>

        {path.map((folder) => (
          <React.Fragment key={folder.id}>
            <span className="text-[11px] text-zinc-400">/</span>
            <button
              onClick={() => onNavigate(folder.id)}
              className="text-[11px] hover:underline cursor-default"
            >
              {folder.name}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
