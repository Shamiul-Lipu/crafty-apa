"use client";
import Image from "next/image";
import Link from "next/link";

const floatingItems = [
  {
    src: "/box.png",
    alt: "Chocolate 1",
    top: "15%",
    left: "10%",
    w: 40,
    mdW: 32,
    rotate: 3,
  },
  {
    src: "/box.png",
    alt: "Chocolate 2",
    top: "55%",
    left: "75%",
    w: 16,
    mdW: 28,
    rotate: -6,
  },
  {
    src: "/c_box.png",
    alt: "Gift Bundle",
    top: "70%",
    left: "40%",
    w: 70,
    mdW: 36,
    rotate: 37,
  },
  {
    src: "/c_box.png",
    alt: "Chocolate 3",
    top: "35%",
    left: "60%",
    w: 70,
    mdW: 24,
    rotate: 15,
  },
];

const icons = [
  {
    src: "/choco.png",
    alt: "Cocoa Bean",
    top: "20%",
    left: "80%",
    w: 50,
    mdW: 12,
  },
  {
    src: "/craft.png",
    alt: "Star",
    top: "10%",
    left: "30%",
    w: 70,
    mdW: 10,
  },
  {
    src: "/craft.png",
    alt: "Gift Icon",
    top: "80%",
    left: "15%",
    w: 40,
    mdW: 36,
  },
];

export default function HeroSection() {
  return (
    <section className="relative w-full h-[80vh] flex items-center justify-center overflow-hidden bg-[#EADAce]/20">
      {/* Floating background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-200/30 rounded-full blur-3xl animate-float-slow delay-2000"></div>
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-yellow-200/30 rounded-full blur-2xl animate-float-slower delay-1000"></div>
      </div>

      {/* Floating product images */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {floatingItems.map((item, i) => (
          <div
            key={i}
            className={`absolute animate-float`}
            style={{
              top: item.top,
              left: item.left,
              transform: `rotate(${item.rotate}deg)`,
            }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={item.w * 4}
              height={item.w * 4}
              className="opacity-90 md:opacity-100"
              priority
            />
          </div>
        ))}

        {/* Related icons */}
        {icons.map((icon, i) => (
          <div
            key={i}
            className="absolute animate-float-slow opacity-80"
            style={{ top: icon.top, left: icon.left }}
          >
            <Image
              src={icon.src}
              alt={icon.alt}
              width={icon.w * 4}
              height={icon.w * 4}
              priority
            />
          </div>
        ))}
      </div>

      {/* Centered Text */}
      {/* Centered Text */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        <div className="bg-white/5 backdrop-blur-md rounded-xl px-6 py-6 shadow-lg">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-3 animate-fade-in">
            Handcrafted with Love
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-4 animate-fade-in delay-500">
            Sweet Gifts that{" "}
            <span className="text-primary italic">Surprise</span> & Delight
          </h1>

          <p className="text-base md:text-lg text-foreground/80 mb-6 animate-fade-in delay-700">
            Discover artisanal chocolates and handmade gift bundles designed to
            create unforgettable moments.
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-fade-in delay-900">
            <Link
              href="/products"
              className="rounded-full bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition"
            >
              Shop Collection
            </Link>
            <Link
              href="/products?category=occasions"
              className="rounded-full border px-6 py-2 text-sm font-medium hover:bg-background transition"
            >
              Gift by Occasion
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
