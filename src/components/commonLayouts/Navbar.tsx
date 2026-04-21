"use client";

import MainLogo from "./mainLogo";
import { MobileMenu } from "./MobileMenu";
import { UserNav } from "./UserNav";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT */}
          <MainLogo />

          {/* CENTER (desktop only) */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/products"
              className="text-sm font-medium hover:text-primary transition"
            >
              Shop
            </Link>
            <Link
              href="/categories"
              className="text-sm font-medium hover:text-primary transition"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium hover:text-primary transition"
            >
              About
            </Link>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <UserNav />
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
