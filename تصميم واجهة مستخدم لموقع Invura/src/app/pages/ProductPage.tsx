import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import Slider from "react-slick";
import { Heart, ShoppingCart, Star, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

const productImages = [
  "https://images.unsplash.com/photo-1769072060413-93a53d8778e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGF0aGxldGljJTIwc2hpcnR8ZW58MXx8fHwxNzc0Mjc1ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1765791277994-33e886a83a9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjbG90aGluZyUyMGF0aGxldGljJTIwd2VhcnxlbnwxfHx8fDE3NzQyNzU4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1762744827101-404f5cc7d8ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMG1hbGUlMjBneW0lMjB3ZWFyfGVufDF8fHx8MTc3NDI3NTg0NXww&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1669807164466-10a6584a067e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB0cmFpbmluZyUyMHdvcmtvdXR8ZW58MXx8fHwxNzc0Mjc1ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
];

const reviews = [
  { id: 1, name: "أحمد محمد", rating: 5, comment: "منتج ممتاز وجودة عالية جداً!" },
  { id: 2, name: "سارة علي", rating: 5, comment: "مريح جداً وأنيق، أنصح به بشدة" },
  { id: 3, name: "محمد خالد", rating: 4, comment: "جيد جداً لكن التوصيل استغرق وقتاً" },
  { id: 4, name: "فاطمة حسن", rating: 5, comment: "أفضل منتج اشتريته من الموقع" },
];

const sizes = ["S", "M", "L", "XL", "XXL"];
const colors = ["أسود", "أبيض", "رمادي", "أحمر"];

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("أسود");
  const [isFavorite, setIsFavorite] = useState(false);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [priceFilter, setPriceFilter] = useState([0, 1000]);
  const [sizeFilter, setSizeFilter] = useState<string[]>([]);
  const [colorFilter, setColorFilter] = useState<string[]>([]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  function NextArrow(props: any) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
    );
  }

  function PrevArrow(props: any) {
    const { onClick } = props;
    return (
      <button
        onClick={onClick}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black text-white p-2 rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filter */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">الفلاتر</h3>
            
            {/* Price Filter */}
            <div className="mb-6">
              <h4 className="font-bold mb-3">السعر</h4>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceFilter[1]}
                  onChange={(e) => setPriceFilter([0, parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0 ر.س</span>
                  <span>{priceFilter[1]} ر.س</span>
                </div>
              </div>
            </div>

            {/* Size Filter */}
            <div className="mb-6">
              <h4 className="font-bold mb-3">المقاس</h4>
              <div className="space-y-2">
                {sizes.map((size) => (
                  <label key={size} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sizeFilter.includes(size)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSizeFilter([...sizeFilter, size]);
                        } else {
                          setSizeFilter(sizeFilter.filter((s) => s !== size));
                        }
                      }}
                      className="rounded"
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Color Filter */}
            <div className="mb-6">
              <h4 className="font-bold mb-3">اللون</h4>
              <div className="space-y-2">
                {colors.map((color) => (
                  <label key={color} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={colorFilter.includes(color)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setColorFilter([...colorFilter, color]);
                        } else {
                          setColorFilter(colorFilter.filter((c) => c !== color));
                        }
                      }}
                      className="rounded"
                    />
                    <span>{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-bold mb-3">الفئة</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span>Gym Wear</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span>Running</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span>Accessories</span>
                </label>
              </div>
            </div>

            {/* VIP/Offers Filter */}
            <div>
              <h4 className="font-bold mb-3">العروض</h4>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span>VIP فقط</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span>عروض خاصة</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span>منتجات محدودة</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Images Carousel */}
            <div>
              <div className="relative">
                <Slider {...sliderSettings}>
                  {productImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover cursor-pointer"
                          onClick={() => setZoomedImage(image)}
                        />
                      </div>
                      <button
                        onClick={() => setZoomedImage(image)}
                        className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                      >
                        <ZoomIn className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-extrabold mb-2">قميص تدريب احترافي</h1>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-gray-600">(125 تقييم)</span>
                </div>
                <p className="text-4xl font-extrabold text-black mb-4">149 ر.س</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-red-600 font-bold">عرض خاص: خصم 20% للأعضاء VIP</p>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="font-bold mb-3">المقاس</h3>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-lg font-bold transition-colors ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="font-bold mb-3">اللون</h3>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border-2 rounded-lg font-bold transition-colors ${
                        selectedColor === color
                          ? "bg-black text-white border-black"
                          : "border-gray-300 hover:border-black"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button className="flex-1 bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>أضف إلى السلة</span>
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`px-6 py-4 border-2 rounded-lg transition-colors ${
                    isFavorite
                      ? "bg-red-50 border-red-600 text-red-600"
                      : "border-gray-300 hover:border-red-600"
                  }`}
                >
                  <Heart
                    className={`w-6 h-6 ${isFavorite ? "fill-red-600" : ""}`}
                  />
                </button>
              </div>

              {/* Product Details */}
              <div className="border-t pt-6">
                <h3 className="font-bold mb-3">تفاصيل المنتج</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• المادة: 92% بوليستر، 8% إيلاستان</li>
                  <li>• تقنية امتصاص العرق والرطوبة</li>
                  <li>• قماش مرن وخفيف الوزن</li>
                  <li>• مقاوم للتجعد</li>
                  <li>• سهل العناية والغسيل</li>
                </ul>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold mb-3">الوصف</h3>
                <p className="text-gray-700 leading-relaxed">
                  قميص تدريب احترافي مصمم خصيصاً للرياضيين الذين يبحثون عن الأداء والراحة. 
                  مصنوع من قماش عالي الجودة يسمح بالتهوية الممتازة وامتصاص الرطوبة، 
                  مما يبقيك جافاً ومرتاحاً طوال فترة التمرين.
                </p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-extrabold mb-6">تقييمات العملاء</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="border-b pb-6 last:border-b-0"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center font-bold">
                      {review.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold">{review.name}</h4>
                        <div className="flex">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomedImage(null)}
        >
          <img
            src={zoomedImage}
            alt="Zoomed"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
