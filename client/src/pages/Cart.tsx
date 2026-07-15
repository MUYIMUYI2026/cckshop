import { Link } from "wouter";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const PLACEHOLDER_IMAGES: Record<string, string> = {
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&h=200&fit=crop",
  skincare: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200&h=200&fit=crop",
  electronics: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
  daily: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=200&fit=crop",
};

export default function Cart() {
  const { items, removeItem, updateQty, clearCart, subtotal, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-muted/20 flex items-center justify-center">
        <div className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products to get started!</p>
          <Link href="/shop">
            <Button className="gap-2">
              Continue Shopping <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    toast.info("Checkout feature coming soon! Please contact us at services@cckshop.com for wholesale orders.");
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="bg-white border-b border-border">
        <div className="container py-6">
          <h1 className="text-2xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground text-sm mt-1">{totalItems} item{totalItems !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="container py-8">
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(item => {
              const price = item.isWholesale ? parseFloat(item.wholesalePrice) : parseFloat(item.retailPrice);
              const imgSrc = item.imageUrl || PLACEHOLDER_IMAGES[item.category] || PLACEHOLDER_IMAGES.daily;

              return (
                <div key={item.id} className="bg-white rounded-xl border border-border p-4 flex gap-4">
                  <img
                    src={imgSrc}
                    alt={item.name}
                    className="w-20 h-20 rounded-lg object-cover shrink-0 bg-muted"
                    onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGES.daily; }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {item.brand && (
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{item.brand}</p>
                        )}
                        <Link href={`/product/${item.slug}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-2">
                          {item.name}
                        </Link>
                        {item.isWholesale && (
                          <span className="inline-block mt-1 text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            WHOLESALE
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => { removeItem(item.id); toast.success("Item removed"); }}
                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">${(price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">${price.toFixed(2)} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => { clearCart(); toast.success("Cart cleared"); }}
              className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5 mt-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear all items
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
              <h3 className="font-bold text-foreground mb-4">Order Summary</h3>

              <div className="space-y-2 mb-4">
                {items.map(item => {
                  const price = item.isWholesale ? parseFloat(item.wholesalePrice) : parseFloat(item.retailPrice);
                  return (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate mr-2">{item.name} ×{item.quantity}</span>
                      <span className="font-medium shrink-0">${(price * item.quantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-border pt-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-primary">
                    {subtotal >= 99 ? "FREE" : "Calculated at checkout"}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="font-bold text-foreground">Total</span>
                  <span className="font-black text-xl text-foreground">${subtotal.toFixed(2)}</span>
                </div>
                {subtotal < 99 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Add ${(99 - subtotal).toFixed(2)} more for free shipping
                  </p>
                )}
              </div>

              <Button size="lg" className="w-full gap-2 font-semibold" onClick={handleCheckout}>
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-3">
                For wholesale orders, contact{" "}
                <a href="mailto:services@cckshop.com" className="text-primary hover:underline">
                  services@cckshop.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
