"use client";

import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export function UserNav() {
  const { isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <div className="hidden md:flex items-center gap-2">
      {/* Cart */}
      <Link href="/cart" className="relative p-2 rounded-md hover:bg-muted transition">
        <ShoppingCart className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        )}
      </Link>

      {isAuthenticated ? (
        <>
          <Link href="/dashboard">
            <Button size="sm">Dashboard</Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className="text-muted-foreground"
          >
            Logout
          </Button>

          <Link
            href="/dashboard"
            className="p-2 rounded-md hover:bg-muted transition"
          >
            <User className="w-5 h-5" />
          </Link>
        </>
      ) : (
        <>
          <Link href="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>

          <Link href="/register">
            <Button size="sm">Register</Button>
          </Link>
        </>
      )}
    </div>
  );
}
