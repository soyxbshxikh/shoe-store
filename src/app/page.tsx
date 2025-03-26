import ImageCarousel from '@/components/ImageCarousel';
import { getProducts } from '@/lib/data';
import ProductCard from '@/components/ProductCard';

export default async function Home() {
  const allProducts = await getProducts();
  // Recategorize "Walking" products as "Running" instead of filtering them out
  const recategorizedProducts = allProducts.map(product => 
    product.category === "Walking" 
      ? {...product, category: "Running"} 
      : product
  );
  const featuredProducts = recategorizedProducts.slice(0, 9); // Showing 9 products for 3 clean rows of 3
  
  return (
    <div className="flex flex-col">
      {/* Hero Carousel Section */}
      <section className="relative">
        <ImageCarousel />
      </section>

      {/* Featured Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center mb-10">
            <h2 className="text-4xl font-bold text-center mb-4">Featured Products</h2>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 