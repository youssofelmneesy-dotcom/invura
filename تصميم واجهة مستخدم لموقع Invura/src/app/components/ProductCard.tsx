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
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
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
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? "fill-red-600 text-red-600" : "text-gray-700"}`}
          />
        </button>
        <div className="absolute bottom-0 right-0 bg-red-600 text-white px-3 py-1 text-sm font-bold">
          جديد
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
        <div className="flex items-center justify-between">
          <div>
            {product.pricing.discountPercent > 0 && (
              <span className="text-sm line-through text-gray-400 ml-2">{product.pricing.base} ر.س</span>
            )}
            <span className="text-2xl font-extrabold text-black">{product.pricing.final} ر.س</span>
          </div>
          <button
            onClick={async (e) => {
              e.stopPropagation();
              await addToCart({ productId: product.id, qty: 1 });
            }}
            className="bg-black text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
