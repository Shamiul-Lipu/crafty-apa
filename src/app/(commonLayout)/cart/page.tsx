"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8 text-lg">Looks like you haven&apos;t added any gifts yet.</p>
        <Link href="/products" className={buttonVariants({ size: "lg", className: "rounded-full" })}>Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <h1 className="text-4xl font-bold mb-8">Your Cart ({cartCount})</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-1 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex gap-6 p-4 bg-card rounded-2xl border border-border/50 shadow-sm relative">
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                {item.image && <Image src={item.image} alt={item.title} fill className="object-cover" />}
              </div>
              <div className="flex flex-col flex-1 justify-center">
                <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                <p className="text-primary font-medium mb-4">${item.price.toFixed(2)}</p>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button 
                      className="px-3 py-1 bg-muted hover:bg-muted/80 transition-colors"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >-</button>
                    <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                    <button 
                      className="px-3 py-1 bg-muted hover:bg-muted/80 transition-colors"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >+</button>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-sm text-destructive hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="hidden md:block text-right pr-4 pt-4">
                <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm sticky top-24">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 mb-6 flex justify-between items-center text-lg">
              <span className="font-bold">Estimated Total</span>
              <span className="font-bold text-primary">${cartTotal.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className={buttonVariants({ size: "lg", className: "w-full rounded-full h-14 text-lg" })}>Proceed to Checkout</Link>
            <p className="text-xs text-muted-foreground text-center mt-4">Taxes and shipping calculated at checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
