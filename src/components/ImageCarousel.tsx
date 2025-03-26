'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface CarouselProps {
  images?: string[];
}

export default function ImageCarousel({ images }: CarouselProps) {
  const defaultImages = [
    '/images/Slide-1.png',
    '/images/Slide-2.png',
    '/images/Slide-3.png'
  ];

  const carouselImages = images || defaultImages;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Memoize the goToNext function to prevent unnecessary re-renders
  const goToNext = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, carouselImages.length]);

  const goToPrevious = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1));
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, carouselImages.length]);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [isTransitioning, currentIndex]);

  // Enhanced auto scroll effect with better cleanup
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    // Only start the interval if not transitioning
    if (!isTransitioning) {
      interval = setInterval(() => {
        goToNext();
      }, 5000); // Slightly longer between transitions for better viewing
    }

    // Clean up function
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [goToNext, isTransitioning]);

  return (
    <div className="relative w-full h-[40vh] xs:h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Images */}
      {carouselImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            index === currentIndex 
              ? 'opacity-100 z-10 translate-x-0 scale-100' 
              : index < currentIndex 
                ? 'opacity-0 z-0 -translate-x-full scale-105' 
                : 'opacity-0 z-0 translate-x-full scale-105'
          }`}
        >
          <Image
            src={image}
            alt={`Featured slide ${index + 1}`}
            fill
            className="object-cover object-center"
            priority={index === 0}
            sizes="100vw"
            quality={90}
          />
        </div>
      ))}

      {/* Navigation arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 xs:left-4 sm:left-6 top-1/2 z-20 -translate-y-1/2 bg-white/80 p-2 sm:p-3 hover:bg-white focus:outline-none transition-all duration-300"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={goToNext}
        className="absolute right-2 xs:right-4 sm:right-6 top-1/2 z-20 -translate-y-1/2 bg-white/80 p-2 sm:p-3 hover:bg-white focus:outline-none transition-all duration-300"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 sm:h-5 sm:w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 z-20 flex -translate-x-1/2 space-x-2 sm:space-x-3">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-[2px] transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-8 sm:w-12' : 'bg-white/50 w-4 sm:w-6'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
} 