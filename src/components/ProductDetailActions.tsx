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
    <div className="space-y-6">
      {/* Product Options (Sizes only) */}
      <ProductOptions
        sizes={product.sizes}
        onSizeChange={handleSizeChange}
        selectedSize={selectedSize}
      />
      
      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <AddToCartButton 
          product={product} 
          selectedColor={selectedColor}
          selectedSize={selectedSize}
        />
        <AddToWishlistButton product={product} />
      </div>
    </div>
  );
} 