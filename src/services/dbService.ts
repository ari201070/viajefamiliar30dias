import { PhotoItem } from '../types.ts';

const DB_NAME = 'familyTripDB';
const DB_VERSION = 1;
const PHOTO_STORE_NAME = 'photos';

let db: IDBDatabase | null = null;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', (event.target as IDBOpenDBRequest).error);
      reject('IndexedDB error');
    };

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const tempDb = (event.target as IDBOpenDBRequest).result;
      if (!tempDb.objectStoreNames.contains(PHOTO_STORE_NAME)) {
        const photoStore = tempDb.createObjectStore(PHOTO_STORE_NAME, { keyPath: 'id' });
        photoStore.createIndex('dateTaken', 'dateTaken', { unique: false });
      }
    };
  });
};

export const dbService = {
  async getPhotos(): Promise<PhotoItem[]> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PHOTO_STORE_NAME, 'readonly');
      const store = transaction.objectStore(PHOTO_STORE_NAME);
      const request = store.getAll();

      request.onerror = () => reject('Error fetching photos');
      request.onsuccess = () => {
        // Sort by date, newest first
        const sortedPhotos = request.result.sort((a, b) =>
          new Date(b.dateTaken || 0).getTime() - new Date(a.dateTaken || 0).getTime()
        );
        resolve(sortedPhotos);
      };
    });
  },

  async savePhoto(photo: PhotoItem): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PHOTO_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(PHOTO_STORE_NAME);
      const request = store.put(photo); // put handles both add and update

      request.onerror = () => reject('Error saving photo');
      request.onsuccess = () => resolve();
    });
  },

  async deletePhoto(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PHOTO_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(PHOTO_STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => reject('Error deleting photo');
      request.onsuccess = () => resolve();
    });
  },

  async updatePhoto(id: string, updates: Partial<PhotoItem>): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PHOTO_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(PHOTO_STORE_NAME);
      const getRequest = store.get(id);

      getRequest.onerror = () => reject('Error fetching photo for update');
      getRequest.onsuccess = () => {
        const existingPhoto = getRequest.result;
        if (!existingPhoto) {
          reject('Photo not found');
          return;
        }

        const updatedPhoto = { ...existingPhoto, ...updates };
        const putRequest = store.put(updatedPhoto);

        putRequest.onerror = () => reject('Error updating photo');
        putRequest.onsuccess = () => resolve();
      };
    });
  },

  async addPhotosBatch(photos: PhotoItem[]): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PHOTO_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(PHOTO_STORE_NAME);

      photos.forEach(photo => store.put(photo));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject('Error adding batch of photos');
    });
  },

  async exportData(): Promise<string> {
    const photos = await this.getPhotos();
    const data = {
      version: 1,
      timestamp: new Date().toISOString(),
      photos: photos
    };
    return JSON.stringify(data);
  },

  async importData(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      if (!data.photos || !Array.isArray(data.photos)) {
        throw new Error('Invalid data format');
      }
      await this.addPhotosBatch(data.photos);
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  }
};