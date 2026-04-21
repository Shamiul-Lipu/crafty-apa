"use client";

import Link from "next/link";
import { Menu, ShoppingCart, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import MainLogo from "./mainLogo";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export function MobileMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger render={<Button size="icon" variant="ghost" />}>
          <Menu className="w-6 h-6" />
        </SheetTrigger>

        <SheetContent side="right" className="w-72 px-6">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="py-6 border-b">
              <MainLogo />
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-4 py-6">
              <Link href="/products">Shop</Link>
              <Link href="/categories">Categories</Link>
              <Link href="/about">About</Link>

              <Link href="/cart" className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Cart {cartCount > 0 && `(${cartCount})`}
              </Link>
            </div>

            {/* Auth Section */}
            <div className="mt-auto pb-6 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <p className="text-sm text-muted-foreground mb-2">
                    Signed in as {user?.name}
                  </p>

                  <Link href="/dashboard">
                    <Button className="w-full">Dashboard</Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full flex gap-2"
                    onClick={logout}
                  >
                    <User className="w-4 h-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>

                  <Link href="/register">
                    <Button className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
