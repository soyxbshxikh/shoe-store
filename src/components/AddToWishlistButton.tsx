'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/data';

// Helper function to trigger wishlist update notification
const notifyWishlistUpdated = () => {
  window.dispatchEvent(new Event('wishlistUpdated'));
};

interface AddToWishlistButtonProps {
  product: Product;
}

export default function AddToWishlistButton({ product }: AddToWishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if product is already in wishlist on load
  useEffect(() => {
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    const exists = wishlistItems.some((item: any) => item.id === product.id);
    setIsInWishlist(exists);
  }, [product.id]);

  const toggleWishlist = () => {
    // Prevent multiple clicks
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    // Get existing wishlist
    const wishlistItems = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
    
    if (isInWishlist) {
      // Remove from wishlist
      const updatedWishlist = wishlistItems.filter((item: any) => item.id !== product.id);
      localStorage.setItem('wishlistItems', JSON.stringify(updatedWishlist));
      setIsInWishlist(false);
    } else {
      // Add to wishlist
      wishlistItems.push(product);
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
      setIsInWishlist(true);
    }

    // Notify about wishlist update
    notifyWishlistUpdated();
    
    // Reset processing state after a short delay
    setTimeout(() => {
      setIsProcessing(false);
    }, 500);
  };
  
  return (
    <button
      onClick={toggleWishlist}
      disabled={isProcessing}
      className={`flex w-full items-center justify-center rounded-md border px-6 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        isInWishlist
          ? 'border-red-500 bg-white text-red-500 hover:bg-red-50'
          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
      }`}
    >
      {isProcessing
        ? 'Processing...'
        : isInWishlist
          ? 'Remove from Wishlist'
          : 'Add to Wishlist'}
    </button>
  );
} 