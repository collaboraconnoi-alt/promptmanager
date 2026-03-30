export interface FileItem {
  id: string;
  name: string;
  content: string;
  parentId: string | null;
  createdAt: number;
  updatedAt: number;
  type: 'file';
}

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: number;
  type: 'folder';
}

export type DesktopItem = FileItem | FolderItem;

export interface DesktopState {
  items: DesktopItem[];
}
