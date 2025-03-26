'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ProductImagesProps {
  slides: string[];
  productName: string;
}

export default function ProductImages({ slides, productName }: ProductImagesProps) {
  const [currentImages, setCurrentImages] = useState<string[]>(slides);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [activeImage, setActiveImage] = useState<number>(0);
  
  const FALLBACK_IMAGE = '/images/Empty-cart.jpg';

  useEffect(() => {
    // Update images when slides prop changes
    setCurrentImages(slides);
    setFailedImages({});
    setActiveImage(0);
  }, [slides]);

  // Try alternative formats if an image fails to load
  const handleImageError = (imageSrc: string, index: number) => {
    // Mark the current image as failed
    setFailedImages(prev => ({ ...prev, [imageSrc]: true }));
    
    // Get product ID from the image path
    const productIdMatch = imageSrc.match(/Product(\d+)/);
    const productId = productIdMatch ? productIdMatch[1] : null;
    
    // If this is a home product image that failed or we can't determine the product ID, use global fallback
    if (imageSrc.includes('HomeProduct') || !productId) {
      const newImages = [...currentImages];
      newImages[index] = FALLBACK_IMAGE;
      setCurrentImages(newImages);
      return;
    }
    
    // If this is a slide image, try to use the product's HomeProduct image as fallback
    // Extract the image type (Slide-1, Slide-2, etc.)
    const imageTypeMatch = imageSrc.match(/(Slide-\d|Slide\d)/);
    if (!imageTypeMatch) {
      // If we can't determine the image type, use global fallback
      const newImages = [...currentImages];
      newImages[index] = FALLBACK_IMAGE;
      setCurrentImages(newImages);
      return;
    }
    
    // Try all possible extensions for the home product image
    const possibleHomeImages = [
      `/images/Product${productId}/HomeProduct.jpeg`,
      `/images/Product${productId}/HomeProduct.jpg`,
      `/images/Product${productId}/HomeProduct.png`,
      `/images/Product${productId}/HomeProduct.webp`,
    ];
    
    // Find alternative slide images to try
    const imageType = imageTypeMatch[1];
    const basePath = `/images/Product${productId}/${imageType}`;
    const extensions = ['.webp', '.jpg', '.jpeg', '.png'];
    
    // Create a queue of images to try
    const imagesToTry = [
      ...extensions.map(ext => `${basePath}${ext}`),
      ...possibleHomeImages,
      FALLBACK_IMAGE
    ].filter(img => img !== imageSrc && !failedImages[img]);
    
    // If we have alternatives to try, use the first one
    if (imagesToTry.length > 0) {
      const newImages = [...currentImages];
      newImages[index] = imagesToTry[0];
      setCurrentImages(newImages);
    } else {
      // If all alternatives failed, use global fallback
      const newImages = [...currentImages];
      newImages[index] = FALLBACK_IMAGE;
      setCurrentImages(newImages);
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 rounded-lg p-2 md:p-4">
      {/* Thumbnail sidebar */}
      <div className="flex flex-row md:flex-col gap-3 p-3 md:mr-4 mb-2 md:mb-0 md:w-28">
        {currentImages.map((image, index) => (
          <div 
            key={`${image}-${index}`} 
            className={`relative h-24 w-24 cursor-pointer overflow-hidden rounded-md border-2 ${
              activeImage === index ? 'border-black' : 'border-gray-200'
            } hover:border-gray-400 transition-all duration-200`}
            onMouseEnter={() => setActiveImage(index)}
            onClick={() => setActiveImage(index)}
          >
            <Image
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              fill
              className="object-cover"
              onError={() => handleImageError(image, index)}
            />
          </div>
        ))}
      </div>
      
      {/* Main image */}
      <div className="relative flex-1 aspect-square overflow-hidden bg-white rounded-lg">
        <Image
          src={currentImages[activeImage]}
          alt={productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain transition-opacity duration-300"
          priority
          onError={() => handleImageError(currentImages[activeImage], activeImage)}
        />
      </div>
    </div>
  );
} 