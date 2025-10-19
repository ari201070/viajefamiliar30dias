const DB_NAME = 'familyTripDB';
const DB_VERSION = 1;
const PHOTO_STORE_NAME = 'photos';

let db = null;

const openDB = () => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      console.error('IndexedDB error:', event.target.error);
      reject('IndexedDB error');
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const tempDb = event.target.result;
      if (!tempDb.objectStoreNames.contains(PHOTO_STORE_NAME)) {
        const photoStore = tempDb.createObjectStore(PHOTO_STORE_NAME, { keyPath: 'id' });
        photoStore.createIndex('dateTaken', 'dateTaken', { unique: false });
      }
    };
  });
};

export const dbService = {
  async getPhotos() {
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

  async savePhoto(photo) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PHOTO_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(PHOTO_STORE_NAME);
      const request = store.put(photo); // put handles both add and update

      request.onerror = () => reject('Error saving photo');
      request.onsuccess = () => resolve();
    });
  },

  async deletePhoto(id) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(PHOTO_STORE_NAME, 'readwrite');
      const store = transaction.objectStore(PHOTO_STORE_NAME);
      const request = store.delete(id);

      request.onerror = () => reject('Error deleting photo');
      request.onsuccess = () => resolve();
    });
  },

  async addPhotosBatch(photos) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(PHOTO_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(PHOTO_STORE_NAME);
        
        photos.forEach(photo => store.put(photo));

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject('Error adding batch of photos');
    });
  },
};