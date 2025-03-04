import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useApp } from '../contexts/AppContext';
import { signOut } from '../utils/auth';
import { showSuccess, showError } from '../utils/notifications';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user, isAdmin } = useApp();

  const handleSignOut = async () => {
    try {
      await signOut();
      showSuccess('Signed out successfully');
      router.push('/');
    } catch (error) {
      showError(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and main navigation */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-gray-900">
                BanglaBazar
              </Link>
              <nav className="ml-10 space-x-4">
                <Link href="/products" className="text-gray-700 hover:text-gray-900">
                  Products
                </Link>
                <Link href="/about" className="text-gray-700 hover:text-gray-900">
                  About
                </Link>
                <Link href="/contact" className="text-gray-700 hover:text-gray-900">
                  Contact
                </Link>
              </nav>
            </div>

            {/* User navigation */}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  {isAdmin && (
                    <Link href="/admin" className="text-gray-700 hover:text-gray-900">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="text-gray-700 hover:text-gray-900"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/admin/login" className="text-gray-700 hover:text-gray-900">
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Store information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">BanglaBazar</h3>
              <p className="text-gray-300">
                Your trusted source for authentic South Asian groceries in Lansdale, PA.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/products" className="text-gray-300 hover:text-white">
                    Products
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-300 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2 text-gray-300">
                <li>123 Main Street</li>
                <li>Lansdale, PA 19446</li>
                <li>Phone: (215) 555-0123</li>
                <li>Email: info@banglabazar.com</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
            <p>&copy; {new Date().getFullYear()} BanglaBazar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 