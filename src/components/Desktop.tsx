import React, { useState, useEffect, useCallback } from 'react';
import { DesktopItem, FolderItem, FileItem } from '../types';
import { storageService } from '../services/storage';
import { Breadcrumbs } from './Breadcrumbs';
import { FileEditor } from './FileEditor';
import { ContextMenu } from './ContextMenu';
import { Modal } from './Modal';
import { AUTH_KEY } from '../constants';

export const Desktop: React.FC = () => {
  const [items, setItems] = useState<DesktopItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, target: DesktopItem | null } | null>(null);
  
  // Modal State
  const [modal, setModal] = useState<{
    type: 'rename' | 'delete' | 'newFolder' | 'newFile';
    target: DesktopItem | null;
    isOpen: boolean;
  }>({ type: 'newFolder', target: null, isOpen: false });

  useEffect(() => {
    const data = storageService.loadData();
    setItems(data.items);
  }, []);

  const saveItems = (newItems: DesktopItem[]) => {
    setItems(newItems);
    storageService.saveData(newItems);
  };

  const currentItems = items.filter(item => 
    item.parentId === currentFolderId && 
    (searchQuery === '' || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getPath = useCallback(() => {
    const path: FolderItem[] = [];
    let currentId = currentFolderId;
    while (currentId) {
      const folder = items.find(i => i.id === currentId && i.type === 'folder') as FolderItem;
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }
    return path;
  }, [currentFolderId, items]);

  // Handlers
  const handleOpen = (item: DesktopItem) => {
    if (item.type === 'folder') {
      setCurrentFolderId(item.id);
      setSelectedItemId(null);
    } else {
      setSelectedFile(item as FileItem);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, item: DesktopItem | null) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, target: item });
    if (item) setSelectedItemId(item.id);
  };

  const handleCreateFolder = (name: string) => {
    if (!name.trim()) return;
    const newFolder: FolderItem = {
      id: crypto.randomUUID(),
      name,
      parentId: currentFolderId,
      createdAt: Date.now(),
      type: 'folder'
    };
    saveItems([...items, newFolder]);
    setModal({ ...modal, isOpen: false });
  };

  const handleCreateFile = (name: string) => {
    if (!name.trim()) return;
    const fileName = name.endsWith('.txt') ? name : `${name}.txt`;
    const newFile: FileItem = {
      id: crypto.randomUUID(),
      name: fileName,
      content: '',
      parentId: currentFolderId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      type: 'file'
    };
    saveItems([...items, newFile]);
    setModal({ ...modal, isOpen: false });
    setSelectedFile(newFile);
  };

  const handleRename = (newName: string) => {
    if (!modal.target || !newName.trim()) return;
    const updatedItems = items.map(item => 
      item.id === modal.target!.id ? { ...item, name: newName } : item
    );
    saveItems(updatedItems);
    setModal({ ...modal, isOpen: false });
  };

  const handleDelete = () => {
    if (!modal.target) return;
    const idsToDelete = new Set<string>([modal.target.id]);
    if (modal.target.type === 'folder') {
      const findChildren = (parentId: string) => {
        items.forEach(item => {
          if (item.parentId === parentId) {
            idsToDelete.add(item.id);
            if (item.type === 'folder') findChildren(item.id);
          }
        });
      };
      findChildren(modal.target.id);
    }
    saveItems(items.filter(item => !idsToDelete.has(item.id)));
    setModal({ ...modal, isOpen: false });
  };

  const handleSaveFile = (content: string) => {
    if (!selectedFile) return;
    const updatedItems = items.map(item => 
      item.id === selectedFile.id 
        ? { ...item, content, updatedAt: Date.now() } as FileItem 
        : item
    );
    saveItems(updatedItems);
    setSelectedFile({ ...selectedFile, content, updatedAt: Date.now() });
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    window.location.reload();
  };

  return (
    <div 
      className="h-screen flex flex-col select-none overflow-hidden"
      onContextMenu={(e) => handleContextMenu(e, null)}
      onClick={() => setSelectedItemId(null)}
    >
      {/* Explorer Window Style Content */}
      <div className="flex-1 flex flex-col p-2">
        <div className="win-window flex-1 flex flex-col overflow-hidden">
          {/* Window Title Bar */}
          <div className="win-title-bar">
            <div className="win-title-text">
              <span className="mr-1">📁</span>
              {currentFolderId ? items.find(i => i.id === currentFolderId)?.name : 'Desktop'}
            </div>
            <div className="flex">
              <button className="win-btn-control">_</button>
              <button className="win-btn-control">□</button>
              <button className="win-btn-control">×</button>
            </div>
          </div>

          {/* Explorer Menu Bar */}
          <div className="flex gap-3 px-2 py-0.5 border-b border-zinc-400 text-[11px]">
            <button className="hover:bg-zinc-300 px-1 cursor-default">File</button>
            <button className="hover:bg-zinc-300 px-1 cursor-default">Modifica</button>
            <button className="hover:bg-zinc-300 px-1 cursor-default">Visualizza</button>
            <button className="hover:bg-zinc-300 px-1 cursor-default">Preferiti</button>
            <button className="hover:bg-zinc-300 px-1 cursor-default">Strumenti</button>
            <button className="hover:bg-zinc-300 px-1 cursor-default">?</button>
          </div>

          {/* Address Bar */}
          <Breadcrumbs 
            path={getPath()} 
            onNavigate={setCurrentFolderId} 
            canNavigateUp={currentFolderId !== null}
            onNavigateUp={() => {
              if (currentFolderId) {
                const currentFolder = items.find(i => i.id === currentFolderId);
                setCurrentFolderId(currentFolder?.parentId || null);
              }
            }}
          />

          {/* Search Bar */}
          <div className="px-2 pb-2 flex items-center gap-2">
             <span className="text-[11px]">Cerca:</span>
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="win-sunken flex-1 px-1 py-0.5 text-[11px] focus:outline-none"
             />
          </div>

          {/* File Grid */}
          <div className="flex-1 bg-white win-sunken m-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-6">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center gap-2 group"
                  onClick={(e) => { e.stopPropagation(); setSelectedItemId(item.id); }}
                  onDoubleClick={() => handleOpen(item)}
                  onContextMenu={(e) => handleContextMenu(e, item)}
                >
                  <div className={`w-16 h-16 flex items-center justify-center relative ${selectedItemId === item.id ? 'after:content-[""] after:absolute after:inset-0 after:bg-blue-800/30 after:border after:border-dotted after:border-blue-900' : ''}`}>
                    {item.type === 'folder' ? (
                      <div className="text-4xl">📁</div>
                    ) : (
                      <div className="text-4xl">📄</div>
                    )}
                  </div>
                  <div className={`px-1 text-[13px] text-center break-all max-w-full ${selectedItemId === item.id ? 'bg-[#000080] text-white border border-dotted border-white' : 'text-black'}`}>
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Bar */}
          <div className="win-raised px-2 py-0.5 text-[10px] flex justify-between">
            <span>{currentItems.length} oggetto(i)</span>
            <span>Il mio computer</span>
          </div>
        </div>
      </div>

      {/* Taskbar */}
      <div className="h-7 win-raised flex items-center px-0.5 gap-1 z-50">
        <button 
          className="win-button h-6 px-1 font-bold italic flex items-center gap-1"
          style={{ padding: '2px 4px' }}
        >
          <div className="w-4 h-4 bg-zinc-400 flex items-center justify-center text-[10px] border border-black">田</div>
          Avvio
        </button>
        
        <div className="w-[1px] h-5 bg-zinc-500 mx-0.5" />
        
        <div className="flex-1 flex gap-1 overflow-hidden">
           {selectedFile && (
             <div className="win-sunken h-6 flex items-center px-2 text-[11px] max-w-[150px] truncate bg-zinc-200">
               📝 {selectedFile.name}
             </div>
           )}
        </div>

        <div className="win-sunken h-6 px-2 flex items-center gap-2 ml-auto">
          <span className="text-[11px]">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Overlays */}
      {selectedFile && (
        <FileEditor 
          file={selectedFile} 
          onClose={() => setSelectedFile(null)} 
          onSave={handleSaveFile}
        />
      )}

      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu(null)}
          targetType={contextMenu.target ? contextMenu.target.type : 'desktop'}
          onOpen={() => contextMenu.target && handleOpen(contextMenu.target)}
          onNewFile={() => setModal({ type: 'newFile', target: null, isOpen: true })}
          onNewFolder={() => setModal({ type: 'newFolder', target: null, isOpen: true })}
          onRename={() => setModal({ type: 'rename', target: contextMenu.target, isOpen: true })}
          onDelete={() => setModal({ type: 'delete', target: contextMenu.target, isOpen: true })}
        />
      )}

      <Modal 
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        title={
          modal.type === 'rename' ? 'Rinomina' :
          modal.type === 'delete' ? 'Conferma eliminazione' :
          modal.type === 'newFolder' ? 'Nuova cartella' : 'Nuovo file'
        }
        defaultValue={modal.target?.name || ''}
        type={modal.type === 'delete' ? 'confirm' : 'prompt'}
        message={modal.type === 'delete' ? `Eliminare "${modal.target?.name}"?` : undefined}
        onConfirm={(val) => {
          if (modal.type === 'rename') handleRename(val);
          else if (modal.type === 'delete') handleDelete();
          else if (modal.type === 'newFolder') handleCreateFolder(val);
          else if (modal.type === 'newFile') handleCreateFile(val);
        }}
      />
    </div>
  );
};
