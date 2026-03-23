import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ProductCard } from "../components/ProductCard";
import { api } from "../lib/api";
import type { Product } from "../lib/types";

export function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .products()
      .then((response) => setProducts(response.items))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-3">كل المنتجات</h1>
      <p className="text-gray-600 mb-8">تصفح جميع منتجات Invura المتاحة الآن.</p>

      {loading && <p className="text-gray-600">جاري تحميل المنتجات...</p>}

      {!loading && !products.length && (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-600">
          لا توجد منتجات متاحة حاليًا.
        </div>
      )}

      {!!products.length && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onClick={() => navigate(`/product/${product.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}
