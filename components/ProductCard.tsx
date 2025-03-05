import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../utils/products';
import Badge from './Badge';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { id, name, description, imageUrl, tags, isHotProduct } = product;

  return (
    <Link href={`/products/${id}`}>
      <div
        className={`group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow ${className}`}
      >
        {/* Product Image */}
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-lg bg-gray-200">
          <Image
            src={imageUrl}
            alt={name}
            width={500}
            height={500}
            className="h-full w-full object-cover object-center group-hover:opacity-75"
          />
          {isHotProduct && (
            <div className="absolute top-2 right-2">
              <Badge variant="danger">Hot</Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="px-4 py-4">
          <h3 className="text-sm font-medium text-gray-900">{name}</h3>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{description}</p>
          <div className="mt-2">
            <div className="flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" size="sm">
                  {tag}
                </Badge>
              ))}
              {tags.length > 2 && (
                <Badge variant="secondary" size="sm">
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
} 