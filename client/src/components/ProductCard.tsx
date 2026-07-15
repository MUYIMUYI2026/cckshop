import { Link } from "wouter";
import { ShoppingCart, Tag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  slug: string;
  brand: string | null;
  retailPrice: string;
  wholesalePrice: string;
  imageUrl: string | null;
  category: string;
  isBestSeller: boolean;
  isNewArrival: boolean;
  stock: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  beauty: "bg-pink-100 text-pink-700",
  skincare: "bg-green-100 text-green-700",
  electronics: "bg-blue-100 text-blue-700",
  daily: "bg-orange-100 text-orange-700",
};

const PLACEHOLDER_IMAGES: Record<string, string> = {
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop",
  skincare: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
  electronics: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  daily: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
};

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const imgSrc = product.imageUrl || PLACEHOLDER_IMAGES[product.category] || PLACEHOLDER_IMAGES.daily;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      retailPrice: product.retailPrice,
      wholesalePrice: product.wholesalePrice,
      imageUrl: product.imageUrl,
      category: product.category,
      isWholesale: false,
    });
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={e => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGES.daily; }}
          />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNewArrival && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-primary text-primary-foreground rounded-full">NEW</span>
            )}
            {product.isBestSeller && (
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full">BEST SELLER</span>
            )}
          </div>
          {/* Add to cart overlay */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 shadow-md"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          {product.brand && (
            <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide mb-0.5">{product.brand}</p>
          )}
          <h3 className="text-sm font-semibold text-foreground line-clamp-2 mb-2 leading-tight">{product.name}</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-bold text-foreground">${parseFloat(product.retailPrice).toFixed(2)}</p>
              <p className="text-xs text-primary font-medium flex items-center gap-1">
                <Tag className="w-3 h-3" />
                Wholesale: ${parseFloat(product.wholesalePrice).toFixed(2)}
              </p>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[product.category] || "bg-gray-100 text-gray-600"}`}>
              {product.category}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
