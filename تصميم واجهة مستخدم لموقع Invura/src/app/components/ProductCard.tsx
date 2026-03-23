import { motion } from "motion/react";
import { Heart, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  onClick: () => void;
}

export function ProductCard({ id, name, price, image, onClick }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
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
        <h3 className="text-lg font-bold text-gray-900 mb-2">{name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-extrabold text-black">{price} ر.س</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
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
