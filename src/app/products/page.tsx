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
      <div className="py-8 text-center">
        <p className="text-lg text-gray-600">
          {category
            ? `No shoes found in the ${category} category.`
            : 'No shoes found.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-10 text-4xl font-bold text-center">{category ? `${category} Shoes` : 'All Products'}</h1>

      {/* Categories */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link 
            href="/products" 
            className={`rounded-full ${!category ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} px-4 py-2 text-sm font-medium`}
          >
            All
          </Link>
          {filteredCategories.map((cat) => (
            <Link 
              key={cat} 
              href={`/products?category=${cat}`}
              className={`rounded-full ${category === cat ? 'bg-black text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} px-4 py-2 text-sm font-medium`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <Suspense fallback={
        <div className="py-12">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 rounded-t-lg bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
                  <div className="h-3 w-1/4 bg-gray-200 rounded"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
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