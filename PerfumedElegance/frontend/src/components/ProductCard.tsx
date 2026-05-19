'use client';
import { useCartStore } from '@/stores/cartStore';

import Link from 'next/link';

// 1. Define the TypeScript interfaces matching our NestJS database structure
interface Brand {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string; 
  brand?: Brand;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const brandName = product.brand?.name || 'Luxury Fragrance';
  const addItem = useCartStore((state) => state.addItem); 
  
  return (
    <div className="card card-compact bg-base-100 border border-base-300 hover:shadow-lg transition-all duration-300 rounded-none overflow-hidden group">
      {/* 1. Dynamic Product Image Area */}
      <div className="aspect-[3/4] bg-base-200 flex items-center justify-center border-b border-base-300 relative overflow-hidden">
        {product.imageUrl ? (
          /* Render the actual product image if it exists */
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Render our gorgeous minimalist brand box if no image exists */
          <div className="p-8 w-full h-full flex items-center justify-center">
            <div className="border border-base-300 px-6 py-10 flex flex-col items-center justify-center text-center w-full h-full bg-base-100 transition-colors duration-300 group-hover:bg-base-200">
              <span className="text-xs uppercase tracking-widest text-base-content/60 mb-2">
                {brandName}
              </span>
              <span className="text-md font-medium tracking-wide uppercase max-w-[150px]">
                {product.name}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Product Information Area */}
      <div className="card-body p-6 flex flex-col justify-between">
        <div>
          {/* Brand Name (All caps, light) */}
          <span className="text-xs uppercase tracking-widest text-base-content/60 block mb-1">
            {brandName}
          </span>

          {/* Product Name (Clean link to details page) */}
          <Link
            href={`/products/${product.id}`}
            className="text-lg font-medium hover:underline block mb-2"
          >
            {product.name}
          </Link>
          
          {/* Description Snippet (Optional: only renders if exists) */}
          {product.description && (
            <p className="text-xs text-base-content/75 line-clamp-2 mt-1">
              {product.description}
            </p>
          )}
        </div>

        {/* Price and Action Row */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-semibold tracking-wide">
            ৳{Number(product.price).toFixed(2)}
          </span>

         <button
            onClick={() => addItem(product)}
            className="btn btn-neutral btn-sm rounded-none tracking-wider uppercase font-medium"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
