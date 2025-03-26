'use client';

import Image from 'next/image';
import { useState } from 'react';

type ProductImageCardProps = {
  src: string;
  alt: string;
  basePath: string;
};

export default function ProductImageCard({
  src,
  alt,
  basePath,
}: ProductImageCardProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (hasError) return;

    // Try different formats in sequence
    const formats = ['.webp', '.jpeg', '.jpg', '.png'];
    const currentFormat = formats.find(format => imgSrc.endsWith(format));
    const currentFormatIndex = currentFormat ? formats.indexOf(currentFormat) : -1;

    if (currentFormatIndex >= 0 && currentFormatIndex < formats.length - 1) {
      // Try next format
      const nextFormat = formats[currentFormatIndex + 1];
      const newSrc = `${basePath}/HomeProduct${nextFormat}`;
      setImgSrc(newSrc);
    } else {
      // Fallback to empty cart image
      setImgSrc('/images/Empty-cart.jpg');
    }

    setHasError(true);
  };

  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
      <Image 
        src={imgSrc}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
        onError={handleError}
      />
    </div>
  );
} 