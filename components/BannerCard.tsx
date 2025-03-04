import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Banner } from '../utils/banners';

interface BannerCardProps {
  banner: Banner;
  className?: string;
}

export default function BannerCard({ banner, className = '' }: BannerCardProps) {
  const { title, description, imageUrl, link } = banner;

  return (
    <Link href={link}>
      <div
        className={`group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${className}`}
      >
        {/* Banner Image */}
        <div className="relative h-48 sm:h-64 w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover object-center group-hover:opacity-75"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Banner Content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm sm:text-base text-gray-200 line-clamp-2">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
} 