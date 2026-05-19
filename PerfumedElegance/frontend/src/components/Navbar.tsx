'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';

export function Navbar() {
  const { user, logout } = useAuthStore();

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-6 py-2">
           {/* 1. Brand Logo */}
      <div className="flex-1">
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          {/* Custom Brand Logo */}
          <img
            src="/logo.png"
            alt="Perfumed Elegance Logo"
            className="w-16 h-16 object-contain mix-blend-multiply"
          />
          {/* Brand Name */}
          <span className="text-xl font-medium tracking-widest">
            PERFUMED ELEGANCE
          </span>
        </Link>
      </div>


      {/* 2. Navigation Controls */}
      <div className="flex-none flex items-center gap-6">
        <Link href="/products" className="btn btn-ghost btn-sm tracking-wide font-normal">
          Shop
        </Link>

        {/* Dynamic User Authentication State */}
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold tracking-wide">
              Hello, {user.email.split('@')[0]}
            </span>
            {user.role === 'admin' && (
              <Link
                href="/admin"
                className="btn btn-outline btn-sm tracking-wide font-normal"
              >
                Admin
              </Link>
            )}
            <button
              onClick={logout}
              className="btn btn-ghost btn-sm tracking-wide font-normal text-error"
            >
              Logout
            </button>
          </div>
        ) : (
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
