import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Use dynamic import with no SSR to ensure client-side rendering
const CartItems = dynamic(() => import('@/components/CartItems'), { ssr: false });

export const metadata: Metadata = {
  title: 'Shopping Cart | StepStyle',
  description: 'View and manage your shopping cart',
};

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imagePath: string;
  selectedSize?: number;
  selectedColor?: string;
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 pt-20 sm:pt-24">
      <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold">Shopping Cart</h1>
      <CartItems />
    </div>
  );
} 