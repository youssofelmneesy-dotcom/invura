import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { api } from "../lib/api";
import { useStore } from "../contexts/StoreContext";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, refreshCart } = useStore();
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal" | "local">("stripe");
  const [shippingAddress, setShippingAddress] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.checkout({ paymentMethod, shippingAddress });
      setMessage(
        `تم إنشاء الطلب بنجاح. طريقة الدفع: ${response.payment.provider}. الحالة: ${response.payment.status}`,
      );
      await refreshCart();
      setTimeout(() => navigate("/user"), 1200);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "فشل الدفع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h1 className="text-4xl font-extrabold mb-4">الدفع وإنهاء الطلب</h1>
      <p className="text-gray-600 mb-8">يدعم Stripe وPayPal وطرق دفع محلية.</p>

      <form onSubmit={onSubmit} className="bg-white rounded-xl shadow p-8 space-y-6">
        <div>
          <h2 className="font-bold mb-3">طريقة الدفع</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { value: "stripe", label: "Stripe" },
              { value: "paypal", label: "PayPal" },
              { value: "local", label: "دفع محلي" },
            ].map((method) => (
              <label key={method.value} className="border rounded-lg p-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={paymentMethod === method.value}
                  onChange={() => setPaymentMethod(method.value as "stripe" | "paypal" | "local")}
                  className="ml-2"
                />
                {method.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-3">عنوان الشحن</h2>
          <textarea
            required
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            rows={4}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="المدينة، الحي، الشارع، رقم المبنى"
          />
        </div>

        <div className="flex justify-between font-bold text-xl">
          <span>الإجمالي</span>
          <span>{cart?.subtotal || 0} ر.س</span>
        </div>

        {message && <div className="bg-gray-100 rounded-lg p-3 text-sm">{message}</div>}

        <button disabled={loading} className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-red-600 disabled:opacity-60">
          {loading ? "جاري معالجة الدفع..." : "تأكيد الطلب"}
        </button>
      </form>
    </div>
  );
}
