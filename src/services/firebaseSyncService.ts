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

// FIX: Use compat API which works with collection strings.
const photosCollection = db ? db.collection('photos') : null;
const packingListDoc = db ? db.collection('packing').doc('list') : null;

export const firebaseSyncService = {
  // --- Photo Album Methods ---
  async getPhotos(): Promise<PhotoItem[]> {
    if (!photosCollection) return [];
    try {
        // FIX: Use compat API for querying and ordering.
        const snapshot = await photosCollection.orderBy('dateTaken', 'desc').get();
        return snapshot.docs.map(doc => doc.data() as PhotoItem);
    } catch(e) {
        handleFirebaseError(e, "getPhotos");
        return [];
    }
  },

  async savePhoto(photo: PhotoItem): Promise<void> {
    if (!photosCollection || !storage) return;
    try {
        // FIX: Use compat API for doc references.
        const photoRef = photosCollection.doc(photo.id);
        let photoData = { ...photo };

        // If src is a base64 string, upload it to Storage
        if (photoData.src.startsWith('data:image')) {
            // FIX: Use compat Storage API.
            const storageRef = storage.ref(`photos/${photo.id}`);
            const snapshot = await storageRef.putString(photoData.src, 'data_url');
            const downloadURL = await snapshot.ref.getDownloadURL();
            photoData.src = downloadURL; // Update src to be the public URL
        }
        
        // FIX: Use compat set method.
        await photoRef.set(photoData, { merge: true });
    } catch(e) {
        handleFirebaseError(e, "savePhoto");
    }
  },

  async deletePhoto(id: string): Promise<void> {
    if (!photosCollection || !storage) return;
    try {
        // FIX: Use compat doc().delete() methods.
        const photoRef = photosCollection.doc(id);
        await photoRef.delete();

        const storageRef = storage.ref(`photos/${id}`);
        // Attempt to delete from storage, but don't fail if it doesn't exist (e.g., placeholder images)
        await storageRef.delete().catch(error => {
            if (error.code !== 'storage/object-not-found') {
                console.error("Error deleting photo from storage:", error);
            }
        });
    } catch (e) {
        handleFirebaseError(e, "deletePhoto");
    }
  },

  async addPhotosBatch(photos: PhotoItem[]): Promise<void> {
    if (!db || !photosCollection) return;
    try {
        // FIX: Use compat batch API.
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
  async getPackingList(): Promise<PackingItem[]> {
      if (!packingListDoc) return [];
      try {
        // FIX: Use compat get() method.
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

  async savePackingList(items: PackingItem[]): Promise<void> {
      if (!packingListDoc) return;
      try {
          // We store the entire list in a single document under the 'items' field
          // FIX: Use compat set() method.
          await packingListDoc.set({ items });
      } catch(e) {
        handleFirebaseError(e, "savePackingList");
      }
  }
};