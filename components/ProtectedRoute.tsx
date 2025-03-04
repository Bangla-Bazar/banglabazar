import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '../contexts/AppContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireAdmin = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, userData, isLoading } = useApp();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/admin/login');
    } else if (!isLoading && requireAdmin && userData?.role !== 'admin') {
      router.replace('/');
    }
  }, [isLoading, user, userData, requireAdmin, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user || (requireAdmin && userData?.role !== 'admin')) {
    return null;
  }

  return <>{children}</>;
} 