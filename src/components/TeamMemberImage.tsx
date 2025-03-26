'use client';

import Image from 'next/image';
import { useState } from 'react';

type TeamMemberImageProps = {
  src: string;
  alt: string;
  productFallback: string;
};

export default function TeamMemberImage({
  src,
  alt,
  productFallback,
}: TeamMemberImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(productFallback);
      setHasError(true);
    }
  };

  return (
    <div className="relative w-48 h-48 mx-auto mb-4 overflow-hidden rounded-full bg-gray-200">
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="object-cover"
        onError={handleError}
      />
    </div>
  );
} 