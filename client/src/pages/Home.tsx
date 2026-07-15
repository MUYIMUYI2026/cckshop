import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, ShieldCheck, Truck, Star, Package, Users, Globe, TrendingUp, Sparkles, Zap } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const BRANDS = [
  { name: "GlowLab", color: "bg-pink-50 text-pink-600" },
  { name: "ColorPop", color: "bg-purple-50 text-purple-600" },
  { name: "TechPro", color: "bg-blue-50 text-blue-600" },
  { name: "SoftTouch", color: "bg-orange-50 text-orange-600" },
  { name: "EcoHome", color: "bg-green-50 text-green-600" },
  { name: "PureNature", color: "bg-teal-50 text-teal-600" },
];

const CATEGORIES = [
  {
    name: "Beauty",
    slug: "beauty",
    icon: "💄",
    desc: "Lipsticks, foundations, palettes & more",
    bg: "from-pink-500 to-rose-400",
    img: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=400&fit=crop",
  },
  {
    name: "Skincare",
    slug: "skincare",
    icon: "✨",
    desc: "Serums, moisturizers, sunscreens & more",
    bg: "from-emerald-500 to-teal-400",
    img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=400&fit=crop",
  },
  {
    name: "Electronics",
    slug: "electronics",
    icon: "⚡",
    desc: "Earbuds, lamps, power banks & more",
    bg: "from-blue-500 to-indigo-400",
    img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=400&fit=crop",
  },
  {
    name: "Daily Essentials",
    slug: "daily",
    icon: "🏠",
    desc: "Hand creams, towels, shampoos & more",
    bg: "from-amber-500 to-orange-400",
    img: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop",
  },
];

const STATS = [
  { value: "10,000+", label: "Products", icon: Package },
  { value: "500+", label: "Trusted Brands", icon: Star },
  { value: "50+", label: "Countries Served", icon: Globe },
  { value: "5,000+", label: "Happy Customers", icon: Users },
];

const PRODUCT_TABS = [
  { key: "featured", label: "Featured", icon: Sparkles },
  { key: "bestSeller", label: "Best Sellers", icon: TrendingUp },
  { key: "newArrival", label: "New Arrivals", icon: Zap },
];

function ProductTabSection() {
  const [activeTab, setActiveTab] = useState("featured");

  const { data: featuredData, isLoading: fl } = trpc.products.list.useQuery({ featured: true, limit: 8 });
  const { data: bestData, isLoading: bl } = trpc.products.list.useQuery({ bestSeller: true, limit: 8 });
  const { data: newData, isLoading: nl } = trpc.products.list.useQuery({ newArrival: true, limit: 8 });

  const tabData: Record<string, { items: any[]; loading: boolean }> = {
    featured: { items: featuredData?.items ?? [], loading: fl },
    bestSeller: { items: bestData?.items ?? [], loading: bl },
    newArrival: { items: newData?.items ?? [], loading: nl },
  };

  const { items, loading } = tabData[activeTab];

  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Our Products</h2>
            <p className="text-muted-foreground text-sm mt-1">Curated selection for every need</p>
          </div>
          <div className="flex bg-muted rounded-lg p-1 gap-1">
            {PRODUCT_TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-border">
                <Skeleton className="aspect-square" />
                <div className="p-3 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/shop">
            <Button variant="outline" className="gap-2">
              View All Products <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, oklch(0.72 0.19 152) 0%, transparent 50%), radial-gradient(circle at 80% 20%, oklch(0.60 0.15 200) 0%, transparent 50%)" }}
        />
        <div className="container relative py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-4 py-1.5 text-sm text-primary mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Wholesale &amp; Retail Marketplace
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-6">
                Premium Products,
                <br />
                <span className="text-primary">Global Prices</span>
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed mb-8 max-w-lg">
                Shop beauty, skincare, electronics, and daily essentials at unbeatable prices. Whether you're a retail shopper or wholesale buyer, CCKShop has you covered.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  onClick={() => navigate("/shop")}
                >
                  Shop Now <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/30 text-white hover:bg-white/10 bg-transparent"
                  onClick={() => navigate("/wholesale")}
                >
                  Wholesale Inquiry
                </Button>
              </div>
              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  100% Authentic
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Truck className="w-4 h-4 text-primary" />
                  Free Shipping $99+
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <Package className="w-4 h-4 text-primary" />
                  Easy Returns
                </div>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=300&fit=crop" alt="Beauty" className="rounded-2xl w-full object-cover aspect-square" />
                <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop" alt="Electronics" className="rounded-2xl w-full object-cover aspect-video" />
              </div>
              <div className="space-y-4 pt-8">
                <img src="https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=200&fit=crop" alt="Skincare" className="rounded-2xl w-full object-cover aspect-video" />
                <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop" alt="Daily" className="rounded-2xl w-full object-cover aspect-square" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center text-white">
                <stat.icon className="w-6 h-6 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-black mb-1">{stat.value}</div>
                <div className="text-sm opacity-80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <h2 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">
            Trusted Brands We Carry
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {BRANDS.map(brand => (
              <div
                key={brand.name}
                className={`${brand.color} rounded-xl py-4 px-3 text-center font-bold text-sm hover:scale-105 transition-transform cursor-pointer`}
              >
                {brand.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-foreground">Shop by Category</h2>
            <p className="text-muted-foreground mt-2">Find exactly what you need</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/shop?category=${cat.slug}`} className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.bg} opacity-70 group-hover:opacity-80 transition-opacity`} />
                <div className="absolute inset-0 flex flex-col justify-end p-5 text-white">
                  <div className="text-3xl mb-2">{cat.icon}</div>
                  <h3 className="text-lg font-bold">{cat.name}</h3>
                  <p className="text-xs opacity-80 mt-0.5">{cat.desc}</p>
                  <div className="flex items-center gap-1 mt-2 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Shop Now <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Product Tabs Section */}
      <ProductTabSection />

      {/* Wholesale CTA */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 rounded-full px-3 py-1 text-xs text-primary mb-4">
                <Package className="w-3 h-3" />
                Wholesale Program
              </div>
              <h2 className="text-3xl font-black mb-3">Grow Your Business with CCKShop</h2>
              <p className="text-gray-300 max-w-lg">
                Access exclusive wholesale pricing, bulk discounts, and dedicated account management. Perfect for retailers, distributors, and resellers.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-gray-300">
                {["Up to 40% off retail prices", "Low minimum order quantities", "Dedicated wholesale support", "Fast worldwide shipping"].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3 shrink-0">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
                onClick={() => navigate("/wholesale")}
              >
                Apply for Wholesale <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
