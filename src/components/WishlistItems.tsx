'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { WishlistItem } from '@/app/wishlist/page';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Helper functions to trigger update notifications
const notifyWishlistUpdated = () => {
  window.dispatchEvent(new Event('wishlistUpdated'));
};

const notifyCartUpdated = () => {
  window.dispatchEvent(new Event('cartUpdated'));
};

export default function WishlistItems() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const router = useRouter();

  // Load wishlist items from localStorage when component mounts
  useEffect(() => {
    const loadWishlistItems = () => {
      try {
        const wishlistData = localStorage.getItem('wishlistItems');
        if (wishlistData) {
          const wishlistItems = JSON.parse(wishlistData);
          setItems(wishlistItems);
        }
      } catch (error) {
        // Remove console.error for production
        // console.error('Error loading wishlist items:', error);
        setItems([]);
      }
    };

    loadWishlistItems();
    
    // Add event listener for storage events from other tabs
    window.addEventListener('storage', loadWishlistItems);
    
    return () => {
      window.removeEventListener('storage', loadWishlistItems);
    };
  }, []);

  // Get the correct image path based on product ID
  const getImagePath = (item: WishlistItem) => {
    // Different product folders have different image formats
    if (item.id === 1) {
      return `${item.imagePath}/HomeProduct.jpeg`;
    } else if (item.id >= 2 && item.id <= 9) {
      return `${item.imagePath}/HomeProduct.webp`;
    } else if (item.id === 16 || item.id === 19) {
      return `${item.imagePath}/HomeProduct.jpeg`;
    } else if (item.id === 17 || item.id === 20) {
      return `${item.imagePath}/HomeProduct.png`;
    } else {
      return `${item.imagePath}/HomeProduct.jpg`;
    }
  };

  const handleImageError = (imagePath: string) => {
    setFailedImages(prev => ({ ...prev, [imagePath]: true }));
  };

  const handleRemoveFromWishlist = (id: number) => {
    // Remove item from wishlist
    const updatedItems = items.filter(item => item.id !== id);
    
    // Update localStorage
    localStorage.setItem('wishlistItems', JSON.stringify(updatedItems));
    
    // Update state
    setItems(updatedItems);

    // Notify about wishlist update
    notifyWishlistUpdated();
  };

  const handleAddToCart = (item: WishlistItem) => {
    try {
      // Get existing cart
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      
      // Check if item is already in cart
      const existingProductIndex = cartItems.findIndex(
        (cartItem: any) => cartItem.id === item.id
      );
      
      if (existingProductIndex !== -1) {
        // Increment quantity if already in cart
        cartItems[existingProductIndex].quantity += 1;
      } else {
        // Add new product with quantity 1
        cartItems.push({
          ...item,
          quantity: 1
        });
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      // Notify about cart update
      notifyCartUpdated();
      
      // Optionally, show a success message
      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart`,
        status: "success",
        duration: 3000
      });
      
      router.push('/cart');
    } catch (error) {
      // Remove console.error for production
      // console.error('Error adding to cart:', error);
      toast({
        title: "Couldn't add to cart",
        description: "There was a problem adding this item to your cart",
        status: "error",
        duration: 3000
      });
    }
  };

  // If wishlist is empty, show empty state
  if (items.length === 0) {
    return (
      <div className="mt-4 sm:mt-8 text-center">
        <div className="mb-4 sm:mb-6 flex justify-center">
          <Image 
            src="/images/Empty-cart.jpg" 
            alt="Empty wishlist" 
            width={200} 
            height={200} 
            className="object-contain max-w-[150px] sm:max-w-[200px]" 
          />
        </div>
        <p className="mb-3 sm:mb-4 text-base sm:text-lg text-gray-600">Your wishlist is empty</p>
        <Link 
          href="/products" 
          className="rounded-full bg-black px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-white transition-opacity hover:opacity-90"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => {
        const imagePath = getImagePath(item);
        
        return (
          <div key={item.id} className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="relative aspect-square overflow-hidden">
              <Image 
                src={failedImages[imagePath] ? '/images/Empty-cart.jpg' : imagePath} 
                alt={item.name} 
                fill 
                className="object-contain p-2"
                onError={() => handleImageError(imagePath)}
              />
            </div>
            <div className="p-3 sm:p-4">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm sm:text-base md:text-lg font-medium line-clamp-2">{item.name}</h3>
                <span className="text-sm sm:text-base font-bold">₹{item.price}</span>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center justify-between">
                <button
                  className="w-full rounded-full bg-black py-1.5 sm:py-2 px-3 sm:px-4 text-xs sm:text-sm font-medium text-white transition-opacity hover:opacity-90"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
                <button
                  className="ml-2 rounded-full bg-red-50 p-1.5 sm:p-2 text-red-500 transition-colors hover:bg-red-100"
                  aria-label={`Remove ${item.name} from wishlist`}
                  onClick={() => handleRemoveFromWishlist(item.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 sm:h-6 sm:w-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
} 