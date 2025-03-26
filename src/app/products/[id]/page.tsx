import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/data';
import ProductImages from '@/components/ProductImages';
import ProductDetailActions from '@/components/ProductDetailActions';
import fs from 'fs';
import path from 'path';

interface ProductDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const product = await getProductById(Number(params.id));
  
  if (!product) {
    return {
      title: 'Product Not Found | StepStyle',
      description: 'The requested product could not be found',
    };
  }
  
  return {
    title: `${product.name} | StepStyle`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = await getProductById(Number(params.id));
  
  if (!product) {
    notFound();
  }
  
  // Function to get appropriate image slides based on product ID
  const getProductImageSlides = (productId: number, imagePath: string) => {
    // Define the mapping of product IDs to file formats
    const productFormats: Record<number, { [key: string]: string }> = {
      1: { home: '.jpeg', slide1: '.webp', slide2: '.webp', slide3: '.webp' },
      2: { home: '.webp', slide1: '.webp', slide2: '.webp', slide3: '.jpg' },
      3: { home: '.webp', slide1: '.webp', slide2: '.jpg', slide3: '.jpg' },
      4: { home: '.webp', slide1: '.webp', slide2: '.webp', slide3: '.webp' },
      5: { home: '.webp', slide1: '.webp', slide2: '.webp', slide3: '.webp' },
      6: { home: '.webp', slide1: '.webp', slide2: '.webp', slide3: '.webp' },
      7: { home: '.webp', slide1: '.webp', slide2: '.webp', slide3: '.webp' },
      8: { home: '.webp', slide1: '.webp', slide2: '.webp', slide3: '.webp' },
      9: { home: '.webp', slide1: '.webp', slide2: '.webp', slide3: '.webp' },
      10: { home: '.jpg', slide1: '.jpg', slide2: '.jpg', slide3: '.jpg' },
      11: { home: '.jpg', slide1: '.jpg', slide2: '.jpg', slide3: '.jpg' },
      12: { home: '.jpg', slide1: '.jpg', slide2: '.jpg', slide3: '.jpg' },
      13: { home: '.jpg', slide1: '.jpg', slide2: '.jpg', slide3: '.jpg' },
      14: { home: '.jpg', slide1: '.jpg', slide2: '.jpg', slide3: '.jpg' },
      15: { home: '.jpg', slide1: '.jpg', slide2: '.jpg', slide3: '.jpg' },
      16: { home: '.jpeg', slide1: '.png', slide2: '.jpeg', slide3: '.jpeg' },
      17: { home: '.png', slide1: '.png', slide2: '.png', slide3: '.png' },
      18: { home: '.jpg', slide1: '.jpg', slide2: '.jpg', slide3: '.jpg' },
      19: { home: '.jpeg', slide1: '.png', slide2: '.jpeg', slide3: '.jpeg', slide3NoHyphen: true },
      20: { home: '.png', slide1: '.png', slide2: '.png', slide3: '.png' },
    };
    
    // Fallback formats to try in order
    const fallbackFormats = ['.webp', '.jpg', '.jpeg', '.png'];
    
    // Get the format for the current product or use default
    const productFormat = productFormats[productId] || {
      home: '.webp',
      slide1: '.webp',
      slide2: '.webp',
      slide3: '.webp'
    };
    
    // Create the image paths with correct extensions
    const homeProductPath = `${imagePath}/HomeProduct${productFormat.home}`;
    
    // Handle special case for Slide3 with no hyphen (Product19)
    const slide3Path = productFormat.slide3NoHyphen
      ? `${imagePath}/Slide3${productFormat.slide3}`
      : `${imagePath}/Slide-3${productFormat.slide3}`;
    
    return [
      `${imagePath}/Slide-1${productFormat.slide1}`,
      `${imagePath}/Slide-2${productFormat.slide2}`,
      slide3Path,
      homeProductPath,
    ];
  };
  
  // Get image slides for the current product
  const productImages = getProductImageSlides(product.id, product.imagePath);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <nav className="flex text-sm">
          <ol className="inline-flex items-center space-x-1 md:space-x-2">
            <li className="inline-flex items-center">
              <a href="/" className="text-gray-500 hover:text-gray-900">Home</a>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <a href="/products" className="text-gray-500 hover:text-gray-900">Products</a>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-800">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <ProductImages slides={productImages} productName={product.name} />
        </div>
        
        {/* Product Details */}
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-1 text-xl font-semibold text-indigo-600">₹{product.price}</p>
          </div>
          
          {/* Category tag */}
          <div className="mt-2">
            <span className="inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
              {product.category}
            </span>
            {product.inStock ? (
              <span className="ml-2 inline-block rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                In Stock
              </span>
            ) : (
              <span className="ml-2 inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
                Out of Stock
              </span>
            )}
          </div>
          
          {/* Description */}
          <div>
            <h2 className="text-lg font-medium text-gray-900">Description</h2>
            <p className="mt-2 text-base text-gray-700">{product.description}</p>
          </div>
          
          {/* Product options and actions */}
          <ProductDetailActions 
            product={product}
          />
        </div>
      </div>
    </div>
  );
} 