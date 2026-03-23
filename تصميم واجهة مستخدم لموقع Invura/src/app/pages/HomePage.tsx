import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Slider from "react-slick";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { CategoryCard } from "../components/CategoryCard";
import { ProductCard } from "../components/ProductCard";
import { api } from "../lib/api";
import type { Product } from "../lib/types";

function NextArrow(props: { onClick?: () => void }) {
  return (
    <button
      onClick={props.onClick}
      className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black text-white p-3 rounded-full"
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
}

function PrevArrow(props: { onClick?: () => void }) {
  return (
    <button
      onClick={props.onClick}
      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black text-white p-3 rounded-full"
    >
      <ArrowRight className="w-5 h-5" />
    </button>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    api.products().then((response) => setProducts(response.items));
    api.filters().then((response) => setCategories(response.categories));
  }, []);

  const featuredProducts = useMemo(
    () => products.filter((p) => p.featured),
    [products],
  );
  const bestSellers = useMemo(
    () => products.filter((p) => p.bestSeller),
    [products],
  );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    rtl: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div>
      <section className="relative min-h-[70vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1762744827101-404f5cc7d8ab?auto=format&fit=crop&w=1400&q=80"
          alt="Invura Hero"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative container mx-auto px-4 py-24 text-center text-white">
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-extrabold mb-4">
            Invura متجر رياضي عربي
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-xl md:text-2xl mb-8">
            تسوق منتجات أصلية، عروض VIP، وتجربة Outfit Builder تفاعلية.
          </motion.p>
          <button onClick={() => navigate("/cart")} className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg text-lg font-bold">
            ابدأ التسوق الآن
          </button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-extrabold text-center mb-10">الفئات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={category}
              title={category}
              image={products[index % Math.max(products.length, 1)]?.images[0] || "https://images.unsplash.com/photo-1632077804406-188472f1a810?auto=format&fit=crop&w=800&q=80"}
              onClick={() => navigate(`/product/${products.find((p) => p.category === category)?.id || 1}?category=${encodeURIComponent(category)}`)}
            />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-extrabold text-center mb-10">المنتجات المميزة</h2>
        <Slider {...sliderSettings}>
          {featuredProducts.map((product) => (
            <div key={product.id} className="px-3">
              <ProductCard product={product} onClick={() => navigate(`/product/${product.id}`)} />
            </div>
          ))}
        </Slider>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-10">الأكثر مبيعاً</h2>
          <Slider {...sliderSettings}>
            {bestSellers.map((product) => (
              <div key={product.id} className="px-3">
                <ProductCard product={product} onClick={() => navigate(`/product/${product.id}`)} />
              </div>
            ))}
          </Slider>
        </div>
      </section>
    </div>
  );
}
