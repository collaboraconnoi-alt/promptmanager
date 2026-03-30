import { DesktopItem, DesktopState } from "../types";
import { STORAGE_KEY } from "../constants";

const SEED_DATA: DesktopItem[] = [
  {
    id: "root-folder-1",
    name: "Prompt Library",
    parentId: null,
    createdAt: Date.now(),
    type: "folder",
  },
  {
    id: "sub-folder-1",
    name: "Video Prompts",
    parentId: "root-folder-1",
    createdAt: Date.now(),
    type: "folder",
  },
  {
    id: "sub-folder-2",
    name: "Image Prompts",
    parentId: "root-folder-1",
    createdAt: Date.now(),
    type: "folder",
  },
  {
    id: "file-1",
    name: "Welcome.txt",
    content: "Benvenuti nella libreria dei prompt del team!\n\nQui potete organizzare i vostri testi migliori.",
    parentId: "root-folder-1",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    type: "file",
  },
];

export const storageService = {
  saveData: (items: DesktopItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }));
  },

  loadData: (): DesktopState => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return { items: SEED_DATA };
    }
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to parse storage data", e);
      return { items: SEED_DATA };
    }
  },
};
