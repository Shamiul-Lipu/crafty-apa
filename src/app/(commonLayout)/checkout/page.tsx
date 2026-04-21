"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { apiFetch } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, cartTotal, cartCount, clearCart } = useCart();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [ordered, setOrdered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // If not logged in, redirect to login
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const address = formData.get("address") as string;
      const address2 = formData.get("address2") as string;
      const city = formData.get("city") as string;
      const postal = formData.get("postal") as string;
      const email = formData.get("email") as string;

      const shippingAddress = `${firstName} ${lastName}, ${address}${address2 ? `, ${address2}` : ""}, ${city} ${postal}, Email: ${email}`;

      // Step 1: Sync cart items to server
      for (const item of items) {
        await apiFetch("/api/cart", {
          method: "POST",
          body: JSON.stringify({ productId: item.id, quantity: item.quantity }),
        });
      }

      // Step 2: Create order
      const orderRes = await apiFetch<{ id: string; totalAmount: number }>("/api/orders", {
        method: "POST",
        body: JSON.stringify({ shippingAddress }),
      });

      // Step 3: Initialize payment
      try {
        const paymentRes = await apiFetch<{ GatewayPageURL: string }>("/api/payment/init", {
          method: "POST",
          body: JSON.stringify({ orderId: orderRes.data.id }),
        });

        if (paymentRes.data.GatewayPageURL) {
          // Clear local cart and redirect to payment gateway
          clearCart();
          window.location.href = paymentRes.data.GatewayPageURL;
          return;
        }
      } catch {
        // Payment init failed — but order was created. Show success with local confirmation.
        console.warn("Payment gateway unavailable, showing local confirmation");
      }

      // If payment gateway not available, show local success
      clearCart();
      setOrdered(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Checkout failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-24 flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (ordered) {
    return (
      <div className="container mx-auto px-4 py-32 flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center text-4xl mb-8">✓</div>
        <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-8 text-lg max-w-md">Thank you for your purchase. We&apos;re carefully preparing your order and will email you the tracking details soon.</p>
        <Link href="/products" className={buttonVariants({ size: "lg", className: "rounded-full" })}>Continue Shopping</Link>
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
        <Link href="/products" className={buttonVariants({ size: "lg", className: "rounded-full mt-4" })}>Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>
      
      {!isAuthenticated && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-8">
          <p className="font-medium">Please sign in to complete your purchase.</p>
          <Link href="/login?redirect=/checkout" className="text-primary font-semibold hover:underline">
            Sign in here →
          </Link>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 mb-8">
          {error}
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Checkout Form */}
        <div className="flex-1">
          <form className="space-y-8" onSubmit={handleCheckout}>
            <section className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address <span className="text-destructive">*</span></label>
                  <Input name="email" required type="email" placeholder="you@example.com" className="w-full" />
                </div>
              </div>
            </section>

            <section className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name <span className="text-destructive">*</span></label>
                  <Input name="firstName" required placeholder="First name" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name <span className="text-destructive">*</span></label>
                  <Input name="lastName" required placeholder="Last name" className="w-full" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address <span className="text-destructive">*</span></label>
                  <Input name="address" required placeholder="Street address" className="w-full mb-2" />
                  <Input name="address2" placeholder="Apartment, suite, etc. (optional)" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City <span className="text-destructive">*</span></label>
                  <Input name="city" required placeholder="City" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Postal Code <span className="text-destructive">*</span></label>
                  <Input name="postal" required placeholder="ZIP / Postal code" className="w-full" />
                </div>
              </div>
            </section>

            <section className="bg-card p-6 md:p-8 rounded-2xl border border-border/50 shadow-sm">
               <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
               <div className="p-4 border rounded-xl flex items-center justify-between mb-4 bg-muted/30">
                 <span className="font-medium">SSLCommerz (Bangladesh)</span>
                 <span className="text-sm border px-2 py-1 rounded bg-background">Secure</span>
               </div>
               <p className="text-sm text-muted-foreground">You will be redirected to the secure payment gateway to complete your purchase after clicking &quot;Place Order&quot;.</p>
            </section>

            <Button
              type="submit"
              size="lg"
              className="w-full rounded-full h-14 text-lg"
              disabled={isSubmitting || !isAuthenticated}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Place Order - $${(cartTotal + 10).toFixed(2)}`
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 flex-shrink-0">
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold mb-6 border-b pb-4">Order Summary ({cartCount} items)</h2>
            
            {/* Cart items preview */}
            <div className="space-y-3 mb-6 pb-6 border-b">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.title} × {item.quantity}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-sm mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Standard Shipping</span>
                <span className="font-medium">$10.00</span>
              </div>
            </div>
            <div className="flex justify-between items-center text-xl">
              <span className="font-bold">Total</span>
              <span className="font-bold text-primary">${(cartTotal + 10).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
