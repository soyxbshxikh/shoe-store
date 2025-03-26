'use client';

import { useState } from 'react';
import { Product } from '@/lib/data';

// Helper function to trigger cart update notification
const notifyCartUpdated = () => {
  window.dispatchEvent(new Event('cartUpdated'));
};

interface AddToCartButtonProps {
  product: Product;
  selectedColor?: string;
  selectedSize?: number | null;
}

export default function AddToCartButton({ 
  product, 
  selectedColor = '', 
  selectedSize = null 
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addToCart = () => {
    // Reset error state
    setError(null);
    
    // Prevent multiple clicks
    if (isAdding) return;
    
    // Only validate size selection
    if (!selectedSize && product.sizes.length > 0) {
      setError('Please select a size');
      return;
    }
    
    setIsAdding(true);
    
    // Get existing cart
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Create cart item with selected options
    const cartItem = {
      ...product,
      selectedColor: selectedColor || product.colors[0] || '',
      selectedSize: selectedSize || product.sizes[0] || 0,
      quantity: 1
    };
    
    // Check if product with same options is already in cart
    const existingProductIndex = cartItems.findIndex(
      (item: any) => 
        item.id === product.id && 
        item.selectedSize === cartItem.selectedSize
    );
    
    if (existingProductIndex !== -1) {
      // Increment quantity if already in cart
      cartItems[existingProductIndex].quantity += 1;
    } else {
      // Add new product with selected options
      cartItems.push(cartItem);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Notify about cart update
    notifyCartUpdated();
    
    // Show success state
    setIsAdded(true);
    
    // Reset buttons after 1.5s
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(false);
    }, 1500);
  };
  
  return (
    <div className="w-full">
      <button
        onClick={addToCart}
        disabled={isAdding || !product.inStock}
        className={`flex w-full items-center justify-center rounded-md px-6 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
          !product.inStock
            ? 'cursor-not-allowed bg-gray-300 text-gray-500'
            : isAdded
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {!product.inStock
          ? 'Out of Stock'
          : isAdded
            ? 'Added to Cart ✓'
            : isAdding
              ? 'Adding...'
              : 'Add to Cart'}
      </button>
      
      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
} 