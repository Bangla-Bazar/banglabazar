'use client';

import Image from 'next/image';
import { MapPinIcon, PhoneIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <Image
          src="/images/store-front.jpg"
          alt="BanglaBazar Store Front"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">About BanglaBazar</h1>
            <p className="text-xl">Your Authentic South Asian Grocery Store in Lansdale</p>
          </div>
        </div>
      </div>

      {/* Store Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="prose prose-lg text-gray-600">
              <p>
                Welcome to BanglaBazar, your premier destination for authentic Bangladeshi and Indian groceries in Lansdale, Pennsylvania. Since our establishment, we have been committed to bringing the finest South Asian products to our local community.
              </p>
              <p className="mt-4">
                Our store offers a wide selection of fresh vegetables, spices, rice, lentils, snacks, and other essential ingredients for South Asian cuisine. We take pride in sourcing high-quality products directly from trusted suppliers to ensure authenticity and freshness.
              </p>
              <p className="mt-4">
                At BanglaBazar, we believe in providing not just products, but a piece of home to our customers. Our knowledgeable staff is always ready to assist you in finding the perfect ingredients for your favorite recipes.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Visit Us</h2>
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPinIcon className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Location</h3>
                    <p className="text-gray-600">123 Main Street</p>
                    <p className="text-gray-600">Lansdale, PA 19446</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <PhoneIcon className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Contact</h3>
                    <p className="text-gray-600">Phone: (215) 555-0123</p>
                    <p className="text-gray-600">Email: info@banglabazar.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <ClockIcon className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Store Hours</h3>
                    <p className="text-gray-600">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                    <p className="text-gray-600">Sunday: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="mt-6 h-[300px] rounded-lg overflow-hidden shadow-sm">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d-75.2833!3d40.2414!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c6a6e8b8b8b8b8%3A0x8b8b8b8b8b8b8b8b!2sLansdale%2C%20PA!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 