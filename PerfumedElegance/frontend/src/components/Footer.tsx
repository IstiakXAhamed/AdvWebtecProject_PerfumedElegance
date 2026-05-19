'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content border-t border-white/5 py-16 px-6 tracking-wide font-light">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-b border-white/10 pb-12 mb-10">
        
        {/* Left Column: Premium Brand Tagline */}
        <div className="flex flex-col space-y-4">
          <span className="text-xl font-light tracking-[0.3em] uppercase text-white">
            Perfumed Elegance
          </span>
          <p className="text-xs text-neutral-content/65 max-w-sm leading-relaxed tracking-wider">
            An extraordinary sensory gallery offering authentic luxury e-commerce perfumes. Crafted with uncompromising attention to olfactory detail, environmental blend aesthetics, and high-fashion presentation.
          </p>
        </div>

        {/* Right Column: Dynamic Contact Details (Official & Simple) */}
        <div className="flex flex-col space-y-4 md:items-end">
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-white/95">
            Contact Us
          </span>
          <div className="flex flex-col space-y-2 text-xs text-neutral-content/75 md:text-right">
            <span>
              <strong className="font-semibold text-white/90">Call:</strong> 01991523289
            </span>
            <span>
              <strong className="font-semibold text-white/90">Email:</strong> sanim1728@gmail.com
            </span>
            <span>
              <strong className="font-semibold text-white/90">Location:</strong> Halishahar, Chittagong
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Row: Copyright Details & MD ISTIAK AHAMED Credits */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-[10px] uppercase tracking-[0.2em] text-neutral-content/50">
        <span>
          © {new Date().getFullYear()} Perfumed Elegance. All Rights Reserved.
        </span>
        <span className="mt-2 md:mt-0 font-medium text-white/70">
          Crafted by MD ISTIAK AHAMED
        </span>
      </div>
    </footer>
  );
}
