'use client';

interface ProductOptionsProps {
  sizes?: number[];
  onSizeChange: (size: number) => void;
  selectedSize?: number;
}

export default function ProductOptions({ 
  sizes = [], 
  onSizeChange,
  selectedSize
}: ProductOptionsProps) {
  const handleSizeSelect = (size: number) => {
    onSizeChange(size);
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
                {selectedSize === size && (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          {selectedSize && (
            <p className="mt-2 text-sm text-green-600">
              Size {selectedSize} selected
            </p>
          )}
        </div>
      )}
    </div>
  );
} 