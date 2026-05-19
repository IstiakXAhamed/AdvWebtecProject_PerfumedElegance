'use client';

import React, { useState, useEffect } from 'react';

// Define the structure of our luxury slide elements
interface Slide {
  image: string;
  tag: string;
  title: string;
  description: string;
}

const LUXURY_SLIDES: Slide[] = [
  {
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
    tag: 'Olfactory: Marine & Citrus',
    title: 'Creed Aventus',
    description: 'Crisp bergamot, smoky birch wood, and refreshing blackcurrant with an oceanic breeze.',
  },
  {
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1920&q=80',
    tag: 'Olfactory: Warm Gourmand & Spicy',
    title: 'Tobacco Vanille',
    description: 'Creamy tonka bean, rich dark cocoa, dried fruits, and sweet wood sap.',
  },
  {
    image: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1920&q=80',
    tag: 'Olfactory: Luminous Amber Floral',
    title: 'Baccarat Rouge 540',
    description: 'Bespoke crystal luxury. Whispers of breezy jasmine, saffron floral, and fresh cut cedar.',
  },
  {
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80',
    tag: 'Olfactory: Rustic Woody Leather',
    title: 'Santal 33',
    description: 'Olfactory icon. Australian sandalwood, dry papyrus, leather accords, and dark cedar.',
  },
  {
    image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=1920&q=80',
    tag: 'Olfactory: Cosmic Fresh Spicy',
    title: 'Sauvage Elixir',
    description: 'Luminous citrus, lavender absolute, rare sweet licorice, and rich patchouli.',
  },
  {
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=1920&q=80',
    tag: 'Olfactory: Classic Aldehydic',
    title: 'Chanel No. 5',
    description: 'The golden legend. Whispers of absolute ylang-ylang, rose, and warm jasmine flowers.',
  },
  {
    image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1920&q=80',
    tag: 'Olfactory: Woody Aromatic',
    title: 'Gypsy Water',
    description: 'Earth fragrance. Delectable pine needle, fresh lemon, soft incense, and sweet amber.',
  },
  {
    image: 'https://images.unsplash.com/photo-1590005354167-6da97870c913?auto=format&fit=crop&w=1920&q=80',
    tag: 'Olfactory: Honeyed Sweet Tabac',
    title: 'Xerjoff Naxos',
    description: 'Rich Mediterranean honey, sweet lavender, warm tobacco leaves, and absolute vanilla.',
  },
  {
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1920&q=80',
    tag: 'Olfactory: Sweet Floral Rose',
    title: 'Delina Exclusif',
    description: 'Royal Turkish rose, sweet lychee, pear nectar, incense, and cream vetiver.',
  },
  {
    image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=1920&q=80',
    tag: 'Olfactory: Exotic Mango',
    title: 'God of Fire',
    description: 'Dynamic tropical mango, sparkling pink pepper, sweet ginger, and woody musk.',
  },
];

export function HeroSlideshow() {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-advance slide index every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prevIdx) => (prevIdx + 1) % LUXURY_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer); // Clean up the interval on unmount
  }, []);

  return (
    <section className="relative h-[75vh] w-full overflow-hidden flex items-center justify-center text-white">
      
      {/* 1. SLIDESHOW BACKGROUNDS (Layered absolute containers with opacity transitions) */}
      {LUXURY_SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-fixed bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            index === currentIdx ? 'opacity-100 z-0' : 'opacity-0 z-0'
          }`}
          style={{ backgroundImage: `url('${slide.image}')` }}
        />
      ))}

      {/* 2. Elegant Dark Tint Overlay (Stays fixed over all backgrounds) */}
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      {/* 3. HERO CONTENT (Dynamically updates text to match active flavor!) */}
      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center px-6 transition-all duration-700 ease-in-out">
        <span className="text-xs uppercase tracking-[0.25em] text-white/70 font-semibold mb-4 block animate-pulse">
          {LUXURY_SLIDES[currentIdx].tag}
        </span>
        <h1 className="text-3xl md:text-5xl font-light tracking-[0.2em] uppercase mb-4 leading-tight">
          {LUXURY_SLIDES[currentIdx].title}
        </h1>
        <p className="max-w-xl text-sm md:text-base text-white/80 font-light tracking-widest leading-relaxed mb-6 h-[48px] sm:h-auto">
          {LUXURY_SLIDES[currentIdx].description}
        </p>
        <div className="w-16 h-[1px] bg-white/40"></div>
      </div>

      {/* 4. Slide Indicator Dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {LUXURY_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIdx(index)}
            className={`h-1.5 transition-all duration-300 ${
              index === currentIdx ? 'w-8 bg-white' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>

    </section>
  );
}
