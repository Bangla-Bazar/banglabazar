'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getAllBanners, getHotProducts, getSeasonalProducts } from '@/lib/firestore';
import { Banner, Product } from '@/types';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [hotProducts, setHotProducts] = useState<Product[]>([]);
  const [seasonalProducts, setSeasonalProducts] = useState<Product[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannersData, hotProductsData, seasonalProductsData] = await Promise.all([
          getAllBanners(),
          getHotProducts(),
          getSeasonalProducts(),
        ]);
        // Sort banners by createdAt in descending order
        const sortedBanners = [...bannersData].sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );
        // Sort products by createdAt in descending order
        const sortedHotProducts = [...hotProductsData].sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );
        const sortedSeasonalProducts = [...seasonalProductsData].sort((a, b) => 
          b.createdAt.getTime() - a.createdAt.getTime()
        );
        setBanners(sortedBanners);
        setHotProducts(sortedHotProducts);
        setSeasonalProducts(sortedSeasonalProducts);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Auto-sweep effect
  useEffect(() => {
    if (banners.length <= 1) return; // Don't auto-sweep if there's only one banner

    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds

    return () => clearInterval(interval);
  }, [banners.length]);

  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Banner Section */}
      {banners.length > 0 && (
        <div className="relative h-[400px] md:h-[500px]">
          <Image
            src={banners[currentBannerIndex].imageUrl}
            alt={banners[currentBannerIndex].title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {banners[currentBannerIndex].title}
              </h1>
              <p className="text-lg md:text-xl mb-8">
                {banners[currentBannerIndex].description}
              </p>
              {banners[currentBannerIndex].link && (
                <Link
                  href={banners[currentBannerIndex].link}
                  className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
                >
                  Shop Now
                </Link>
              )}
            </div>
          </div>
          {banners.length > 1 && (
            <>
              <button
                onClick={prevBanner}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={nextBanner}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}
          {/* Banner Indicators */}
          {banners.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentBannerIndex
                      ? 'bg-white w-4'
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Hot Products Section */}
      {hotProducts.length > 0 && (
        <section className="py-16 px-4 md:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Hot Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {hotProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products?tag=${encodeURIComponent(product.tags[0])}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Seasonal Products Section */}
      {seasonalProducts.length > 0 && (
        <section className="py-16 px-4 md:px-8 bg-gray-50">
          <h2 className="text-3xl font-bold text-center mb-12">Seasonal Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {seasonalProducts.map((product) => (
              <Link
                key={product.id}
                href={`/products?tag=${encodeURIComponent(product.tags[0])}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  {product.seasonalEndDate && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                      Available until {new Date(product.seasonalEndDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
} 