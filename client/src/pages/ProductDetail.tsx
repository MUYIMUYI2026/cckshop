import { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, ChevronRight, Package, Tag, Minus, Plus, ArrowLeft, CheckCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const PLACEHOLDER_IMAGES: Record<string, string> = {
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&h=600&fit=crop",
  skincare: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600&h=600&fit=crop",
  electronics: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop",
  daily: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop",
};

const CATEGORY_LABELS: Record<string, string> = {
  beauty: "Beauty",
  skincare: "Skincare",
  electronics: "Electronics",
  daily: "Daily Essentials",
};

export default function ProductDetail({ slug }: { slug: string }) {
  const { data: product, isLoading, error } = trpc.products.getBySlug.useQuery({ slug });
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [isWholesale, setIsWholesale] = useState(false);

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="grid md:grid-cols-2 gap-10">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-20 text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-6">This product doesn't exist or has been removed.</p>
        <Link href="/shop"><Button>Back to Shop</Button></Link>
      </div>
    );
  }

  const imgSrc = product.imageUrl || PLACEHOLDER_IMAGES[product.category] || PLACEHOLDER_IMAGES.daily;
  const retailPrice = parseFloat(product.retailPrice);
  const wholesalePrice = parseFloat(product.wholesalePrice);
  const displayPrice = isWholesale ? wholesalePrice : retailPrice;
  const savings = retailPrice - wholesalePrice;
  const savingsPct = Math.round((savings / retailPrice) * 100);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      retailPrice: product.retailPrice,
      wholesalePrice: product.wholesalePrice,
      imageUrl: product.imageUrl,
      category: product.category,
      isWholesale,
    }, qty);
    toast.success(`${qty}x ${product.name} added to cart`);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="container py-3">
          <nav className="flex items-center gap-1 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/shop?category=${product.category}`} className="hover:text-primary transition-colors">
              {CATEGORY_LABELS[product.category]}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container py-10">
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>

        <div className="grid md:grid-cols-2 gap-10 bg-white rounded-2xl border border-border p-6 lg:p-10">
          {/* Image */}
          <div className="aspect-square rounded-xl overflow-hidden bg-muted">
            <img
              src={imgSrc}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGES.daily; }}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              {product.isNewArrival && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-primary text-primary-foreground rounded-full">NEW</span>
              )}
              {product.isBestSeller && (
                <span className="px-2.5 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">BEST SELLER</span>
              )}
              <span className="px-2.5 py-0.5 text-xs font-semibold bg-muted text-muted-foreground rounded-full capitalize">
                {CATEGORY_LABELS[product.category]}
              </span>
            </div>

            {product.brand && (
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide mb-1">{product.brand}</p>
            )}
            <h1 className="text-2xl font-bold text-foreground mb-4">{product.name}</h1>

            {/* Price Toggle */}
            <div className="bg-muted/50 rounded-xl p-4 mb-5">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setIsWholesale(false)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    !isWholesale ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Retail Price
                </button>
                <button
                  onClick={() => setIsWholesale(true)}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    isWholesale ? "bg-white shadow text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Wholesale Price
                </button>
              </div>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-black text-foreground">${displayPrice.toFixed(2)}</span>
                {isWholesale && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">${retailPrice.toFixed(2)}</span>
                    <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      Save {savingsPct}%
                    </span>
                  </>
                )}
              </div>
              {isWholesale && (
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  Minimum order: {product.minWholesaleQty} units
                </p>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{product.description}</p>
            )}

            {/* Stock */}
            <div className="flex items-center gap-2 mb-5">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-sm font-medium text-foreground">Quantity:</span>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-9 h-9 flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-sm text-muted-foreground">
                Total: <span className="font-bold text-foreground">${(displayPrice * qty).toFixed(2)}</span>
              </span>
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              className="gap-2 w-full font-semibold"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </Button>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
              <div className="flex flex-col items-center gap-1">
                <span className="text-primary">🚚</span>
                Free shipping $99+
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-primary">🔒</span>
                Secure checkout
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-primary">↩️</span>
                Easy returns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
