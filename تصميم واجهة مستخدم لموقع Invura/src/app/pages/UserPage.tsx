import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Heart,
  Package,
  Crown,
  Gift,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

const orderHistory = [
  {
    id: 1,
    orderNumber: "ORD-2024-001",
    date: "2024-03-15",
    total: 499,
    status: "تم التوصيل",
    items: 3,
  },
  {
    id: 2,
    orderNumber: "ORD-2024-002",
    date: "2024-03-10",
    total: 299,
    status: "قيد التوصيل",
    items: 2,
  },
  {
    id: 3,
    orderNumber: "ORD-2024-003",
    date: "2024-03-05",
    total: 699,
    status: "تم التوصيل",
    items: 4,
  },
];

const wishlistItems = [
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
];

const vipOffers = [
  {
    id: 1,
    title: "خصم 20% على جميع المنتجات",
    description: "عرض حصري لأعضاء VIP",
    validUntil: "2024-04-01",
  },
  {
    id: 2,
    title: "شحن مجاني على جميع الطلبات",
    description: "لا حد أدنى للطلب",
    validUntil: "دائم",
  },
  {
    id: 3,
    title: "الوصول المبكر للمنتجات الجديدة",
    description: "تسوق قبل الجميع",
    validUntil: "دائم",
  },
];

export function UserPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "profile" | "vip">("orders");

  return (
    <div className="container mx-auto px-4 py-12">
      {/* User Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="bg-white text-black w-24 h-24 rounded-full flex items-center justify-center text-4xl font-extrabold">
            أ.م
          </div>
          <div className="text-center md:text-right flex-1">
            <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
              <h1 className="text-3xl font-extrabold">أحمد محمد</h1>
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-lg flex items-center gap-2 justify-center md:justify-start">
              <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm">
                عضو VIP
              </span>
            </p>
            <p className="text-gray-300 mt-2">عضو منذ مارس 2023</p>
          </div>
          <button
            onClick={() => navigate("/outfit-builder")}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>منشئ الأزياء</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 px-6 py-4 font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "orders"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Package className="w-5 h-5" />
            <span>الطلبات</span>
          </button>
          <button
            onClick={() => setActiveTab("wishlist")}
            className={`flex-1 px-6 py-4 font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "wishlist"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Heart className="w-5 h-5" />
            <span>المفضلة</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 px-6 py-4 font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "profile"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <User className="w-5 h-5" />
            <span>الملف الشخصي</span>
          </button>
          <button
            onClick={() => setActiveTab("vip")}
            className={`flex-1 px-6 py-4 font-bold flex items-center justify-center gap-2 transition-colors ${
              activeTab === "vip"
                ? "bg-black text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Crown className="w-5 h-5" />
            <span>VIP</span>
          </button>
        </div>

        <div className="p-8">
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-extrabold mb-6">سجل الطلبات</h2>
              {orderHistory.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2">طلب رقم: {order.orderNumber}</h3>
                      <p className="text-gray-600 mb-1">التاريخ: {order.date}</p>
                      <p className="text-gray-600">عدد المنتجات: {order.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-extrabold mb-2">{order.total} ر.س</p>
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                          order.status === "تم التوصيل"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-extrabold mb-6">المنتجات المفضلة</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2">{item.name}</h3>
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-extrabold">{item.price} ر.س</span>
                        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                          أضف للسلة
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-extrabold mb-6">الملف الشخصي</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <User className="w-6 h-6 text-gray-600 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">الاسم</h3>
                    <p className="text-gray-700">أحمد محمد العلي</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-6 h-6 text-gray-600 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">البريد الإلكتروني</h3>
                    <p className="text-gray-700">ahmed.mohamed@example.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <Phone className="w-6 h-6 text-gray-600 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">رقم الهاتف</h3>
                    <p className="text-gray-700">+966 50 123 4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-6 h-6 text-gray-600 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">العنوان</h3>
                    <p className="text-gray-700">
                      الرياض، حي النخيل، شارع الملك فهد<br />
                      الرمز البريدي: 12345
                    </p>
                  </div>
                </div>
              </div>
              <button className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors">
                تعديل المعلومات
              </button>
            </motion.div>
          )}

          {/* VIP Tab */}
          {activeTab === "vip" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black rounded-lg p-8 mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <Crown className="w-12 h-12" />
                  <div>
                    <h2 className="text-3xl font-extrabold">عضوية VIP</h2>
                    <p className="text-lg">استمتع بمزايا حصرية</p>
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-4 mt-4">
                  <p className="text-sm mb-2">مستوى العضوية</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-black/30 rounded-full h-3">
                      <div className="bg-black rounded-full h-3 w-3/4"></div>
                    </div>
                    <span className="font-bold">75%</span>
                  </div>
                  <p className="text-sm mt-2">
                    باقي 500 ر.س للوصول إلى المستوى الذهبي
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-extrabold mb-4">العروض الحصرية</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vipOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-white border-2 border-yellow-400 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <Gift className="w-8 h-8 text-yellow-600" />
                      <div>
                        <h4 className="font-bold mb-2">{offer.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{offer.description}</p>
                        <p className="text-xs text-gray-500">ساري حتى: {offer.validUntil}</p>
                      </div>
                    </div>
                    <button className="w-full bg-yellow-400 text-black py-2 rounded-lg font-bold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2">
                      <span>استخدم العرض</span>
                      <ArrowLeft className="w-4 h-4 rotate-180" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
