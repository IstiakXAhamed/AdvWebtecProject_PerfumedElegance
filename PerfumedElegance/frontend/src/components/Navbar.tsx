'use client';

import React, { useState, useEffect } from 'react'; // 👈 Import hooks
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

export function Navbar() {
  const { user, logout } = useAuthStore();
    const items = useCartStore((state) => state.items);
    

  // 1. Keep track of whether the component has fully loaded in the browser
  const [mounted, setMounted] = useState(false);

  // 2. useEffect only runs on the client-side after the initial hydration is complete
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-6 py-2">
      {/* 1. Brand Logo */}
      <div className="flex-1">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img
            src="/logo.png"
            alt="Perfumed Elegance Logo"
            className="w-16 h-16 object-contain mix-blend-multiply"
          />
          <span className="text-xl font-medium tracking-widest">
            PERFUMED ELEGANCE
          </span>
        </Link>
      </div>

      {/* 2. Navigation Controls */}
          <div className="flex-none flex items-center gap-6">
              
        {/* Shop Link */}
        <Link href="/products" className="btn btn-ghost btn-sm tracking-wide font-normal">
          Shop
        </Link>

        {/* Dynamic Cart Link (Only reads from store if mounted is true) */}
        <Link
          href="/cart"
          className="btn btn-ghost btn-sm tracking-wide font-medium flex items-center gap-1.5"
        >
          Cart
         <span className="badge badge-sm badge-neutral font-semibold rounded-none px-1.5 py-2">
        {mounted ? items.reduce((total, item) => total + item.quantity, 0) : 0}
        </span>

        </Link>

        {/* Dynamic User Authentication State (Only reads from store if mounted is true) */}
        {mounted && user ? (
          /* Logged In UI */
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold tracking-wide">
              Hello, {user.email.split('@')[0]}
            </span>
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="btn btn-outline btn-sm tracking-wide font-medium"
              >
                Admin
              </Link>
            )}
            <button
              onClick={logout}
              className="btn btn-ghost btn-sm tracking-wide font-medium text-error"
            >
              Logout
            </button>
          </div>
        ) : (
            
          /* Logged Out UI (rendered on server & initially on client) */
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="btn btn-ghost btn-sm tracking-wide font-normal">
              Login
            </Link>
            <Link
              href="/auth/register"
              className="btn btn-neutral btn-sm tracking-wide font-normal"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
