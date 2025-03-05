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
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">BanglaBazar</h1>
            <p className="text-xl">Lansdale, PA</p>
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
                    <p className="text-gray-600">1745 N Broad St</p>
                    <p className="text-gray-600">Lansdale, PA 19446</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <PhoneIcon className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Contact</h3>
                    <p className="text-gray-600">Phone: (215) 393-8000</p>
                    <p className="text-gray-600">Email: banglabazarhmg@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <ClockIcon className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">Store Hours</h3>
                    <p className="text-gray-600">Open Daily: 10 AM - 10 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="mt-6 h-[300px] rounded-lg overflow-hidden shadow-sm">
              <iframe
                src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=1745%20N%20Broad%20St,%20Lansdale,%20PA%2019446+(Bangla%20Bazar%20Halal%20Meat%20&amp;%20Grocerys%20Name)&amp;t=&amp;z=15&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
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