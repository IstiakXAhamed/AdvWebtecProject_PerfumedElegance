'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useCartStore } from '@/stores/cartStore';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [successAdded, setSuccessAdded] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error('Failed to load product details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    // Add multiple items depending on selected quantity
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    
    setSuccessAdded(true);
    setTimeout(() => setSuccessAdded(false), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <span className="text-xs uppercase tracking-[0.3em] animate-pulse">
          Unveiling Olfactory Details...
        </span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-6">
        <h2 className="text-xl uppercase tracking-widest font-light mb-4">Fragrance Not Found</h2>
        <button
          onClick={() => router.push('/')}
          className="text-xs uppercase font-bold tracking-widest border border-white/20 px-6 py-3 hover:bg-white/10"
        >
          Return to Gallery
        </button>
      </div>
    );
  }

  const brandName = product.brand?.name || 'Luxury Fragrance';

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center py-20 px-6">
      
      {/* 1. THE DYNAMIC BOTTLE BACKGROUND (Crisp, High-Fashion Full Bleed) */}
      {product.imageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 z-0 transition-all duration-1000"
          style={{ backgroundImage: `url('${product.imageUrl}')` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-tr from-neutral-900 to-black z-0" />
      )}
      <div className="absolute inset-0 bg-black/65 z-0" />

      {/* 2. MAIN CONTAINER */}
      <div className="relative z-10 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT COLUMN: Main Visual Frame */}
        <div className="flex justify-center">
          <div className="w-full max-w-md aspect-[3/4] bg-neutral-900 border border-white/10 relative overflow-hidden flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="border border-white/10 px-8 py-14 flex flex-col items-center text-center">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 mb-3">{brandName}</span>
                <span className="text-lg font-light tracking-wide uppercase text-white">{product.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Editorial Description & Shopping triggers */}
        <div className="flex flex-col text-white">
          
          {/* Breadcrumb / Back button */}
          <button
            onClick={() => router.push('/')}
            className="text-[10px] uppercase tracking-[0.25em] text-white/50 hover:text-white mb-6 text-left"
          >
            ← Return to Collection
          </button>

          {/* Brand */}
          <span className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/60 mb-2 font-semibold">
            {brandName}
          </span>

          {/* Name */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-wide uppercase mb-4 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <span className="text-2xl sm:text-3xl font-light tracking-widest mb-6 block text-white/95">
            ৳{Number(product.price).toFixed(2)}
          </span>

          {/* Olfactory / Scent Description Box */}
          <div className="border-t border-b border-white/10 py-6 mb-8">
            <h3 className="text-xs uppercase tracking-[0.2em] text-white/60 mb-3 font-semibold">
              The Olfactory Profile
            </h3>
            <p className="text-xs sm:text-sm font-light leading-relaxed tracking-wider text-white/80">
              {product.description || 'A unique custom-curated scent blend representing pure sophistication, bottled with precision.'}
            </p>
          </div>

          {/* Actions & Quantity row */}
          <div className="flex flex-col gap-4">
            
            {/* Quantity Counter */}
            <div className="flex border border-white/20 items-center justify-between px-4 h-12 bg-white/5 w-fit">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-white/60 hover:text-white text-lg font-bold w-6 text-center cursor-pointer"
              >
                -
              </button>
              <span className="text-sm font-semibold tracking-widest px-4">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="text-white/60 hover:text-white text-lg font-bold w-6 text-center cursor-pointer"
              >
                +
              </button>
            </div>

            {/* Button Row */}
            <div className="flex flex-col sm:flex-row gap-3">

              {/* Add to Collection */}
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-white/10 hover:bg-white/20 border border-white/30 text-white h-12 rounded-none uppercase tracking-widest font-semibold text-xs transition-colors duration-300 cursor-pointer"
              >
                Add to Collection
              </button>

              {/* Buy Now — adds to cart then jumps to checkout instantly */}
              <button
                onClick={() => {
                  handleAddToCart();
                  router.push('/cart');
                }}
                className="flex-1 bg-white hover:bg-neutral-200 text-black h-12 rounded-none uppercase tracking-widest font-semibold text-xs transition-colors duration-300 cursor-pointer"
              >
                Buy Now
              </button>

            </div>
          </div>

          {/* Success Banner */}
          {successAdded && (
            <span className="text-[10px] uppercase tracking-widest text-success mt-4 animate-pulse font-semibold">
              ✓ Added {quantity} bottle{quantity > 1 ? 's' : ''} to your shopping cart!
            </span>
          )}

        </div>

      </div>

    </div>
  );
}
