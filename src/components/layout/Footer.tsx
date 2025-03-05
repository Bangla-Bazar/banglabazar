import Link from 'next/link';
import { MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Store Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Bangla Bazar Halal Meat & Grocery</h3>
            <p className="text-gray-300">
              Open 7 days a week from 10 AM to 10 PM
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
          {/* Highlights */}
          <div>
            <h3 className="text-xl font-bold mb-4">Highlights</h3>
            <div className="space-y-4">
              <p className="flex items-center text-gray-300">
                <span className="font-bold">✔ </span>
                Accepts SNAP/EBT
              </p>
              <p className="flex items-center text-gray-300">
              <span className="font-bold">✔ </span>
              Accepts credit cards
              </p>
              <p className="flex items-center text-gray-300">
              <span className="font-bold">✔ </span>
              Accepts credit cards
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-4">
              <p className="flex items-center text-gray-300">
                <MapPinIcon className="h-5 w-5 mr-2" />
                1745 N Broad St, Lansdale, PA 19446
              </p>
              <p className="flex items-center text-gray-300">
                <PhoneIcon className="h-5 w-5 mr-2" />
                (215) 393-8000
              </p>
              <p className="flex items-center text-gray-300">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                banglabazarhmg@gmail.com
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