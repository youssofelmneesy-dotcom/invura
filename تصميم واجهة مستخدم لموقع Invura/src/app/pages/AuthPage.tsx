import { FormEvent, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export function AuthPage() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function fillDemoAdmin() {
    setIsLogin(true);
    setEmail("admin@invura.com");
    setPassword("admin123");
    setError("");
  }

  function fillDemoUser() {
    setIsLogin(true);
    setEmail("user@invura.com");
    setPassword("user123");
    setError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      navigate("/user");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر إتمام العملية");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-14 max-w-xl">
      <h1 className="text-4xl font-extrabold mb-4 text-center">{isLogin ? "تسجيل الدخول" : "إنشاء حساب"}</h1>
      <p className="text-center text-gray-600 mb-8">لإتمام الطلبات وإدارة حسابك وطلباتك</p>

      <form onSubmit={onSubmit} className="bg-white shadow-lg rounded-xl p-8 space-y-4">
        {!isLogin && (
          <div>
            <label className="font-bold block mb-2">الاسم</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>
        )}
        <div>
          <label className="font-bold block mb-2">البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            required
          />
        </div>
        <div>
          <label className="font-bold block mb-2">كلمة المرور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            required
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          {loading ? "جاري التنفيذ..." : isLogin ? "دخول" : "إنشاء حساب"}
        </button>

        <button
          type="button"
          onClick={() => setIsLogin((v) => !v)}
          className="w-full text-center py-2 text-gray-700 hover:text-black"
        >
          {isLogin ? "ليس لديك حساب؟ أنشئ حساب جديد" : "لديك حساب بالفعل؟ تسجيل الدخول"}
        </button>

        <div className="border rounded-lg p-3 bg-gray-50 space-y-2">
          <p className="text-sm font-bold text-gray-700 text-center">أمثلة جاهزة للتجربة</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="px-3 py-2 rounded-md text-sm border border-black text-black hover:bg-black hover:text-white transition-colors"
            >
              دخول كأدمن تجريبي
            </button>
            <button
              type="button"
              onClick={fillDemoUser}
              className="px-3 py-2 rounded-md text-sm border border-black text-black hover:bg-black hover:text-white transition-colors"
            >
              دخول كمستخدم تجريبي
            </button>
          </div>
          <div className="text-xs text-gray-600 text-center leading-6">
            <div>Admin: admin@invura.com / admin123</div>
            <div>User: user@invura.com / user123</div>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center pt-2 border-t">
          تقدر تضغط على أحد الأزرار بالأعلى وسيتم تعبئة الحقول تلقائيًا
        </div>
      </form>
    </div>
  );
}
