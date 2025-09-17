import { PhotoItem, PackingItem } from '../types.ts';

// --- SERVICE SIMULATING FIREBASE REAL-TIME SYNC ---
// This service centralizes data management for features that need to be synced.
// It currently uses IndexedDB (for photos) and localStorage (for packing list)
// to persist data locally, but it's structured to be easily replaced with
// a real Firebase implementation. It simulates async behavior.

const DB_NAME = 'familyTripDB';
const DB_VERSION = 1; // Keep version consistent with old dbService
const PHOTO_STORE_NAME = 'photos';
const PACKING_LIST_KEY = 'packingList';

let db: IDBDatabase | null = null;

// --- IndexedDB Helper for Photos ---
const openPhotoDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) return resolve(db);
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject('IndexedDB error');
    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      const tempDb = (event.target as IDBOpenDBRequest).result;
      if (!tempDb.objectStoreNames.contains(PHOTO_STORE_NAME)) {
        tempDb.createObjectStore(PHOTO_STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

const simulateDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

const notifyDataChange = () => {
    // This event notifies other components (like CloudSyncInfo) that a change has occurred.
    window.dispatchEvent(new Event('storage'));
};

export const firebaseSyncService = {
  // --- Photo Album Methods ---
  async getPhotos(): Promise<PhotoItem[]> {
    await simulateDelay(300); // Simulate network latency
    const db = await openPhotoDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PHOTO_STORE_NAME, 'readonly');
      const store = transaction.objectStore(PHOTO_STORE_NAME);
      const request = store.getAll();
      request.onerror = () => reject('Error fetching photos');
      request.onsuccess = () => {
        const sortedPhotos = request.result.sort((a, b) => new Date(b.dateTaken || 0).getTime() - new Date(a.dateTaken || 0).getTime());
        resolve(sortedPhotos);
      };
    });
  },

  async savePhoto(photo: PhotoItem): Promise<void> {
    await simulateDelay(500);
    const db = await openPhotoDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PHOTO_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(PHOTO_STORE_NAME);
      const request = store.put(photo);
      request.onerror = () => reject('Error saving photo');
      request.onsuccess = () => {
        notifyDataChange();
        resolve();
      };
    });
  },

  async deletePhoto(id: string): Promise<void> {
    await simulateDelay(500);
    const db = await openPhotoDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PHOTO_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(PHOTO_STORE_NAME);
      const request = store.delete(id);
      request.onerror = () => reject('Error deleting photo');
      request.onsuccess = () => {
        notifyDataChange();
        resolve();
      };
    });
  },

  async addPhotosBatch(photos: PhotoItem[]): Promise<void> {
    const db = await openPhotoDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PHOTO_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(PHOTO_STORE_NAME);
      photos.forEach(photo => store.add(photo));
      transaction.oncomplete = () => {
        // Don't notify for initial seeding
        resolve();
      };
      transaction.onerror = () => reject('Error adding batch of photos');
    });
  },

  // --- Packing List Methods ---
  async getPackingList(): Promise<PackingItem[]> {
      await simulateDelay(200);
      try {
        const savedItems = localStorage.getItem(PACKING_LIST_KEY);
        return savedItems ? JSON.parse(savedItems) : [];
      } catch (e) {
        console.error("Failed to load packing list", e);
        return [];
      }
  },

  async savePackingList(items: PackingItem[]): Promise<void> {
      await simulateDelay(400);
      try {
          localStorage.setItem(PACKING_LIST_KEY, JSON.stringify(items));
          notifyDataChange();
      } catch (e) {
          console.error("Failed to save packing list", e);
          throw e; // Re-throw to be handled by the component
      }
  }
};
