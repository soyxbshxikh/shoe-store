'use client';

import { useState } from 'react';

interface ProductOptionsProps {
  colors: string[];
  sizes: number[];
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
}

export default function ProductOptions({
  colors,
  sizes,
  onColorChange,
  onSizeChange,
}: ProductOptionsProps) {
  const [selectedColor, setSelectedColor] = useState<string>(colors[0] || '');
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  const handleSizeSelect = (size: number) => {
    setSelectedSize(size);
    onSizeChange(size);
  };

  return (
    <div className="space-y-6">
      {/* Sizes */}
      <div>
        <h2 className="text-lg font-medium text-gray-900">Sizes</h2>
        <div className="mt-2 grid grid-cols-5 gap-2">
          {sizes.map((size) => (
            <div
              key={size}
              className={`flex h-10 w-16 cursor-pointer items-center justify-center rounded-md border text-center text-sm ${
                selectedSize === size
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 hover:border-black'
              }`}
              onClick={() => handleSizeSelect(size)}
            >
              {size}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 