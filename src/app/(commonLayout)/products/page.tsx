"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

type Category = {
  id: string;
  name: string;
  _count?: { products: number };
};

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const urlCategoryId = searchParams.get("categoryId");
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(urlCategoryId);
  const [addedId, setAddedId] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedCategory) params.set("categoryId", selectedCategory);

      const res = await fetch(`/api/products?${params.toString()}`);
      const json = await res.json();
      if (json.success) setProducts(json.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    } finally {
      setLoading(false);
    }
  }, [search, selectedCategory]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setCategories(json.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images?.[0] || "",
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  // Debounced search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Shop Collection</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">Browse our curated selection of premium chocolates and handcrafted gifts.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-8 flex-shrink-0">
          <div>
            <h3 className="font-semibold text-lg mb-4 hidden lg:block">Search</h3>
            <Input
              placeholder="Search gifts..."
              className="w-full bg-card"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-3">
              <li>
                <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                  <input
                    type="radio"
                    name="category"
                    className="accent-primary"
                    checked={selectedCategory === null}
                    onChange={() => setSelectedCategory(null)}
                  />
                  All
                </label>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors">
                    <input
                      type="radio"
                      name="category"
                      className="accent-primary"
                      checked={selectedCategory === cat.id}
                      onChange={() => setSelectedCategory(cat.id)}
                    />
                    {cat.name}
                    {cat._count && (
                      <span className="text-xs text-muted-foreground">({cat._count.products})</span>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <span className="text-muted-foreground">
              {loading ? "Loading..." : `${products.length} products found`}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-xl text-muted-foreground">No products found.</p>
              <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="group flex flex-col bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-border/50">
                  <Link href={`/products/${product.id}`} className="relative h-72 overflow-hidden bg-muted">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                    )}
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">{product.title}</h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-4 capitalize">{product.category?.name || "Uncategorized"}</p>
                    <div className="mt-auto flex items-center justify-between pt-4">
                      <p className="text-primary font-bold text-lg">${product.price.toFixed(2)}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleAddToCart(product)}
                        disabled={addedId === product.id}
                      >
                        {addedId === product.id ? "Added ✓" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
