import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Search, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useBuyerAuth } from "@/hooks/useBuyerAuth";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Beauty", href: "/shop?category=beauty" },
  { label: "Skincare", href: "/shop?category=skincare" },
  { label: "Electronics", href: "/shop?category=electronics" },
  { label: "Daily Essentials", href: "/shop?category=daily" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const [location, navigate] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { totalItems } = useCart();
  const { buyer, isAuthenticated, logout } = useBuyerAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Announcement Bar */}
      <div className="bg-[oklch(0.72_0.19_152)] text-white text-xs py-2">
        <div className="container flex items-center justify-center gap-6 flex-wrap">
          <span>🚚 Free Shipping on Orders Over $99</span>
          <span className="hidden sm:inline">|</span>
          <span>🛡️ 100% Authenticity Guaranteed</span>
          <span className="hidden sm:inline">|</span>
          <span>✅ Wholesale &amp; Retail Available</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="border-b border-border">
        <div className="container flex items-center gap-4 h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="CCKShop" className="h-9 w-auto object-contain" />
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products, brands, categories..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-muted/30 transition-all"
              />
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Auth area */}
            <div className="hidden md:block relative">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(v => !v)}
                    className="flex items-center gap-1.5 text-sm font-medium text-gray-700 hover:text-green-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold">
                      {buyer?.firstName?.[0]?.toUpperCase()}
                    </div>
                    <span>{buyer?.firstName}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {dropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-20">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-xs font-medium text-gray-900">{buyer?.firstName} {buyer?.lastName}</p>
                          <p className="text-xs text-gray-400 truncate">{buyer?.email}</p>
                        </div>
                        <button
                          onClick={() => { logout(); setDropdownOpen(false); }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Link href="/login">
                    <Button variant="ghost" size="sm" className="text-sm gap-1.5">
                      <User className="w-4 h-4" />
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="text-sm bg-green-600 hover:bg-green-700 text-white">
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            <button
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Category Nav */}
      <div className="border-b border-border bg-white hidden md:block">
        <div className="container">
          <nav className="flex items-center gap-1 h-10 overflow-x-auto">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm font-medium rounded-md whitespace-nowrap transition-colors hover:text-primary hover:bg-primary/5 ${
                  location === link.href ? "text-primary bg-primary/10" : "text-foreground/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-b border-border bg-white">
          <div className="container py-3 space-y-1">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            </form>
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-100 space-y-1">
              {isAuthenticated ? (
                <>
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Hi, {buyer?.firstName} {buyer?.lastName}
                  </div>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="block w-full text-left px-3 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 text-sm font-medium text-green-600 rounded-md hover:bg-green-50 transition-colors"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
