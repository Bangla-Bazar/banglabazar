import toast from 'react-hot-toast';
import { FirebaseError } from 'firebase/app';

export function showSuccess(message: string) {
  toast.success(message);
}

export function showError(error: unknown) {
  let message = 'An unexpected error occurred';

  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/wrong-password':
        message = 'Invalid email or password';
        break;
      case 'auth/user-not-found':
        message = 'No user found with this email';
        break;
      case 'auth/email-already-in-use':
        message = 'Email is already registered';
        break;
      case 'auth/weak-password':
        message = 'Password is too weak';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address';
        break;
      case 'auth/operation-not-allowed':
        message = 'Operation not allowed';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Please try again later';
        break;
      case 'storage/unauthorized':
        message = 'Unauthorized access to storage';
        break;
      case 'storage/canceled':
        message = 'Upload canceled';
        break;
      case 'storage/unknown':
        message = 'Unknown storage error occurred';
        break;
      default:
        message = (error as { message?: string }).message || 'An error occurred';
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  toast.error(message);
}

export function showLoading(message: string) {
  return toast.loading(message);
}

export function dismissToast(toastId: string) {
  toast.dismiss(toastId);
}

export function showInfo(message: string) {
  toast(message);
} 