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
  where,
  orderBy,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { app } from './firebase';

const db = getFirestore(app);
const PRODUCTS_COLLECTION = 'products';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tags: string[];
  isHotProduct: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  tags: string[];
  isHotProduct: boolean;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  imageUrl?: string;
  tags?: string[];
  isHotProduct?: boolean;
}

export async function createProduct(data: CreateProductData): Promise<Product> {
  try {
    const now = new Date();
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });

    return {
      id: docRef.id,
      ...data,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: string, data: UpdateProductData): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, PRODUCTS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}

export async function getProduct(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
      } as Product;
    }

    return null;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
}

export interface GetProductsOptions {
  tag?: string;
  isHotProduct?: boolean;
  sortBy?: 'createdAt' | 'price';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  startAfter?: QueryDocumentSnapshot<Product>;
}

export async function getProducts(options: GetProductsOptions = {}): Promise<Product[]> {
  try {
    let q = collection(db, PRODUCTS_COLLECTION);

    // Apply filters
    if (options.tag) {
      q = query(q, where('tags', 'array-contains', options.tag));
    }
    if (typeof options.isHotProduct === 'boolean') {
      q = query(q, where('isHotProduct', '==', options.isHotProduct));
    }

    // Apply sorting
    if (options.sortBy) {
      q = query(q, orderBy(options.sortBy, options.sortOrder || 'desc'));
    }

    // Apply pagination
    if (options.limit) {
      q = query(q, limit(options.limit));
    }
    if (options.startAfter) {
      q = query(q, startAfter(options.startAfter));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt instanceof Timestamp ? doc.data().createdAt.toDate() : new Date(doc.data().createdAt),
      updatedAt: doc.data().updatedAt instanceof Timestamp ? doc.data().updatedAt.toDate() : new Date(doc.data().updatedAt),
    })) as Product[];
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
} 