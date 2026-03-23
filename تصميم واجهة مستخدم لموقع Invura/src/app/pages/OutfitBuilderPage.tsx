import { useState } from "react";
import { motion } from "motion/react";
import {
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ShoppingCart,
  RefreshCw,
  Shirt,
  User,
} from "lucide-react";

const clothingItems = {
  top: [
    {
      id: 1,
      name: "قميص أسود",
      image: "https://images.unsplash.com/photo-1769072060413-93a53d8778e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGF0aGxldGljJTIwc2hpcnR8ZW58MXx8fHwxNzc0Mjc1ODQ4fDA&ixlib=rb-4.1.0&q=80&w=400",
      price: 149,
    },
    {
      id: 2,
      name: "قميص رياضي",
      image: "https://images.unsplash.com/photo-1765791277994-33e886a83a9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjbG90aGluZyUyMGF0aGxldGljJTIwd2VhcnxlbnwxfHx8fDE3NzQyNzU4NDd8MA&ixlib=rb-4.1.0&q=80&w=400",
      price: 129,
    },
  ],
  bottom: [
    {
      id: 3,
      name: "بنطال رياضي",
      image: "https://images.unsplash.com/photo-1765791277994-33e886a83a9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjbG90aGluZyUyMGF0aGxldGljJTIwd2VhcnxlbnwxfHx8fDE3NzQyNzU4NDd8MA&ixlib=rb-4.1.0&q=80&w=400",
      price: 199,
    },
  ],
  shoes: [
    {
      id: 4,
      name: "حذاء جري",
      image: "https://images.unsplash.com/photo-1765914448113-ebf0ce8cb918?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXMlMjBhdGhsZXRpY3xlbnwxfHx8fDE3NzQyNzU4NDZ8MA&ixlib=rb-4.1.0&q=80&w=400",
      price: 299,
    },
  ],
  accessories: [
    {
      id: 5,
      name: "قفازات تدريب",
      image: "https://images.unsplash.com/photo-1761946356399-8335dbdce394?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwYWNjZXNzb3JpZXMlMjB3YXRlciUyMGJvdHRsZXxlbnwxfHx8fDE3NzQyNzU4NDZ8MA&ixlib=rb-4.1.0&q=80&w=400",
      price: 79,
    },
  ],
};

type ClothingCategory = keyof typeof clothingItems;

export function OutfitBuilderPage() {
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory>("top");
  const [selectedItems, setSelectedItems] = useState<{
    top?: typeof clothingItems.top[0];
    bottom?: typeof clothingItems.bottom[0];
    shoes?: typeof clothingItems.shoes[0];
    accessories?: typeof clothingItems.accessories[0];
  }>({});
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  const handleRotate = () => {
    setRotation((prev) => (prev + 45) % 360);
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleReset = () => {
    setRotation(0);
    setScale(1);
  };

  const totalPrice = Object.values(selectedItems).reduce(
    (sum, item) => sum + (item?.price || 0),
    0
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold mb-4">منشئ الأزياء الرياضية</h1>
        <p className="text-xl text-gray-600">صمم إطلالتك الرياضية المثالية</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Avatar Display Area */}
        <div className="lg:col-span-7">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-8 shadow-lg">
            <div className="bg-white rounded-lg p-8 mb-6 min-h-[500px] flex items-center justify-center relative overflow-hidden">
              <motion.div
                style={{
                  transform: `rotate(${rotation}deg) scale(${scale})`,
                }}
                transition={{ type: "spring", stiffness: 100 }}
                className="relative"
              >
                {/* Avatar Placeholder */}
                <div className="w-64 h-64 bg-gray-300 rounded-full flex items-center justify-center mb-8">
                  <User className="w-32 h-32 text-gray-500" />
                </div>

                {/* Selected Items Display */}
                <div className="space-y-4 text-center">
                  {selectedItems.top && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-3 rounded-lg shadow-md inline-block"
                    >
                      <p className="text-sm font-bold">{selectedItems.top.name}</p>
                    </motion.div>
                  )}
                  {selectedItems.bottom && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-3 rounded-lg shadow-md inline-block"
                    >
                      <p className="text-sm font-bold">{selectedItems.bottom.name}</p>
                    </motion.div>
                  )}
                  {selectedItems.shoes && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-3 rounded-lg shadow-md inline-block"
                    >
                      <p className="text-sm font-bold">{selectedItems.shoes.name}</p>
                    </motion.div>
                  )}
                  {selectedItems.accessories && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-3 rounded-lg shadow-md inline-block"
                    >
                      <p className="text-sm font-bold">{selectedItems.accessories.name}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Info Badge */}
              {Object.keys(selectedItems).length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black/80 text-white px-6 py-4 rounded-lg text-center">
                    <Shirt className="w-12 h-12 mx-auto mb-2" />
                    <p className="font-bold">اختر الملابس لرؤية الزي</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={handleRotate}
                className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <RotateCw className="w-5 h-5" />
                <span>تدوير</span>
              </button>
              <button
                onClick={handleZoomIn}
                className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <ZoomIn className="w-5 h-5" />
                <span>تكبير</span>
              </button>
              <button
                onClick={handleZoomOut}
                className="bg-black text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <ZoomOut className="w-5 h-5" />
                <span>تصغير</span>
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>إعادة تعيين</span>
              </button>
            </div>

            {/* Stats */}
            <div className="mt-6 bg-white rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 mb-1">الدوران</p>
                <p className="font-bold">{rotation}°</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">التكبير</p>
                <p className="font-bold">{(scale * 100).toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">المنتجات</p>
                <p className="font-bold">{Object.keys(selectedItems).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clothing Selection Panel */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            {/* Category Tabs */}
            <div className="grid grid-cols-2 gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory("top")}
                className={`py-3 px-4 rounded-lg font-bold transition-colors ${
                  selectedCategory === "top"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Top
              </button>
              <button
                onClick={() => setSelectedCategory("bottom")}
                className={`py-3 px-4 rounded-lg font-bold transition-colors ${
                  selectedCategory === "bottom"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Bottom
              </button>
              <button
                onClick={() => setSelectedCategory("shoes")}
                className={`py-3 px-4 rounded-lg font-bold transition-colors ${
                  selectedCategory === "shoes"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Shoes
              </button>
              <button
                onClick={() => setSelectedCategory("accessories")}
                className={`py-3 px-4 rounded-lg font-bold transition-colors ${
                  selectedCategory === "accessories"
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Accessories
              </button>
            </div>

            {/* Items List */}
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {clothingItems[selectedCategory].map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    setSelectedItems({ ...selectedItems, [selectedCategory]: item })
                  }
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedItems[selectedCategory]?.id === item.id
                      ? "border-red-600 bg-red-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold mb-1">{item.name}</h3>
                      <p className="text-xl font-extrabold text-black">{item.price} ر.س</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Total & Add to Cart */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">الإجمالي:</span>
                <span className="text-3xl font-extrabold text-black">{totalPrice} ر.س</span>
              </div>
              <button
                disabled={Object.keys(selectedItems).length === 0}
                className="w-full bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>أضف الزي للسلة</span>
              </button>
              <p className="text-center text-sm text-gray-600 mt-3">
                {Object.keys(selectedItems).length === 0
                  ? "اختر المنتجات لإضافتها للسلة"
                  : `تم اختيار ${Object.keys(selectedItems).length} منتج`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
