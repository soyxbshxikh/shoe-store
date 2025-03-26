'use client';

interface ProductOptionsProps {
  sizes?: number[];
  colors?: string[];
  onSizeChange: (size: number) => void;
  onColorChange?: (color: string) => void;
  selectedSize?: number;
}

export default function ProductOptions({ 
  sizes = [], 
  colors = [],
  onSizeChange,
  onColorChange,
  selectedSize
}: ProductOptionsProps) {
  const handleSizeSelect = (size: number) => {
    onSizeChange(size);
  };

  const handleColorSelect = (color: string) => {
    if (onColorChange) {
      onColorChange(color);
    }
  };

  return (
    <div className="mt-6">
      {sizes.length > 0 && (
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
          <div className="grid grid-cols-4 gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeSelect(size)}
                className={`flex items-center justify-center rounded-md py-2 px-3 text-sm font-medium ${
                  selectedSize === size
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {colors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
          <div className="flex space-x-2">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                className={`relative h-8 w-8 rounded-full border border-gray-300`}
                style={{ backgroundColor: color.toLowerCase() }}
                aria-label={`Color: ${color}`}
                onClick={() => handleColorSelect(color)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 