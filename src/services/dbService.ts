import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { PackingItem } from '../types';

const PACKING_COLLECTION = 'packingItems';

// Firestore database instance
let db: firebase.firestore.Firestore | null = null;

// Initialize Firestore
try {
  if (firebase.apps.length > 0) {
    db = firebase.firestore();
  }
} catch (error) {
  console.error("Error initializing Firestore:", error);
}

// Database service object
export const dbService = {
  // --- Packing List ---

  subscribeToPackingList(onUpdate: (items: PackingItem[]) => void): () => void {
    if (!db) {
      onUpdate([]);
      return () => { };
    }

    return db.collection(PACKING_COLLECTION)
      .onSnapshot((snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as PackingItem[];
        onUpdate(items);
      }, (error) => {
        console.error("Error subscribing to packing list:", error);
      });
  },

  async addPackingItem(item: Omit<PackingItem, 'id'>): Promise<void> {
    if (!db) throw new Error("Firestore not initialized");
    try {
      await db.collection(PACKING_COLLECTION).add(item);
    } catch (error) {
      console.error("Error adding packing item:", error);
      throw error;
    }
  },

  async updatePackingItem(id: string, updates: Partial<PackingItem>): Promise<void> {
    if (!db) throw new Error("Firestore not initialized");
    try {
      await db.collection(PACKING_COLLECTION).doc(id).update(updates);
    } catch (error) {
      console.error("Error updating packing item:", error);
      throw error;
    }
  },

  async deletePackingItem(id: string): Promise<void> {
    if (!db) throw new Error("Firestore not initialized");
    try {
      await db.collection(PACKING_COLLECTION).doc(id).delete();
    } catch (error) {
      console.error("Error deleting packing item:", error);
      throw error;
    }
  },

  // --- Photos ---

  subscribeToPhotos(onUpdate: (photos: any[]) => void): () => void {
    if (!db) {
      onUpdate([]);
      return () => { };
    }

    return db.collection('photos')
      .onSnapshot((snapshot) => {
        const photos = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        onUpdate(photos);
      }, (error) => {
        console.error("Error subscribing to photos:", error);
      });
  },

  async addPhotosBatch(photos: any[]): Promise<void> {
    if (!db) throw new Error("Firestore not initialized");
    const batch = db.batch();
    photos.forEach(photo => {
      const docRef = db!.collection('photos').doc(photo.id);
      batch.set(docRef, photo);
    });
    try {
      await batch.commit();
    } catch (error) {
      console.error("Error adding photos batch:", error);
      throw error;
    }
  },

  async updatePhoto(id: string, updates: any): Promise<void> {
    if (!db) throw new Error("Firestore not initialized");
    try {
      await db.collection('photos').doc(id).update(updates);
    } catch (error) {
      console.error("Error updating photo:", error);
      throw error;
    }
  },

  async deletePhoto(id: string, _src: string): Promise<void> {
    if (!db) throw new Error("Firestore not initialized");
    try {
      await db.collection('photos').doc(id).delete();
      // Note: Deleting the actual file from Storage is not implemented here 
      // as it requires firebase.storage() which might need separate config/init
      // depending on how it was set up. For now, we just delete the metadata.
      // If storage reference is available, we could do:
      // await firebase.storage().refFromURL(src).delete();
    } catch (error) {
      console.error("Error deleting photo:", error);
      throw error;
    }
  },

  async uploadImageToStorage(file: File): Promise<string> {
    if (!firebase.apps.length) throw new Error("Firebase not initialized");
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child(`photos/${Date.now()}_${file.name}`);
    try {
      const snapshot = await fileRef.put(file);
      return await snapshot.ref.getDownloadURL();
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  },

  // --- Budgets ---

  subscribeToBudgets(onUpdate: (budgets: Record<string, any[]>) => void): () => void {
    if (!db) {
      onUpdate({});
      return () => { };
    }

    // We store budgets in a 'budgets' collection, where document ID is the cityId
    return db.collection('budgets')
      .onSnapshot((snapshot) => {
        const budgets: Record<string, any[]> = {};
        snapshot.docs.forEach(doc => {
          budgets[doc.id] = doc.data().items || [];
        });
        onUpdate(budgets);
      }, (error) => {
        console.error("Error subscribing to budgets:", error);
      });
  },

  async updateCityBudget(cityId: string, items: any[]): Promise<void> {
    if (!db) throw new Error("Firestore not initialized");
    try {
      await db.collection('budgets').doc(cityId).set({ items }, { merge: true });
    } catch (error) {
      console.error("Error updating city budget:", error);
      throw error;
    }
  }
};