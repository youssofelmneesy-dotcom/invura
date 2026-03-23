import { motion } from "motion/react";
import { Heart, ShoppingCart } from "lucide-react";
import { useStore } from "../contexts/StoreContext";
import type { Product } from "../lib/types";

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isWishlisted } = useStore();
  const isFavorite = isWishlisted(product.id);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <button
          onClick={async (e) => {
            e.stopPropagation();
            if (isFavorite) {
              removeFromWishlist(product.id);
            } else {
              addToWishlist(product);
            }
          }}
          className="absolute top-2 left-2 bg-white p-1.5 rounded-full shadow hover:bg-red-50 transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${isFavorite ? "fill-red-600 text-red-600" : "text-gray-700"}`}
          />
        </button>
        <div className="absolute bottom-0 right-0 bg-red-600 text-white px-2 py-1 text-xs font-bold">
          جديد
        </div>
      </div>
      <div className="p-3">
        <h3 className="text-sm md:text-base font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div>
            {product.pricing.discountPercent > 0 && (
              <span className="text-xs line-through text-gray-400 ml-2">{product.pricing.base} ج.م</span>
            )}
            <span className="text-base md:text-lg font-extrabold text-black">{product.pricing.final} ج.م</span>
          </div>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              await addToCart({ productId: product.id, qty: 1 });
            }}
            className="bg-black text-white p-1.5 md:p-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
