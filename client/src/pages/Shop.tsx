import { useState } from "react";
import { useLocation } from "wouter";
import { Search, SlidersHorizontal, X, ChevronDown, ChevronRight } from "lucide-react";
import { trpc } from "@/lib/trpc";
import ProductCard from "@/components/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { value: "all", label: "All Products", group: null },
  { value: "beauty", label: "Beauty", group: "Shop" },
  { value: "skincare", label: "Skincare", group: "Shop" },
  { value: "electronics", label: "Electronics", group: "Shop" },
  { value: "daily", label: "Daily Essentials", group: "Shop" },
  { value: "clothing", label: "Clothing", group: "Clothing, Shoes & Jewelry" },
  { value: "shoes", label: "Shoes", group: "Clothing, Shoes & Jewelry" },
];

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A-Z" },
];

export default function Shop() {
  const [location] = useLocation();
  const params = new URLSearchParams(location.includes("?") ? location.split("?")[1] : "");
  const [category, setCategory] = useState(params.get("category") || "all");
  const [search, setSearch] = useState(params.get("search") || "");
  const [searchInput, setSearchInput] = useState(params.get("search") || "");
  const [sort, setSort] = useState("default");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Shop: true,
    "Clothing & Shoes": true,
  });

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  const { data, isLoading } = trpc.products.list.useQuery({
    category: category === "all" ? undefined : category,
    search: search || undefined,
    limit: 50,
  });

  const products = data?.items ?? [];

  const sorted = [...products].sort((a, b) => {
    if (sort === "price_asc") return parseFloat(a.retailPrice) - parseFloat(b.retailPrice);
    if (sort === "price_desc") return parseFloat(b.retailPrice) - parseFloat(a.retailPrice);
    if (sort === "name_asc") return a.name.localeCompare(b.name);
    return 0;
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput.trim());
  };

  const clearSearch = () => {
    setSearch("");
    setSearchInput("");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Page Header */}
      <div className="bg-white border-b border-border">
        <div className="container py-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Shop All Products</h1>
          <p className="text-muted-foreground text-sm">
            {isLoading ? "Loading..." : `${sorted.length} products available`}
          </p>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-56 shrink-0">
            <div className="bg-white rounded-xl border border-border p-5 sticky top-24">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </h3>

              {/* Category */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Category</p>
                <div className="space-y-1">
                  {/* All Products */}
                  <button
                    onClick={() => setCategory("all")}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      category === "all"
                        ? "bg-primary text-primary-foreground font-medium"
                        : "hover:bg-muted text-foreground/70"
                    }`}
                  >
                    All Products
                  </button>

                  {/* Shop group */}
                  <button
                    onClick={() => toggleGroup("Shop")}
                    className="w-full flex items-center justify-between px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                  >
                    <span>Shop</span>
                    {expandedGroups["Shop"] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {expandedGroups["Shop"] && CATEGORIES.filter(c => c.group === "Shop").map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat.value
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted text-foreground/70"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}

                  {/* Clothing, Shoes & Jewelry group */}
                  <button
                    onClick={() => toggleGroup("Clothing & Shoes")}
                    className="w-full flex items-center justify-between px-3 pt-3 pb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
                  >
                    <span>Clothing &amp; Shoes</span>
                    {expandedGroups["Clothing & Shoes"] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                  {expandedGroups["Clothing & Shoes"] && CATEGORIES.filter(c => c.group === "Clothing, Shoes & Jewelry").map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setCategory(cat.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        category === cat.value
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted text-foreground/70"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Sort By</p>
                <div className="space-y-1">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSort(opt.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        sort === opt.value
                          ? "bg-primary text-primary-foreground font-medium"
                          : "hover:bg-muted text-foreground/70"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Area */}
          <div className="flex-1">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="search"
                    value={searchInput}
                    onChange={e => setSearchInput(e.target.value)}
                    placeholder="Search products or brands..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
                  />
                  {search && (
                    <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                    </button>
                  )}
                </div>
                <Button type="submit" className="shrink-0">Search</Button>
              </div>
              {search && (
                <p className="text-sm text-muted-foreground mt-2">
                  Showing results for "<span className="font-medium text-foreground">{search}</span>"
                </p>
              )}
            </form>

            {/* Product Grid */}
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-border bg-white">
                    <Skeleton className="aspect-square" />
                    <div className="p-3 space-y-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sorted.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
                <p className="text-muted-foreground text-sm mb-4">Try adjusting your filters or search terms</p>
                <Button variant="outline" onClick={() => { setCategory("all"); clearSearch(); }}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {sorted.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
