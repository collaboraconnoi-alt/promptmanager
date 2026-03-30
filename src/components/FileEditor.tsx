import React, { useEffect, useState, useRef } from 'react';
import { FileItem } from '../types';

interface FileEditorProps {
  file: FileItem;
  onClose: () => void;
  onSave: (content: string) => void;
}

export const FileEditor: React.FC<FileEditorProps> = ({ file, onClose, onSave }) => {
  const [content, setContent] = useState(file.content);
  const [isDirty, setIsDirty] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setContent(file.content);
    setIsDirty(false);
  }, [file]);

  const handleSave = () => {
    onSave(content);
    setIsDirty(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsDirty(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-10 bg-black/10">
      <div className="win-window w-full max-w-4xl h-full max-h-[600px] flex flex-col">
        {/* Title Bar */}
        <div className="win-title-bar">
          <div className="win-title-text">
            <span className="mr-1">📝</span>
            {file.name} - Blocco note
          </div>
          <div className="flex">
            <button className="win-btn-control">_</button>
            <button className="win-btn-control">□</button>
            <button onClick={onClose} className="win-btn-control">×</button>
          </div>
        </div>

        {/* Menu Bar */}
        <div className="flex gap-3 px-2 py-0.5 border-b border-zinc-400 text-[11px]">
          <button className="hover:bg-zinc-300 px-1 cursor-default">File</button>
          <button className="hover:bg-zinc-300 px-1 cursor-default">Modifica</button>
          <button className="hover:bg-zinc-300 px-1 cursor-default">Cerca</button>
          <button className="hover:bg-zinc-300 px-1 cursor-default">?</button>
        </div>

        {/* Editor Area */}
        <div className="flex-1 p-0.5 bg-white overflow-hidden flex flex-col">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleChange}
            className="flex-1 w-full p-1 text-[12px] font-mono leading-tight focus:outline-none resize-none border-none"
            spellCheck={false}
          />
        </div>

        {/* Status Bar / Footer */}
        <div className="win-raised flex justify-between items-center px-2 py-0.5 text-[10px]">
          <div className="flex gap-4">
             <button 
               onClick={handleSave}
               disabled={!isDirty}
               className={`win-button py-0 px-2 h-4 ${!isDirty ? 'opacity-50' : ''}`}
             >
               Salva
             </button>
             <span className="flex items-center">
               {isDirty ? "Modificato" : "Salvato"}
             </span>
          </div>
          <span>Linea 1, Colonna 1</span>
        </div>
      </div>
    </div>
  );
};
