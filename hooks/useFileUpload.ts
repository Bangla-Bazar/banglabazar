import { useState, useCallback } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../utils/firebase';

interface FileUploadOptions {
  path: string;
  maxSizeBytes?: number;
  allowedTypes?: string[];
  onProgress?: (progress: number) => void;
  onSuccess?: (url: string) => void;
  onError?: (error: Error) => void;
}

interface FileUploadState {
  isUploading: boolean;
  progress: number;
  error: Error | null;
  url: string | null;
}

interface UseFileUploadReturn extends FileUploadState {
  upload: (file: File) => Promise<string>;
  reset: () => void;
}

export default function useFileUpload({
  path,
  maxSizeBytes = 5 * 1024 * 1024, // 5MB default
  allowedTypes = ['image/jpeg', 'image/png', 'image/gif'],
  onProgress,
  onSuccess,
  onError,
}: FileUploadOptions): UseFileUploadReturn {
  const [state, setState] = useState<FileUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    url: null,
  });

  const validateFile = useCallback(
    (file: File): Error | null => {
      if (file.size > maxSizeBytes) {
        return new Error(
          `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${(
            maxSizeBytes / 1024 / 1024
          ).toFixed(2)}MB)`
        );
      }

      if (!allowedTypes.includes(file.type)) {
        return new Error(
          `File type (${file.type}) not allowed. Allowed types: ${allowedTypes.join(
            ', '
          )}`
        );
      }

      return null;
    },
    [maxSizeBytes, allowedTypes]
  );

  const upload = useCallback(
    async (file: File): Promise<string> => {
      const validationError = validateFile(file);
      if (validationError) {
        setState(prev => ({ ...prev, error: validationError }));
        onError?.(validationError);
        throw validationError;
      }

      setState(prev => ({
        ...prev,
        isUploading: true,
        progress: 0,
        error: null,
        url: null,
      }));

      try {
        // Generate a unique file name
        const extension = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extension}`;
        const fullPath = `${path}/${fileName}`;

        // Create storage reference
        const storageRef = ref(storage, fullPath);

        // Upload file
        const snapshot = await uploadBytes(storageRef, file);

        // Get download URL
        const downloadUrl = await getDownloadURL(snapshot.ref);

        setState(prev => ({
          ...prev,
          isUploading: false,
          progress: 100,
          url: downloadUrl,
        }));

        onSuccess?.(downloadUrl);
        return downloadUrl;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Upload failed');
        setState(prev => ({
          ...prev,
          isUploading: false,
          error,
        }));
        onError?.(error);
        throw error;
      }
    },
    [path, validateFile, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
      url: null,
    });
  }, []);

  return {
    ...state,
    upload,
    reset,
  };
} 