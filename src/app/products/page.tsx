import { Metadata } from 'next';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

export const metadata: Metadata = {
  title: 'All Products | StepStyle',
  description: 'Browse our collection of premium shoes',
};

interface ProductsPageProps {
  searchParams: { category?: string };
}

async function ProductsList({ category }: { category?: string }) {
  const allProducts = await getProducts();
  // Recategorize "Walking" products as "Running" instead of filtering them out
  const recategorizedProducts = allProducts.map(product => 
    product.category === "Walking" 
      ? {...product, category: "Running"} 
      : product
  );
  
  const products = category
    ? recategorizedProducts.filter(product => product.category === category)
    : recategorizedProducts;

  if (products.length === 0) {
    return (
      <div className="py-6 sm:py-8 text-center">
        <p className="text-base sm:text-lg text-gray-600">
          {category
            ? `No shoes found in the ${category} category.`
            : 'No shoes found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category } = searchParams;
  const categories = await getCategories();
  const filteredCategories = categories.filter(cat => cat !== "Walking");

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
      <h1 className="mb-6 sm:mb-8 md:mb-10 text-2xl sm:text-3xl md:text-4xl font-bold text-center">{category ? `${category} Shoes` : 'All Products'}</h1>

      {/* Categories */}
      <div className="mb-6 sm:mb-8 overflow-x-auto">
        <div className="flex flex-nowrap min-w-max sm:flex-wrap gap-2">
          <Link 
            href="/products" 
            className={`rounded-full ${!category ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium`}
          >
            All
          </Link>
          {filteredCategories.map((cat) => (
            <Link 
              key={cat} 
              href={`/products?category=${cat}`}
              className={`rounded-full ${category === cat ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium whitespace-nowrap`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <Suspense fallback={
        <div className="py-8 sm:py-12">
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 xs:h-56 sm:h-60 md:h-64 rounded-t-lg bg-gray-200"></div>
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
                  <div className="h-5 sm:h-6 w-1/3 bg-gray-200 rounded"></div>
                  <div className="h-2 sm:h-3 w-1/4 bg-gray-200 rounded"></div>
                  <div className="h-8 sm:h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }>
        <ProductsList category={category} />
      </Suspense>
    </div>
  );
}