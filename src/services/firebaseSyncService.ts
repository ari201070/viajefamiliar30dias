import { PhotoItem, PackingItem } from '../types.ts';
import { db, storage } from './firebaseConfig.ts';
// FIX: Imports are no longer needed as we use the compat library's namespaced methods.
/*
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  getDoc,
  orderBy,
  query,
} from 'firebase/firestore';
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
*/

// --- SERVICE FOR FIREBASE REAL-TIME SYNC ---
// This service centralizes data management for synced features.
// It uses Firestore for metadata and Cloud Storage for files.

const handleFirebaseError = (error: any, context: string) => {
    console.error(`Firebase error in ${context}:`, error);
    // Here you could add more robust error handling, e.g., reporting to a service
    throw error; // Re-throw the error to be handled by the calling component
};

// This check prevents the app from crashing if Firebase config is missing.
// Components will handle the null `db` or `storage` and show an error or disabled state.
if (!db || !storage) {
  console.warn("Firebase is not initialized. Sync features will be disabled.");
}

// User-specific collection/document getters
const getPhotosCollection = (userId: string) => db?.collection('users').doc(userId).collection('photos');
const getPackingListDoc = (userId: string) => db?.collection('users').doc(userId).collection('data').doc('packingList');
const getPhotoStorageRef = (userId: string, photoId: string) => storage?.ref(`users/${userId}/photos/${photoId}`);


export const firebaseSyncService = {
  // --- Photo Album Methods ---
  async getPhotos(userId: string): Promise<PhotoItem[]> {
    const photosCollection = getPhotosCollection(userId);
    if (!photosCollection) return [];
    try {
        const snapshot = await photosCollection.orderBy('dateTaken', 'desc').get();
        return snapshot.docs.map(doc => doc.data() as PhotoItem);
    } catch(e) {
        handleFirebaseError(e, "getPhotos");
        return [];
    }
  },

  async savePhoto(userId: string, photo: PhotoItem): Promise<void> {
    const photosCollection = getPhotosCollection(userId);
    if (!photosCollection || !storage) return;
    try {
        const photoRef = photosCollection.doc(photo.id);
        let photoData = { ...photo };

        if (photoData.src.startsWith('data:image')) {
            const storageRef = getPhotoStorageRef(userId, photo.id);
            if (!storageRef) throw new Error("Storage reference could not be created.");
            
            const snapshot = await storageRef.putString(photoData.src, 'data_url');
            const downloadURL = await snapshot.ref.getDownloadURL();
            photoData.src = downloadURL;
        }
        
        await photoRef.set(photoData, { merge: true });
    } catch(e) {
        handleFirebaseError(e, "savePhoto");
    }
  },

  async deletePhoto(userId: string, id: string): Promise<void> {
    const photosCollection = getPhotosCollection(userId);
    if (!photosCollection || !storage) return;
    try {
        const photoRef = photosCollection.doc(id);
        await photoRef.delete();

        const storageRef = getPhotoStorageRef(userId, id);
        if (storageRef) {
          await storageRef.delete().catch(error => {
              if (error.code !== 'storage/object-not-found') {
                  console.error("Error deleting photo from storage:", error);
              }
          });
        }
    } catch (e) {
        handleFirebaseError(e, "deletePhoto");
    }
  },

  async addPhotosBatch(userId: string, photos: PhotoItem[]): Promise<void> {
    const photosCollection = getPhotosCollection(userId);
    if (!db || !photosCollection) return;
    try {
        const batch = db.batch();
        photos.forEach(photo => {
            const docRef = photosCollection.doc(photo.id);
            batch.set(docRef, photo);
        });
        await batch.commit();
    } catch(e) {
        handleFirebaseError(e, "addPhotosBatch");
    }
  },

  // --- Packing List Methods ---
  async getPackingList(userId: string): Promise<PackingItem[]> {
      const packingListDoc = getPackingListDoc(userId);
      if (!packingListDoc) return [];
      try {
        const docSnap = await packingListDoc.get();
        if (docSnap.exists) {
            return docSnap.data()?.items || [];
        }
        return [];
      } catch(e) {
        handleFirebaseError(e, "getPackingList");
        return [];
      }
  },

  async savePackingList(userId: string, items: PackingItem[]): Promise<void> {
      const packingListDoc = getPackingListDoc(userId);
      if (!packingListDoc) return;
      try {
          await packingListDoc.set({ items });
      } catch(e) {
        handleFirebaseError(e, "savePackingList");
      }
  }
};