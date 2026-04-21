"use client";

import React, { use, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Loader2 } from "lucide-react";

type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  categoryId: string;
  category?: { id: string; name: string };
};

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetch(`/api/products/${resolvedParams.id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setProduct(json.data);
        } else {
          setError(json.error || "Product not found");
        }
      })
      .catch(() => setError("Failed to load product"))
      .finally(() => setLoading(false));
  }, [resolvedParams.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || "",
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-24 flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">{error || "This product does not exist."}</p>
        <Link href="/products">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const mainImage = product.images?.[selectedImage] || product.images?.[0];

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <Link href="/products" className="text-muted-foreground hover:text-primary mb-8 inline-flex items-center gap-2 transition-colors">
        <span>←</span> Back to Collection
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted">
            {mainImage ? (
              <Image src={mainImage} alt={product.title} fill className="object-cover" priority />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative aspect-square rounded-xl overflow-hidden bg-muted border-2 transition-colors cursor-pointer ${
                    selectedImage === i ? "border-primary" : "border-transparent hover:border-primary/50"
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover opacity-80 hover:opacity-100" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info & Story */}
        <div className="flex flex-col">
          {product.category && (
            <span className="text-secondary-foreground font-medium mb-2 tracking-wider uppercase text-sm">
              {product.category.name}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{product.title}</h1>
          <p className="text-2xl text-primary font-semibold mb-8">${product.price.toFixed(2)}</p>
          
          <div className="prose prose-stone mb-10 text-foreground/80 leading-relaxed text-lg">
            <p>{product.description}</p>
          </div>

          <div className="flex items-center gap-4 mb-10 text-sm text-muted-foreground">
            <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-destructive font-medium"}>
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="mt-auto space-y-4 pt-8 border-t border-border/50">
            <Button
              size="lg"
              className="w-full h-14 rounded-full text-lg"
              onClick={handleAddToCart}
              disabled={added || product.stock === 0}
            >
              {added ? "Added to Cart ✓" : product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">Free shipping on orders over $100</p>
          </div>
        </div>
      </div>
    </div>
  );
}
