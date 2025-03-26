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

  // Generate fallback paths for a given image path
  const generateFallbackPaths = (imagePath: string): string[] => {
    // Extract base path and product ID
    const productMatch = imagePath.match(/\/images\/(Product\d+)\/([^.]+)/);
    
    if (!productMatch) return [FALLBACK_IMAGE];
    
    const [, productFolder, imageName] = productMatch;
    const basePath = `/images/${productFolder}/${imageName}`;
    
    // Try all possible extensions for the image
    return [
      `${basePath}.webp`,
      `${basePath}.jpg`, 
      `${basePath}.jpeg`,
      `${basePath}.png`,
      // If it's a slide, try different naming patterns
      imageName.includes('Slide') ? `/images/${productFolder}/HomeProduct.jpg` : null,
      imageName.includes('Slide') ? `/images/${productFolder}/HomeProduct.webp` : null,
      imageName.includes('Slide') ? `/images/${productFolder}/HomeProduct.jpeg` : null,
      imageName.includes('Slide') ? `/images/${productFolder}/HomeProduct.png` : null,
      // Final fallback
      FALLBACK_IMAGE
    ].filter(Boolean) as string[];
  };

  // Try alternative formats if an image fails to load
  const handleImageError = (imageSrc: string, index: number) => {
    // Mark the current image as failed
    setFailedImages(prev => ({ ...prev, [imageSrc]: true }));
    
    // Get fallback paths for this image
    const fallbackPaths = generateFallbackPaths(imageSrc);
    
    // Find the first fallback that hasn't failed yet
    const availableFallback = fallbackPaths.find(path => 
      path !== imageSrc && !failedImages[path]
    );
    
    if (availableFallback) {
      // Update the image source with the fallback
      const newImages = [...currentImages];
      newImages[index] = availableFallback;
      setCurrentImages(newImages);
    } else {
      // If all fallbacks have failed, use the global fallback
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