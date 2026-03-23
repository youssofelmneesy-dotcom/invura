import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import Slider from "react-slick";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ShoppingCart,
  Star,
  ZoomIn,
} from "lucide-react";
import { api } from "../lib/api";
import type { Product } from "../lib/types";
import { useStore } from "../contexts/StoreContext";

function NextArrow(props: { onClick?: () => void }) {
  return (
    <button onClick={props.onClick} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full">
      <ChevronLeft className="w-5 h-5" />
    </button>
  );
}

function PrevArrow(props: { onClick?: () => void }) {
  return (
    <button onClick={props.onClick} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full">
      <ChevronRight className="w-5 h-5" />
    </button>
  );
}

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart, addToWishlist, removeFromWishlist, isWishlisted } = useStore();

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<{ categories: string[]; sizes: string[]; colors: string[] }>({
    categories: [],
    sizes: [],
    colors: [],
  });

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const queryString = useMemo(() => {
    const params = new URLSearchParams(searchParams);
    return `?${params.toString()}`;
  }, [searchParams]);

  useEffect(() => {
    api.filters().then((response) => setFilters(response));
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }
    api.product(Number(id)).then((response) => {
      setCurrentProduct(response.item);
      if (!selectedSize) {
        setSelectedSize(response.item.sizes[0] || "");
      }
      if (!selectedColor) {
        setSelectedColor(response.item.colors[0] || "");
      }
    });
  }, [id]);

  useEffect(() => {
    api.products(queryString).then((response) => setProducts(response.items));
  }, [queryString]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    rtl: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (!currentProduct) {
    return <div className="p-10 text-center">جاري تحميل المنتج...</div>;
  }

  const wishlistState = isWishlisted(currentProduct.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <aside className="lg:col-span-3">
          <div className="bg-white p-6 rounded-lg shadow space-y-6 sticky top-24">
            <h3 className="text-xl font-bold">فلاتر المنتجات</h3>

            <div>
              <label className="font-bold block mb-2">الفئة</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={searchParams.get("category") || ""}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value) {
                    params.set("category", e.target.value);
                  } else {
                    params.delete("category");
                  }
                  setSearchParams(params);
                }}
              >
                <option value="">الكل</option>
                {filters.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-2">المقاس</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={searchParams.get("size") || ""}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value) {
                    params.set("size", e.target.value);
                  } else {
                    params.delete("size");
                  }
                  setSearchParams(params);
                }}
              >
                <option value="">الكل</option>
                {filters.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-2">اللون</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={searchParams.get("color") || ""}
                onChange={(e) => {
                  const params = new URLSearchParams(searchParams);
                  if (e.target.value) {
                    params.set("color", e.target.value);
                  } else {
                    params.delete("color");
                  }
                  setSearchParams(params);
                }}
              >
                <option value="">الكل</option>
                {filters.colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setSearchParams({})}
              className="w-full border border-black py-2 rounded font-bold"
            >
              إعادة ضبط الفلاتر
            </button>
          </div>
        </aside>

        <div className="lg:col-span-9 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Slider {...sliderSettings}>
                {currentProduct.images.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative">
                    <img
                      src={image}
                      alt={currentProduct.name}
                      className="w-full aspect-square rounded-xl object-cover cursor-zoom-in"
                      onClick={() => setZoomedImage(image)}
                    />
                    <button onClick={() => setZoomedImage(image)} className="absolute top-3 left-3 bg-white p-2 rounded-full">
                      <ZoomIn className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </Slider>
            </div>

            <div className="space-y-5">
              <h1 className="text-3xl font-extrabold">{currentProduct.name}</h1>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-sm text-gray-500">(تقييمات حقيقية)</span>
              </div>

              <div>
                {currentProduct.pricing.discountPercent > 0 && (
                  <p className="text-gray-500 line-through">{currentProduct.pricing.base} ر.س</p>
                )}
                <p className="text-4xl font-extrabold">{currentProduct.pricing.final} ر.س</p>
              </div>

              <p className="text-gray-700">{currentProduct.description}</p>

              <div>
                <h3 className="font-bold mb-2">المقاس</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-2 rounded border ${selectedSize === size ? "bg-black text-white" : "bg-white"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold mb-2">اللون</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-2 rounded border ${selectedColor === color ? "bg-black text-white" : "bg-white"}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2"
                  onClick={async () => addToCart({ productId: currentProduct.id, qty: 1, size: selectedSize, color: selectedColor })}
                >
                  <ShoppingCart className="w-5 h-5" />
                  أضف إلى السلة
                </button>
                <button
                  className={`px-4 rounded-lg border ${wishlistState ? "border-red-600 text-red-600" : "border-gray-300"}`}
                  onClick={() =>
                    wishlistState ? removeFromWishlist(currentProduct.id) : addToWishlist(currentProduct)
                  }
                >
                  <Heart className={`w-5 h-5 ${wishlistState ? "fill-red-600" : ""}`} />
                </button>
              </div>
            </div>
          </div>

          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-extrabold mb-4">منتجات مرتبطة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => navigate(`/product/${product.id}`)}
                  className="text-right border rounded-lg p-3 flex gap-3 hover:shadow"
                >
                  <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded object-cover" loading="lazy" />
                  <div>
                    <p className="font-bold">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.pricing.final} ر.س</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {zoomedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setZoomedImage(null)}>
          <img src={zoomedImage} alt="zoom" className="max-w-full max-h-full object-contain" />
        </div>
      )}
    </div>
  );
}
