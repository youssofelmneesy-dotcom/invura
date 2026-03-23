import { useNavigate } from "react-router";
import { CategoryCard } from "../components/CategoryCard";
import { ProductCard } from "../components/ProductCard";
import Slider from "react-slick";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const categories = [
  {
    id: 1,
    title: "Gym Wear",
    image: "https://images.unsplash.com/photo-1632077804406-188472f1a810?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBlcXVpcG1lbnQlMjBmaXRuZXNzfGVufDF8fHx8MTc3NDI3NTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    title: "Running",
    image: "https://images.unsplash.com/photo-1765914448113-ebf0ce8cb918?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXMlMjBhdGhsZXRpY3xlbnwxfHx8fDE3NzQyNzU4NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    title: "Accessories",
    image: "https://images.unsplash.com/photo-1761946356399-8335dbdce394?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwYWNjZXNzb3JpZXMlMjB3YXRlciUyMGJvdHRsZXxlbnwxfHx8fDE3NzQyNzU4NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    title: "VIP & عروض خاصة",
    image: "https://images.unsplash.com/photo-1772354852092-0685c2bf32b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXAlMjBleGNsdXNpdmUlMjBsdXh1cnl8ZW58MXx8fHwxNzc0Mjc1ODQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const featuredProducts = [
  {
    id: 1,
    name: "قميص تدريب احترافي",
    price: 149,
    image: "https://images.unsplash.com/photo-1769072060413-93a53d8778e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGF0aGxldGljJTIwc2hpcnR8ZW58MXx8fHwxNzc0Mjc1ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    name: "بنطال رياضي مرن",
    price: 199,
    image: "https://images.unsplash.com/photo-1765791277994-33e886a83a9d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjbG90aGluZyUyMGF0aGxldGljJTIwd2VhcnxlbnwxfHx8fDE3NzQyNzU4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    name: "حذاء جري سريع",
    price: 299,
    image: "https://images.unsplash.com/photo-1765914448113-ebf0ce8cb918?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXMlMjBhdGhsZXRpY3xlbnwxfHx8fDE3NzQyNzU4NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    name: "طقم تمرين كامل",
    price: 399,
    image: "https://images.unsplash.com/photo-1669807164466-10a6584a067e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB0cmFpbmluZyUyMHdvcmtvdXR8ZW58MXx8fHwxNzc0Mjc1ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 5,
    name: "سترة رياضية",
    price: 249,
    image: "https://images.unsplash.com/photo-1762744827101-404f5cc7d8ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMG1hbGUlMjBneW0lMjB3ZWFyfGVufDF8fHx8MTc3NDI3NTg0NXww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

const bestSellers = [
  {
    id: 6,
    name: "طقم جيم VIP",
    price: 499,
    image: "https://images.unsplash.com/photo-1632077804406-188472f1a810?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBlcXVpcG1lbnQlMjBmaXRuZXNzfGVufDF8fHx8MTc3NDI3NTg0Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 7,
    name: "حذاء التدريب المتقدم",
    price: 349,
    image: "https://images.unsplash.com/photo-1765914448113-ebf0ce8cb918?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXMlMjBhdGhsZXRpY3xlbnwxfHx8fDE3NzQyNzU4NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 8,
    name: "قميص Performance Pro",
    price: 179,
    image: "https://images.unsplash.com/photo-1769072060413-93a53d8778e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGF0aGxldGljJTIwc2hpcnR8ZW58MXx8fHwxNzc0Mjc1ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 9,
    name: "حقيبة رياضية فاخرة",
    price: 279,
    image: "https://images.unsplash.com/photo-1761946356399-8335dbdce394?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwYWNjZXNzb3JpZXMlMjB3YXRlciUyMGJvdHRsZXxlbnwxfHx8fDE3NzQyNzU4NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 10,
    name: "طقم كامل للمحترفين",
    price: 599,
    image: "https://images.unsplash.com/photo-1669807164466-10a6584a067e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB0cmFpbmluZyUyMHdvcmtvdXR8ZW58MXx8fHwxNzc0Mjc1ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

function NextArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black text-white p-3 rounded-full transition-colors"
    >
      <ArrowLeft className="w-6 h-6" />
    </button>
  );
}

function PrevArrow(props: any) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black text-white p-3 rounded-full transition-colors"
    >
      <ArrowRight className="w-6 h-6" />
    </button>
  );
}

export function HomePage() {
  const navigate = useNavigate();

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
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] md:h-[700px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1762744827101-404f5cc7d8ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRpYyUyMG1hbGUlMjBneW0lMjB3ZWFyfGVufDF8fHx8MTc3NDI3NTg0NXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6">
              تدرب بقوة، وارتدِ بأناقة
            </h1>
            <p className="text-xl md:text-2xl text-white mb-8">
              اكتشف أفضل ملابس رياضية لتحقيق أهدافك
            </p>
            <button
              onClick={() => navigate("/product/1")}
              className="bg-red-600 text-white px-12 py-4 rounded-lg text-xl font-bold hover:bg-red-700 transition-colors shadow-lg"
            >
              تسوق الآن
            </button>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-extrabold text-center mb-12">الفئات</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              title={category.title}
              image={category.image}
              onClick={() => navigate("/product/1")}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-extrabold text-center mb-12">المنتجات المميزة</h2>
        <Slider {...sliderSettings}>
          {featuredProducts.map((product) => (
            <div key={product.id} className="px-3">
              <ProductCard
                {...product}
                onClick={() => navigate(`/product/${product.id}`)}
              />
            </div>
          ))}
        </Slider>
      </section>

      {/* Best Sellers */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-center mb-12">الأكثر مبيعاً</h2>
          <Slider {...sliderSettings}>
            {bestSellers.map((product) => (
              <div key={product.id} className="px-3">
                <ProductCard
                  {...product}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              </div>
            ))}
          </Slider>
        </div>
      </section>

      {/* Brand Story */}
      <section className="relative h-[500px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1669807164466-10a6584a067e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjB0cmFpbmluZyUyMHdvcmtvdXR8ZW58MXx8fHwxNzc0Mjc1ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Brand Story"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">قصة البراند</h2>
            <p className="text-lg md:text-xl text-white mb-8 leading-relaxed">
              في Invura، نؤمن بأن الملابس الرياضية يجب أن تجمع بين الأداء والأناقة. 
              نحن نقدم أفضل المنتجات المصممة خصيصاً لتلبية احتياجات الرياضيين المحترفين والهواة على حد سواء.
            </p>
            <button
              onClick={() => navigate("/product/1")}
              className="bg-red-600 text-white px-10 py-3 rounded-lg text-lg font-bold hover:bg-red-700 transition-colors shadow-lg"
            >
              تسوق الآن
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
