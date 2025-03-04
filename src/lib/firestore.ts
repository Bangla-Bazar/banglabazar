import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import { Product, Banner } from '@/types';

// Product Functions
export async function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, imageFile: File) {
  const storageRef = ref(storage, `products/${imageFile.name}-${Date.now()}`);
  const uploadResult = await uploadBytes(storageRef, imageFile);
  const imageUrl = await getDownloadURL(uploadResult.ref);

  const productData = {
    ...product,
    imageUrl,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'products'), productData);
  return { id: docRef.id, ...productData };
}

export async function updateProduct(
  productId: string,
  updates: Partial<Product>,
  imageFile?: File
) {
  const productRef = doc(db, 'products', productId);
  let imageUrl = updates.imageUrl;

  if (imageFile) {
    const storageRef = ref(storage, `products/${imageFile.name}-${Date.now()}`);
    const uploadResult = await uploadBytes(storageRef, imageFile);
    imageUrl = await getDownloadURL(uploadResult.ref);
  }

  const updateData = {
    ...updates,
    ...(imageUrl && { imageUrl }),
    updatedAt: Timestamp.now(),
  };

  await updateDoc(productRef, updateData);
  return { id: productId, ...updateData };
}

export async function deleteProduct(productId: string, imageUrl: string) {
  if (imageUrl) {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  }
  await deleteDoc(doc(db, 'products', productId));
}

export async function getAllProducts() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  return querySnapshot.docs.map(docToProduct);
}

export async function getHotProducts() {
  const q = query(
    collection(db, 'products'),
    where('isHotProduct', '==', true)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docToProduct);
}

// Banner Functions
export async function addBanner(banner: Omit<Banner, 'id' | 'createdAt'>, imageFile: File) {
  const storageRef = ref(storage, `banners/${imageFile.name}-${Date.now()}`);
  const uploadResult = await uploadBytes(storageRef, imageFile);
  const imageUrl = await getDownloadURL(uploadResult.ref);

  const bannerData = {
    ...banner,
    imageUrl,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, 'banners'), bannerData);
  return { id: docRef.id, ...bannerData };
}

export async function deleteBanner(bannerId: string, imageUrl: string) {
  if (imageUrl) {
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  }
  await deleteDoc(doc(db, 'banners', bannerId));
}

export async function getAllBanners() {
  const q = query(
    collection(db, 'banners'),
    limit(5)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(docToBanner);
}

// Helper Functions
function docToProduct(doc: QueryDocumentSnapshot<DocumentData>): Product {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    price: data.price,
    imageUrl: data.imageUrl,
    tags: data.tags,
    isHotProduct: data.isHotProduct,
    createdAt: data.createdAt.toDate(),
    updatedAt: data.updatedAt.toDate(),
  };
}

function docToBanner(doc: QueryDocumentSnapshot<DocumentData>): Banner {
  const data = doc.data();
  return {
    id: doc.id,
    imageUrl: data.imageUrl,
    title: data.title,
    description: data.description,
    link: data.link,
    createdAt: data.createdAt.toDate(),
  };
} 