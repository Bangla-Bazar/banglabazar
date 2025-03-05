import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { app } from './firebase';

const db = getFirestore(app);
const BANNERS_COLLECTION = 'banners';

export interface Banner {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  createdAt: Date;
}

export interface CreateBannerData {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export interface UpdateBannerData {
  title?: string;
  description?: string;
  imageUrl?: string;
  link?: string;
}

export async function createBanner(data: CreateBannerData): Promise<Banner> {
  try {
    const now = new Date();
    const docRef = await addDoc(collection(db, BANNERS_COLLECTION), {
      ...data,
      createdAt: now,
    });

    return {
      id: docRef.id,
      ...data,
      createdAt: now,
    };
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
}

export async function updateBanner(id: string, data: UpdateBannerData): Promise<void> {
  try {
    const docRef = doc(db, BANNERS_COLLECTION, id);
    const formattedData = Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as { [key: string]: any });
    await updateDoc(docRef, formattedData);
  } catch (error) {
    console.error('Error updating banner:', error);
    throw error;
  }
}

export async function deleteBanner(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, BANNERS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting banner:', error);
    throw error;
  }
}

export async function getBanner(id: string): Promise<Banner | null> {
  try {
    const docRef = doc(db, BANNERS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
      } as Banner;
    }

    return null;
  } catch (error) {
    console.error('Error getting banner:', error);
    throw error;
  }
}

export async function getBanners(maxBanners: number = 5): Promise<Banner[]> {
  try {
    const q = query(
      collection(db, BANNERS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(maxBanners)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt instanceof Timestamp ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt),
    })) as Banner[];
  } catch (error) {
    console.error('Error getting banners:', error);
    throw error;
  }
} 