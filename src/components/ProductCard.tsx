'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Product } from '@/lib/data';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  
  // Function to get the correct image path based on product ID
  const getImagePath = () => {
    // Define the mapping of product IDs to file formats
    const productFormats: Record<number, string> = {
      1: '.jpeg',
      2: '.webp',
      3: '.webp',
      4: '.webp',
      5: '.webp',
      6: '.webp',
      7: '.webp',
      8: '.webp',
      9: '.webp',
      10: '.jpg',
      11: '.jpg',
      12: '.jpg',
      13: '.jpg',
      14: '.jpg',
      15: '.jpg',
      16: '.jpeg',
      17: '.png',
      18: '.jpg',
      19: '.jpeg',
      20: '.png',
    };
    
    // Get the format for the current product or use default
    const format = productFormats[product.id] || '.jpg';
    
    return `${product.imagePath}/HomeProduct${format}`;
  };

  // Fallback image path if original fails
  const getFallbackImage = () => {
    return '/images/Empty-cart.jpg';
  };

  return (
    <div className="group relative rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      <Link href={`/products/${product.id}`} className="block h-full w-full">
        <div className="relative h-64 w-full overflow-hidden rounded-t-lg">
          <Image
            src={imageError ? getFallbackImage() : getImagePath()}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            width={300}
            height={300}
            onError={() => setImageError(true)}
          />
        </div>
        <div className="p-4">
          <h3 className="mb-1 text-lg font-medium text-gray-900">{product.name}</h3>
          <p className="mb-2 text-xl font-bold text-indigo-600">₹{product.price}</p>
          <div className="mt-4">
            <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
              {product.category}
            </span>
          </div>
          <button className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700">
            View Details
          </button>
        </div>
      </Link>
    </div>
  );
} 