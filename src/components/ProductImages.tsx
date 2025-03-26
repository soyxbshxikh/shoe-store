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

  useEffect(() => {
    // Update images when slides prop changes
    setCurrentImages(slides);
    setFailedImages({});
    setActiveImage(0);
  }, [slides]);

  // Try alternative formats if an image fails to load
  const handleImageError = (imageSrc: string, index: number) => {
    // If we've already tried to fix this image and it still failed
    if (failedImages[imageSrc]) {
      return;
    }

    // Extract base path and try different extensions
    const pathWithoutExtension = imageSrc.replace(/\.(webp|jpg|jpeg|png)$/i, '');
    
    // Try different extensions in sequence
    const extensions = ['.webp', '.jpg', '.jpeg', '.png'];
    const currentExtIndex = extensions.findIndex(ext => 
      imageSrc.toLowerCase().endsWith(ext)
    );
    
    // If current extension is found, try the next one in sequence
    let nextExtIndex = -1;
    if (currentExtIndex !== -1) {
      nextExtIndex = (currentExtIndex + 1) % extensions.length;
    } else {
      // If extension not recognized, start with first one
      nextExtIndex = 0;
    }
    
    const newSrc = `${pathWithoutExtension}${extensions[nextExtIndex]}`;
    
    // If we've tried all extensions or can't determine the path, use fallback
    if (imageSrc === newSrc || failedImages[newSrc]) {
      // Fallback to product's home image or empty cart
      const productId = imageSrc.match(/Product\d+/)?.[0];
      const fallbackSrc = productId 
        ? `/images/${productId}/HomeProduct.webp`
        : '/images/Empty-cart.jpg';
      
      // Update the image source
      const newImages = [...currentImages];
      newImages[index] = fallbackSrc;
      setCurrentImages(newImages);
      setFailedImages(prev => ({ ...prev, [imageSrc]: true }));
    } else {
      // Try new extension
      const newImages = [...currentImages];
      newImages[index] = newSrc;
      setCurrentImages(newImages);
      setFailedImages(prev => ({ ...prev, [imageSrc]: true }));
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 rounded-lg p-2 md:p-4">
      {/* Thumbnail sidebar */}
      <div className="flex flex-row md:flex-col gap-3 p-3 md:mr-4 mb-2 md:mb-0 md:w-28">
        {currentImages.map((image, index) => (
          <div 
            key={index} 
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