'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';

export default function CartPage() {
  // 1. Hook up to our global state stores
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();

  // 2. The Hydration Guard: ensures server and client rendering match initially
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // While waiting for the client to mount, show a clean, empty page layout
  if (!mounted) {
    return <div className="min-h-screen bg-base-100"></div>;
  }

  // 3. STATE A: If the shopping cart is completely empty
  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-base-100 px-6">
        <h1 className="text-2xl font-light tracking-widest uppercase mb-4">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-sm text-base-content/60 font-light mb-8 max-w-xs text-center leading-relaxed">
          You haven't selected any luxury fragrances yet. Browse our signature collection to find your scent.
        </p>
        <Link href="/" className="btn btn-neutral rounded-none px-8 tracking-wider uppercase font-medium">
          Go to Shop
        </Link>
      </div>
    );
  }

  // 4. STATE B: If the shopping cart has items, render the e-commerce bag
  return (
    <div className="min-h-screen bg-base-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Page Main Header */}
        <h1 className="text-3xl font-light tracking-widest uppercase mb-12 border-b border-base-300 pb-4">
          Shopping Cart Bag
        </h1>

        {/* Responsive 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* COLUMN 1: The List of Selected Products (Takes up 2/3 of space) */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex flex-col sm:flex-row items-center justify-between border border-base-300 p-6 gap-6 bg-base-100"
              >
                {/* Product Brand & Name */}
                <div className="flex-1 text-center sm:text-left">
                  <span className="text-xs uppercase tracking-widest text-base-content/60 block mb-1">
                    {item.brand?.name || 'Luxury Fragrance'}
                  </span>
                  <Link href={`/products/${item.id}`} className="text-lg font-medium hover:underline">
                    {item.name}
                  </Link>
                </div>

                {/* Quantitative Controls (The Plus/Minus Math!) */}
                <div className="flex items-center gap-3 border border-base-300 px-3 py-1.5 bg-base-200">
                  {/* Minus button: decreases item quantity by 1 */}
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="text-lg font-medium px-2 hover:text-error transition-colors"
                  >
                    -
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">
                    {item.quantity}
                  </span>
                  {/* Plus button: increases item quantity by 1 */}
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="text-lg font-medium px-2 hover:text-primary transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Calculated Item Total Price (Price * Quantity) */}
                <div className="text-center sm:text-right min-w-[100px]">
                  <span className="text-lg font-semibold block">
                    ৳{Number(item.price * item.quantity).toFixed(2)}
                  </span>
                  {/* Delete button: removes the product completely */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-xs uppercase tracking-wider text-error font-medium hover:underline mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* COLUMN 2: The Order Price Summary Box (Takes up 1/3 of space) */}
          <div className="bg-base-200 border border-base-300 p-8 h-fit flex flex-col justify-between">
            <h2 className="text-xl font-medium tracking-wider uppercase border-b border-base-300 pb-4 mb-6">
              Order Summary
            </h2>
            
            {/* Subtotal Calculation */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-base-content/75 uppercase tracking-wide">
                Subtotal
              </span>
              <span className="text-xl font-bold tracking-wide">
                ৳{getTotalPrice().toFixed(2)}
              </span>
            </div>

            <p className="text-xs text-base-content/60 leading-relaxed mb-8 font-light">
              Taxes and shipping fees will be computed dynamically during checkout.
            </p>

            {/* Dynamic Security Checkout Button */}
            {user ? (
              /* If logged in: direct to checkout page */
              <Link 
                href="/checkout" 
                className="btn btn-neutral rounded-none w-full tracking-wider uppercase font-medium"
              >
                Proceed to Checkout
              </Link>
            ) : (
              /* If logged out: force user to log in first */
              <div className="space-y-4">
                <Link 
                  href="/auth/login" 
                  className="btn btn-outline rounded-none w-full tracking-wider uppercase font-medium"
                >
                  Login to Checkout
                </Link>
                <span className="text-[10px] text-center block uppercase tracking-widest text-base-content/65 font-medium">
                  Authentication is required to place orders
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
