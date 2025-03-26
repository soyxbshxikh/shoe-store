'use client';

import Image from 'next/image';
import { useState } from 'react';

type ClientImageProps = {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
};

export default function ClientImage({
  src,
  alt,
  fallbackSrc = '/images/Empty-cart.jpg',
  className = '',
  fill = false,
  width,
  height,
  priority = false,
}: ClientImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      className={className}
      priority={priority}
      onError={handleError}
    />
  );
} 