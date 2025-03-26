import { promises as fs } from 'fs';
import path from 'path';

export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  imagePath: string;
  category: string;
  inStock: boolean;
  colors: string[];
  sizes: number[];
};

// Cache the products data
let productsCache: Product[] | null = null;

export async function getProducts(): Promise<Product[]> {
  if (productsCache !== null) {
    return productsCache;
  }

  try {
    const filePath = path.join(process.cwd(), 'src/lib/data/products.json');
    const data = await fs.readFile(filePath, 'utf8');
    const products: Product[] = JSON.parse(data);
    productsCache = products;
    return products;
  } catch (error) {
    // Remove console.error for production
    // console.error('Error loading products:', error);
    // Return empty array in case of error
    return [];
  }
}

export async function getProductById(id: number): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.id === id);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.category === category);
}

export async function getCategories(): Promise<string[]> {
  const products = await getProducts();
  const categories = new Set(products.map((product) => product.category));
  return Array.from(categories);
} 