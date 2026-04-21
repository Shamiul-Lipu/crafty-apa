"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Gift, Coffee, Box, Star, Ribbon } from "lucide-react";
import { Loader2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  _count?: { products: number };
};

// Map category names to icons (fallback to Gift)
const iconMap: Record<string, React.ReactNode> = {
  chocolate: <Coffee className="w-6 h-6 text-white" />,
  craft: <Gift className="w-6 h-6 text-white" />,
  box: <Box className="w-6 h-6 text-white" />,
  bundle: <Ribbon className="w-6 h-6 text-white" />,
  occasion: <Star className="w-6 h-6 text-white" />,
};

// Fallback images for categories without images
const fallbackImages = [
  "https://images.unsplash.com/photo-1548907040-4baa42d10919?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&q=80",
];

function getIconForCategory(name: string) {
  const lower = name.toLowerCase();
  for (const key of Object.keys(iconMap)) {
    if (lower.includes(key)) return iconMap[key];
  }
  return <Gift className="w-6 h-6 text-white" />;
}

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCategories(json.data.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container mx-auto px-4 max-w-7xl flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-20 md:py-28 bg-secondary-50">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Curated for Every Moment
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg">
            Discover handcrafted delights for every special occasion.
          </p>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-6 
      auto-rows-[180px] md:auto-rows-[220px]"
        >
          {categories.map((cat, i) => {
            // ✅ FIXED pattern (NO short rows anymore)
            const spans = [
              "col-span-3 row-span-2", // big hero
              "col-span-3 row-span-2", // big pair
              "col-span-2 row-span-2",
              "col-span-2 row-span-2",
              "col-span-2 row-span-2",
            ];

            const spanClass = spans[i % spans.length];

            return (
              <Link
                key={cat.id}
                href={`/products?categoryId=${cat.id}`}
                className={`relative group ${spanClass}
              rounded-2xl overflow-hidden
              border border-white/30
              bg-white/20 backdrop-blur-xl
              shadow-sm hover:shadow-2xl
              transition-all duration-500`}
              >
                {/* Image */}
                <Image
                  src={fallbackImages[i % fallbackImages.length]}
                  alt={cat.name}
                  fill
                  priority={i < 3}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="absolute inset-0 w-full h-full 
                object-cover object-center
                transition-transform duration-700
                group-hover:scale-110"
                />

                {/* Overlay */}
                <div
                  className="absolute inset-0 
              bg-gradient-to-t from-black/70 via-black/30 to-transparent"
                />

                {/* Content */}
                <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end">
                  <div
                    className="w-10 h-10 flex items-center justify-center 
                rounded-xl bg-white/20 backdrop-blur-md border border-white/30 mb-2"
                  >
                    {getIconForCategory(cat.name)}
                  </div>

                  <h3 className="text-white text-lg md:text-xl font-semibold">
                    {cat.name}
                  </h3>

                  {cat._count && (
                    <span className="text-white/70 text-sm">
                      {cat._count.products} products
                    </span>
                  )}

                  <span className="text-white/90 flex items-center gap-2 text-sm mt-1">
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
