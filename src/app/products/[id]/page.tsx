import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/data';
import ProductImages from '@/components/ProductImages';
import ProductDetailActions from '@/components/ProductDetailActions';

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
    // Default image extensions
    let slide1Ext = '.webp';
    let slide2Ext = '.webp';
    let slide3Ext = '.webp';
    let homeExt = '.webp';
    
    // Product-specific image extensions based on examining the folders
    if (productId === 1) {
      homeExt = '.jpeg';
    } else if (productId === 2) {
      slide3Ext = '.jpg';
      homeExt = '.webp';
    } else if (productId === 3) {
      slide1Ext = '.webp';
      slide2Ext = '.jpg';
      slide3Ext = '.jpg';
      homeExt = '.webp';
    } else if (productId === 16) {
      homeExt = '.jpeg';
    } else if (productId === 19) {
      // Special case for Product19 with inconsistent naming
      slide1Ext = '.png';
      slide2Ext = '.jpeg';
      // Slide3 is missing the dash
      homeExt = '.jpeg';
    } else if (productId === 17 || productId === 20) {
      homeExt = '.png';
    }
    
    // Special case for Product19 with inconsistent naming for Slide3
    if (productId === 19) {
      return [
        `${imagePath}/Slide-1${slide1Ext}`,
        `${imagePath}/Slide-2${slide2Ext}`,
        `${imagePath}/Slide3${slide3Ext}`, // Note: no dash for Slide3
        `${imagePath}/HomeProduct${homeExt}`,
      ];
    }
    
    return [
      `${imagePath}/Slide-1${slide1Ext}`,
      `${imagePath}/Slide-2${slide2Ext}`,
      `${imagePath}/Slide-3${slide3Ext}`,
      `${imagePath}/HomeProduct${homeExt}`,
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