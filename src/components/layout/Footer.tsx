import Link from 'next/link';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Store Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">BanglaBazar</h3>
            <p className="text-gray-300">
              Your one-stop shop for authentic Bangladeshi and Indian groceries in Lansdale.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Home
                </Link>
              </li>
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
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <p className="flex items-center text-gray-300">
                <MapPinIcon className="h-5 w-5 mr-2" />
                123 Main Street, Lansdale, PA 19446
              </p>
              <p className="flex items-center text-gray-300">
                <PhoneIcon className="h-5 w-5 mr-2" />
                (215) 555-0123
              </p>
              <p className="flex items-center text-gray-300">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                info@banglabazar.com
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} BanglaBazar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 