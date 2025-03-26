'use client';

import { useState } from 'react';
import { Product } from '@/lib/data';
import ProductOptions from './ProductOptions';
import AddToCartButton from './AddToCartButton';
import AddToWishlistButton from './AddToWishlistButton';

interface ProductDetailActionsProps {
  product: Product;
}

export default function ProductDetailActions({ product }: ProductDetailActionsProps) {
  // Keep the state for cart functionality but set default color automatically
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const handleSizeChange = (size: number) => {
    setSelectedSize(size);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Product Options (Sizes only) */}
      <ProductOptions
        sizes={product.sizes}
        onSizeChange={handleSizeChange}
        selectedSize={selectedSize}
      />
      
      {/* Action Buttons */}
      <div className="mt-4 sm:mt-6 md:mt-8 flex flex-col xs:flex-row gap-2 xs:gap-3 sm:gap-4">
        <div className="flex-grow">
          <AddToCartButton 
            product={product} 
            selectedColor={selectedColor}
            selectedSize={selectedSize}
          />
        </div>
        <div className="mt-2 xs:mt-0">
          <AddToWishlistButton product={product} />
        </div>
      </div>
    </div>
  );
} 