'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { adminData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !adminData) {
      router.push('/admin/login');
    }
  }, [adminData, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!adminData) {
    return null;
  }

  return <>{children}</>;
} 