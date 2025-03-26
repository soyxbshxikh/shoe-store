import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-8 h-48 w-48">
        <Image
          src="/images/Empty-cart.jpg"
          alt="Page not found"
          fill
          className="object-contain"
        />
      </div>
      <h1 className="mb-4 text-4xl font-bold text-gray-900">Page Not Found</h1>
      <p className="mb-8 max-w-md text-lg text-gray-600">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been removed, renamed, or
        doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="rounded-md bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
      >
        Back to Homepage
      </Link>
    </div>
  );
} 