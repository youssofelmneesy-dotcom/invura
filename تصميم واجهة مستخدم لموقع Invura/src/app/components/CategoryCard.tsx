import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";

interface CategoryCardProps {
  title: string;
  image: string;
  onClick: () => void;
}

export function CategoryCard({ title, image, onClick }: CategoryCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative overflow-hidden rounded-lg cursor-pointer shadow-lg group"
    >
      <div className="aspect-square">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      <div className="absolute bottom-0 right-0 left-0 p-6">
        <h3 className="text-white text-2xl font-extrabold mb-2">{title}</h3>
        <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
          <span>تصفح</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </button>
      </div>
    </motion.div>
  );
}
