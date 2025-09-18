import { PhotoItem, PackingItem } from '../types.ts';
import { db, storage } from './firebaseConfig.ts';
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
// FIX: Changed import path from 'firebase/storage' to '@firebase/storage' to resolve potential module resolution issues.
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
} from '@firebase/storage';

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

// Collections references
const photosCollection = db ? collection(db, 'photos') : null;
const packingListDoc = db ? doc(db, 'packing/list') : null;

export const firebaseSyncService = {
  // --- Photo Album Methods ---
  async getPhotos(): Promise<PhotoItem[]> {
    if (!photosCollection) return [];
    try {
        const q = query(photosCollection, orderBy('dateTaken', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as PhotoItem);
    } catch(e) {
        handleFirebaseError(e, "getPhotos");
        return [];
    }
  },

  async savePhoto(photo: PhotoItem): Promise<void> {
    if (!photosCollection || !storage) return;
    try {
        const photoRef = doc(photosCollection, photo.id);
        let photoData = { ...photo };

        // If src is a base64 string, upload it to Storage
        if (photoData.src.startsWith('data:image')) {
            const storageRef = ref(storage, `photos/${photo.id}`);
            const snapshot = await uploadString(storageRef, photoData.src, 'data_url');
            const downloadURL = await getDownloadURL(snapshot.ref);
            photoData.src = downloadURL; // Update src to be the public URL
        }

        await setDoc(photoRef, photoData, { merge: true });
    } catch(e) {
        handleFirebaseError(e, "savePhoto");
    }
  },

  async deletePhoto(id: string): Promise<void> {
    if (!photosCollection || !storage) return;
    try {
        const photoRef = doc(photosCollection, id);
        await deleteDoc(photoRef);

        const storageRef = ref(storage, `photos/${id}`);
        // Attempt to delete from storage, but don't fail if it doesn't exist (e.g., placeholder images)
        await deleteObject(storageRef).catch(error => {
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
        const batch = writeBatch(db);
        photos.forEach(photo => {
            const docRef = doc(photosCollection, photo.id);
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
        const docSnap = await getDoc(packingListDoc);
        if (docSnap.exists()) {
            return docSnap.data().items || [];
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
          await setDoc(packingListDoc, { items });
      } catch(e) {
        handleFirebaseError(e, "savePackingList");
      }
  }
};