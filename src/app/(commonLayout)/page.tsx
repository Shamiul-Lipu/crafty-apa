"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import HeroSection from "@/components/LandingPage/Hero";
import FeaturedCategories from "@/components/LandingPage/FeaturedCategories";
import { Loader2 } from "lucide-react";

type Product = {
  id: string;
  title: string;
  price: number;
  images: string[];
  category?: { id: string; name: string };
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setProducts(json.data.slice(0, 4));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Categories */}
      <FeaturedCategories />

      {/* Featured Products */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Trending Gifts
              </h2>
              <p className="text-muted-foreground text-lg">
                Our most loved creations this week.
              </p>
            </div>
            <Link
              href="/products"
              className="text-primary font-medium hover:underline hidden sm:block"
            >
              View all products →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products available yet.</p>
              <Link href="/products" className="text-primary hover:underline mt-2 inline-block">
                Browse all products →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-border/50"
                >
                  <Link
                    href={`/products/${product.id}`}
                    className="relative h-64 overflow-hidden bg-muted"
                  >
                    {product.images?.[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                    {product.category && (
                      <span className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm text-foreground text-xs font-semibold px-3 py-1 rounded-full">
                        {product.category.name}
                      </span>
                    )}
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {product.title}
                      </h3>
                    </Link>
                    <p className="text-primary font-medium mt-auto pt-4">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
