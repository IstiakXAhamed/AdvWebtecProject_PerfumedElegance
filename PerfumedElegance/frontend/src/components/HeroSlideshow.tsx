'use client';

import React, { useState, useEffect } from 'react';

// Define the commercial slide structure
interface Slide {
  image: string;       // The custom-generated unified commercial graphic
  tag: string;         // Olfactory notes / category tag
  title: string;       // Perfume name
  description: string; // Scent profile description
}

const LUXURY_SLIDES: Slide[] = [
  {
    image: '/aventus_slide.png',
    tag: 'Olfactory: Marine & Citrus',
    title: 'Creed Aventus',
    description: 'Original gentleman flask bottle. Blended with crashing blue ocean wave spray, fresh pineapple chunks, and warm smoky birch wood.',
  },
  {
    image: '/tobacco_slide.png',
    tag: 'Olfactory: Warm Gourmand & Spicy',
    title: 'Tobacco Vanille',
    description: 'Original Tom Ford amber jar. Infused with absolute roasted vanilla beans, dry sweet tobacco leaves, and cinnamon bark.',
  },
  {
    image: '/baccarat_slide.png',
    tag: 'Olfactory: Luminous Amber Floral',
    title: 'Baccarat Rouge 540',
    description: 'Original MFK heavy crystal bottle. Surrounded by glowing amber crystals, warm saffron strands, and fresh blooming jasmine.',
  },
  {
    image: '/santal_slide.png',
    tag: 'Olfactory: Rustic Woody Leather',
    title: 'Santal 33',
    description: 'Original Le Labo pharmacy flacon. Compounded with Australian sandalwood logs, raw birch bark, papyrus, and fresh forest mist.',
  },
  {
    image: '/sauvage_slide.png',
    tag: 'Olfactory: Cosmic Fresh Spicy',
    title: 'Sauvage Elixir',
    description: 'Original Dior gradient navy bottle. Infused with rich lavender sprigs, licorice twigs, and warm cosmic night stars.',
  },
  {
    image: '/chanel_slide.png',
    tag: 'Olfactory: Classic Aldehydic',
    title: 'Chanel No. 5',
    description: 'Original emerald-cut flacon. The golden legend filled with ylang-ylang, rose, and amber fluid resting on golden satin.',
  },
  {
    image: '/gypsy_slide.png',
    tag: 'Olfactory: Woody Aromatic',
    title: 'Gypsy Water',
    description: 'Original Byredo dome bottle. Blended with fresh pine needles, birch logs, soft incense smoke, and autumn sunbeams.',
  },
  {
    image: '/naxos_slide.png',
    tag: 'Olfactory: Honeyed Sweet Tabac',
    title: 'Xerjoff Naxos',
    description: 'Original gold crown spire flacon. Dripping with pure Mediterranean liquid honey, sweet lavender, and gold citrus slices.',
  },
  {
    image: '/delina_slide.png',
    tag: 'Olfactory: Sweet Floral Rose',
    title: 'Delina Exclusif',
    description: 'Original curved powder-pink bottle. Adorned with pink garlands and tassels, sweet Turkish rose petals, and lychee nectar.',
  },
  {
    image: '/god_of_fire_slide.png',
    tag: 'Olfactory: Exotic Mango & Amber',
    title: 'God of Fire',
    description: 'Original sculpted golden dragon bottle. Surrounded by glowing tropical mango slices, red pink peppers, and exotic jungle sunsets.',
  },
];

export function HeroSlideshow() {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Auto-advance slide index every 5 seconds for a dynamic luxury cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prevIdx) => (prevIdx + 1) % LUXURY_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[85vh] w-full overflow-hidden flex items-center text-white bg-black">
      
      {/* 1. LAYERED BACKGROUNDS (Our 100% authentic, high-quality generated luxury slides) */}
      {LUXURY_SLIDES.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-fixed bg-cover bg-center transition-opacity duration-1500 ease-in-out ${
            index === currentIdx ? 'opacity-100 z-0' : 'opacity-0 z-0'
          }`}
          style={{ backgroundImage: `url('${slide.image}')` }}
        />
      ))}

      {/* 2. Soft Vignette Shadow Overlay (Ensures perfect text contrast on the left side) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent z-10"></div>

      {/* 3. EDITORIAL BRAND CARD (Float-aligned to the left, mimicking print design) */}
      <div className="relative z-20 max-w-7xl w-full mx-auto px-8 md:px-16 flex justify-start">
        <div className="max-w-xl bg-black/40 backdrop-blur-md border border-white/10 p-8 sm:p-12 text-left transition-all duration-1000 ease-in-out">
          <span className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/70 font-semibold mb-3 block animate-pulse">
            {LUXURY_SLIDES[currentIdx].tag}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.15em] uppercase mb-4 leading-tight">
            {LUXURY_SLIDES[currentIdx].title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-white/80 font-light tracking-widest leading-relaxed mb-6">
            {LUXURY_SLIDES[currentIdx].description}
          </p>
          <div className="w-20 h-[1px] bg-white/40"></div>
        </div>
      </div>

      {/* 4. Slide Indicator Dots (10 dashes, clickable to manually jump) */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
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
