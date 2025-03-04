import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from './firebase';

const storage = getStorage(app);

export type UploadResult = {
  downloadUrl: string;
  path: string;
};

/**
 * Uploads a file to Firebase Storage
 * @param file The file to upload
 * @param path The path in storage where the file should be stored
 * @returns Promise containing the download URL and storage path
 */
export async function uploadFile(file: File, path: string): Promise<UploadResult> {
  try {
    // Create a storage reference
    const storageRef = ref(storage, path);

    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);

    // Get the download URL
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return {
      downloadUrl,
      path: snapshot.ref.fullPath,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
}

/**
 * Uploads a product image to Firebase Storage
 * @param file The image file to upload
 * @param productId The ID of the product
 * @returns Promise containing the download URL and storage path
 */
export async function uploadProductImage(file: File, productId: string): Promise<UploadResult> {
  const extension = file.name.split('.').pop();
  const path = `products/${productId}.${extension}`;
  return uploadFile(file, path);
}

/**
 * Uploads a banner image to Firebase Storage
 * @param file The image file to upload
 * @param bannerId The ID of the banner
 * @returns Promise containing the download URL and storage path
 */
export async function uploadBannerImage(file: File, bannerId: string): Promise<UploadResult> {
  const extension = file.name.split('.').pop();
  const path = `banners/${bannerId}.${extension}`;
  return uploadFile(file, path);
} 