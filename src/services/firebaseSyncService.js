import { db, storage } from './firebaseConfig.js';

// --- SERVICE FOR FIREBASE REAL-TIME SYNC ---
// This service centralizes data management for synced features.
// It uses Firestore for metadata and Cloud Storage for files.

const handleFirebaseError = (error, context) => {
    console.error(`Firebase error in ${context}:`, error);
    // Here you could add more robust error handling, e.g., reporting to a service
    throw error; // Re-throw the error to be handled by the calling component
};

// This check prevents the app from crashing if Firebase config is missing.
// Components will handle the null `db` or `storage` and show an error or disabled state.
if (!db || !storage) {
  console.warn("Firebase is not initialized. Sync features will be disabled.");
}

const SHARED_TRIP_ID = 'main_family_trip_v1';
const getSharedTripDoc = () => db?.collection('trips').doc(SHARED_TRIP_ID);
const getPhotosCollection = () => getSharedTripDoc()?.collection('photos');
const getPackingListDoc = () => getSharedTripDoc()?.collection('data').doc('packingList');
const getPhotoStorageRef = (photoId) => storage?.ref(`trips/${SHARED_TRIP_ID}/photos/${photoId}`);


export const firebaseSyncService = {
  // --- Photo Album Methods ---
  listenToPhotos(callback) {
    const photosCollection = getPhotosCollection();
    if (!photosCollection) return () => {};
    try {
      const unsubscribe = photosCollection.orderBy('dateTaken', 'desc').onSnapshot(snapshot => {
        callback(snapshot);
      }, (error) => handleFirebaseError(error, "listenToPhotos"));
      return unsubscribe;
    } catch (e) {
      handleFirebaseError(e, "listenToPhotos setup");
      return () => {};
    }
  },

  async savePhoto(photo) {
    const photosCollection = getPhotosCollection();
    if (!photosCollection || !storage) return;
    try {
        const photoRef = photosCollection.doc(photo.id);
        let photoData = { ...photo };

        // If the src is a new base64 upload, put it in storage and get the URL
        if (photoData.src.startsWith('data:image')) {
            const storageRef = getPhotoStorageRef(photo.id);
            if (!storageRef) throw new Error("Storage reference could not be created.");
            
            const snapshot = await storageRef.putString(photoData.src, 'data_url');
            const downloadURL = await snapshot.ref.getDownloadURL();
            photoData.src = downloadURL; // Replace base64 with permanent URL
        }
        
        await photoRef.set(photoData, { merge: true });
    } catch(e) {
        handleFirebaseError(e, "savePhoto");
    }
  },

  async deletePhoto(id) {
    const photosCollection = getPhotosCollection();
    if (!photosCollection || !storage) return;
    try {
        const photoRef = photosCollection.doc(id);
        await photoRef.delete();

        const storageRef = getPhotoStorageRef(id);
        if (storageRef) {
          // Attempt to delete from storage, but don't block if it fails (e.g., file doesn't exist)
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

  async addPhotosBatch(photos) {
    const photosCollection = getPhotosCollection();
    if (!db || !storage || !photosCollection) return;
    try {
        // Step 1: Parallelize all image uploads to Storage for speed.
        const processedPhotos = await Promise.all(photos.map(async (photo) => {
            if (photo.src.startsWith('data:image')) {
                const storageRef = getPhotoStorageRef(photo.id);
                if (!storageRef) throw new Error(`Storage reference failed for ${photo.id}`);
                const snapshot = await storageRef.putString(photo.src, 'data_url');
                const downloadURL = await snapshot.ref.getDownloadURL();
                return { ...photo, src: downloadURL }; // Return a new object with the permanent URL
            }
            return photo; // This photo already has a URL, no upload needed
        }));

        // Step 2: Write all processed photo metadata to Firestore in a single atomic batch operation.
        const batch = db.batch();
        processedPhotos.forEach(photo => {
            const docRef = photosCollection.doc(photo.id);
            batch.set(docRef, photo, { merge: true }); // Use merge to be safe
        });
        await batch.commit();
    } catch(e) {
        handleFirebaseError(e, "addPhotosBatch");
    }
  },

  // --- Packing List Methods ---
  listenToPackingList(callback) {
    const packingListDoc = getPackingListDoc();
    if (!packingListDoc) return () => {};
    try {
        const unsubscribe = packingListDoc.onSnapshot(docSnap => {
            callback(docSnap);
        }, (error) => {
            handleFirebaseError(error, "listenToPackingList");
        });
        return unsubscribe;
    } catch(e) {
        handleFirebaseError(e, "listenToPackingList setup");
        return () => {};
    }
  },

  async savePackingList(items) {
      const packingListDoc = getPackingListDoc();
      if (!packingListDoc) return;
      try {
          await packingListDoc.set({ items });
      } catch(e) {
        handleFirebaseError(e, "savePackingList");
      }
  }
};