import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Heart, Package, User } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useStore } from "../contexts/StoreContext";
import { api } from "../lib/api";
import type { Order } from "../lib/types";

export function UserPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { wishlist, addToCart } = useStore();
  const initialTab = searchParams.get("tab") === "wishlist" ? "wishlist" : "orders";
  const [activeTab, setActiveTab] = useState<"orders" | "wishlist" | "profile">(initialTab);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.myOrders().then((response) => setOrders(response.items));
    // VIP offers fetching disabled per request while preserving endpoint in API layer.
    // api.vipOffers().then((response) => {
    //   setOffers(response.items);
    //   setVip(response.vip);
    // });
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="bg-gradient-to-l from-black to-gray-800 text-white rounded-xl p-8 mb-8 flex flex-col md:flex-row md:items-center gap-6">
        <div className="w-20 h-20 rounded-full bg-white text-black font-extrabold flex items-center justify-center text-2xl">
          {user?.name?.slice(0, 1) || "؟"}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold mb-2">{user?.name}</h1>
          <p>{user?.email}</p>
          {/* VIP badge disabled per request. */}
          <div className="mt-2">
            <span className="px-3 py-1 rounded-full text-sm font-bold bg-white/20">الحساب الشخصي</span>
          </div>
        </div>
        {/* Outfit Builder disabled per request. */}
        {/*
        <button onClick={() => navigate("/outfit-builder")} className="bg-red-600 px-4 py-3 rounded-lg font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> منشئ الأزياء
        </button>
        */}
      </div>

      <div className="bg-white rounded-xl shadow">
        <div className="grid grid-cols-3 border-b">
          <button className={`py-4 font-bold ${activeTab === "orders" ? "bg-black text-white" : ""}`} onClick={() => setActiveTab("orders")}>
            <Package className="w-4 h-4 inline ml-2" /> الطلبات
          </button>
          <button className={`py-4 font-bold ${activeTab === "wishlist" ? "bg-black text-white" : ""}`} onClick={() => setActiveTab("wishlist")}>
            <Heart className="w-4 h-4 inline ml-2" /> المفضلة
          </button>
          <button className={`py-4 font-bold ${activeTab === "profile" ? "bg-black text-white" : ""}`} onClick={() => setActiveTab("profile")}>
            <User className="w-4 h-4 inline ml-2" /> الملف
          </button>
          {/* VIP tab disabled per request. */}
          {/*
          <button className={`py-4 font-bold ${activeTab === "vip" ? "bg-black text-white" : ""}`} onClick={() => setActiveTab("vip")}>
            <Crown className="w-4 h-4 inline ml-2" /> VIP
          </button>
          */}
        </div>

        <div className="p-6">
          {activeTab === "orders" && (
            <div className="space-y-3">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold">{order.id}</p>
                    <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleString("ar-SA")}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{order.total} ج.م</p>
                    <p className="text-sm">{order.orderStatus}</p>
                  </div>
                </div>
              ))}
              {!orders.length && <p className="text-gray-600">لا توجد طلبات بعد.</p>}
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlist.map((item) => (
                <div key={item.id} className="border rounded-lg p-3">
                  <img src={item.images[0]} alt={item.name} className="w-full h-40 object-cover rounded" loading="lazy" />
                  <h3 className="font-bold mt-3">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.pricing.final} ج.م</p>
                  <button onClick={() => addToCart({ productId: item.id, qty: 1 })} className="w-full bg-black text-white py-2 rounded">
                    أضف إلى السلة
                  </button>
                </div>
              ))}
              {!wishlist.length && <p className="text-gray-600">لا توجد منتجات في المفضلة.</p>}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="space-y-3">
              <div className="border rounded-lg p-4"><b>الاسم:</b> {user?.name}</div>
              <div className="border rounded-lg p-4"><b>البريد:</b> {user?.email}</div>
              <div className="border rounded-lg p-4"><b>الدور:</b> {user?.role}</div>
            </div>
          )}

          {/* VIP section disabled per request. */}
          {/*
          {activeTab === "vip" && (
            <div className="space-y-4">
              <p className="font-bold">حالة العضوية: {vip ? "VIP" : "عادية"}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offers.map((offer) => (
                  <div key={offer.id} className="border-2 border-yellow-400 rounded-lg p-4">
                    <h3 className="font-bold mb-2 flex items-center gap-2">
                      <Gift className="w-4 h-4" /> {offer.title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-1">{offer.description}</p>
                    <p className="text-xs text-gray-500">خصم: {offer.discountPercent}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          */}
        </div>
      </div>
    </div>
  );
}
