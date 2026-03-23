import { Link, useNavigate } from "react-router";
import { useStore } from "../contexts/StoreContext";
import { useAuth } from "../contexts/AuthContext";

export function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, removeCartItem } = useStore();

  const items = cart?.items || [];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-8">سلة التسوق</h1>

      {!items.length && (
        <div className="bg-white p-10 rounded-xl shadow text-center space-y-4">
          <p className="text-gray-600">السلة فارغة حالياً.</p>
          <Link to="/" className="inline-block bg-black text-white px-6 py-3 rounded-lg">
            العودة للتسوق
          </Link>
        </div>
      )}

      {!!items.length && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow p-4 flex gap-4">
                <img src={item.product.images[0]} alt={item.product.name} className="w-24 h-24 rounded-lg object-cover" loading="lazy" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{item.product.name}</h3>
                  <p className="text-gray-600 text-sm">المقاس: {item.size || "-"} | اللون: {item.color || "-"}</p>
                  <p className="font-bold mt-1">{item.product.pricing.final} ج.م × {item.qty}</p>
                </div>
                <div className="text-left">
                  <p className="font-extrabold">{item.lineTotal} ج.م</p>
                  <button onClick={() => removeCartItem(item.id)} className="text-red-600 mt-2 text-sm">
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-4 bg-white rounded-xl shadow p-6 h-fit space-y-4">
            <h2 className="text-2xl font-extrabold">ملخص الطلب</h2>
            <div className="flex justify-between">
              <span>الإجمالي</span>
              <span className="font-extrabold">{cart?.subtotal || 0} ج.م</span>
            </div>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  navigate("/auth");
                  return;
                }
                navigate("/checkout");
              }}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700"
            >
              إتمام الشراء
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
