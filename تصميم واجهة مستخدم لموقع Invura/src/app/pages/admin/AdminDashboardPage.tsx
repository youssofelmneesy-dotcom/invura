import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Order, Product } from "../../lib/types";

const CATEGORY_SIZES: Record<string, string[]> = {
  "Gym Wear": ["S", "M", "L", "XL"],
  Running: ["40", "41", "42", "43", "44"],
  Accessories: ["One Size"],
};

const CATEGORY_COLORS: Record<string, string[]> = {
  "Gym Wear": ["أسود", "أبيض", "رمادي", "كحلي"],
  Running: ["أسود", "أبيض", "أحمر", "أزرق"],
  Accessories: ["أسود", "رمادي", "كحلي"],
};

export function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState("");
  const [newProductPrice, setNewProductPrice] = useState("199");
  const [newProductCategory, setNewProductCategory] = useState("Gym Wear");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["M", "L"]);
  const [selectedColors, setSelectedColors] = useState<string[]>(["أسود"]);
  const [newProductImageUrl, setNewProductImageUrl] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  async function loadData() {
    const [ordersResponse, productsResponse] = await Promise.all([
      api.adminOrders(),
      api.products(),
    ]);
    setOrders(ordersResponse.items);
    setProducts(productsResponse.items);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function updateOrder(id: string, status: string) {
    await api.adminUpdateOrder(id, { orderStatus: status });
    loadData();
  }

  async function createProduct(e: FormEvent) {
    e.preventDefault();
    if (!newProductName.trim() || Number(newProductPrice) <= 0) {
      return;
    }

    const images = [
      ...uploadedImages,
      ...(newProductImageUrl.trim() ? [newProductImageUrl.trim()] : []),
    ];

    await api.adminCreateProduct({
      name: newProductName,
      description: "منتج جديد من لوحة الإدارة",
      category: newProductCategory,
      price: Number(newProductPrice),
      offerPercent: 0,
      stock: 25,
      // Admin can upload image files or provide a direct image URL.
      images: images.length
        ? images
        : ["https://images.unsplash.com/photo-1669807164466-10a6584a067e?auto=format&fit=crop&w=800&q=80"],
      // Sizes and colors are category-aware based on admin selection.
      sizes: selectedSizes.length ? selectedSizes : [CATEGORY_SIZES[newProductCategory][0]],
      colors: selectedColors.length ? selectedColors : [CATEGORY_COLORS[newProductCategory][0]],
    });
    setNewProductName("");
    setNewProductPrice("199");
    setNewProductCategory("Gym Wear");
    setSelectedSizes(["M", "L"]);
    setSelectedColors(["أسود"]);
    setNewProductImageUrl("");
    setUploadedImages([]);
    loadData();
  }

  function onCategoryChange(category: string) {
    setNewProductCategory(category);
    // Keep defaults aligned with the selected category to avoid invalid combinations.
    setSelectedSizes(CATEGORY_SIZES[category]?.slice(0, 2) || []);
    setSelectedColors(CATEGORY_COLORS[category]?.slice(0, 1) || []);
  }

  function toggleItem(value: string, list: string[], setter: (items: string[]) => void) {
    if (list.includes(value)) {
      setter(list.filter((item) => item !== value));
      return;
    }
    setter([...list, value]);
  }

  function onUploadImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) {
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        if (typeof imageData === "string") {
          setUploadedImages((prev) => [...prev, imageData]);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  async function deleteProduct(id: number) {
    await api.adminDeleteProduct(id);
    loadData();
  }

  return (
    <div className="container mx-auto px-4 py-10 space-y-8">
      <h1 className="text-4xl font-extrabold">لوحة تحكم الإدارة</h1>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">إضافة منتج</h2>
        <form onSubmit={createProduct} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            className="border rounded-lg px-4 py-2"
            placeholder="اسم المنتج"
            required
          />
          <input
            type="number"
            min={1}
            value={newProductPrice}
            onChange={(e) => setNewProductPrice(e.target.value)}
            className="border rounded-lg px-4 py-2"
            placeholder="السعر (ج.م)"
            required
          />
          <select
            value={newProductCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="Gym Wear">Gym Wear</option>
            <option value="Running">Running</option>
            <option value="Accessories">Accessories</option>
          </select>

          <div className="border rounded-lg px-4 py-3 md:col-span-2">
            <p className="text-sm font-bold mb-2">المقاسات حسب الفئة</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_SIZES[newProductCategory].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleItem(size, selectedSizes, setSelectedSizes)}
                  className={`px-3 py-1 rounded border text-sm ${selectedSizes.includes(size) ? "bg-black text-white" : "bg-white"}`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="border rounded-lg px-4 py-3 md:col-span-2">
            <p className="text-sm font-bold mb-2">الألوان حسب الفئة</p>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_COLORS[newProductCategory].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => toggleItem(color, selectedColors, setSelectedColors)}
                  className={`px-3 py-1 rounded border text-sm ${selectedColors.includes(color) ? "bg-black text-white" : "bg-white"}`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <input
            value={newProductImageUrl}
            onChange={(e) => setNewProductImageUrl(e.target.value)}
            className="border rounded-lg px-4 py-2"
            placeholder="رابط صورة المنتج (اختياري)"
          />
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={onUploadImages}
            className="border rounded-lg px-4 py-2 md:col-span-2"
          />
          {!!uploadedImages.length && (
            <p className="text-sm text-gray-600 md:col-span-2">تم رفع {uploadedImages.length} صورة</p>
          )}
          <button className="bg-black text-white px-5 py-2 rounded-lg md:col-span-2">إضافة المنتج</button>
        </form>
      </section>

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">إدارة الطلبات</h2>
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div>
                <p className="font-bold">{order.id}</p>
                <p className="text-sm text-gray-600">{order.orderStatus} - {order.paymentStatus}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateOrder(order.id, "shipped")} className="px-3 py-1 bg-blue-600 text-white rounded">شحن</button>
                <button onClick={() => updateOrder(order.id, "delivered")} className="px-3 py-1 bg-green-600 text-white rounded">تسليم</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VIP customers panel disabled per request. */}
      {/*
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">عملاء VIP</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {vipCustomers.map((user) => (
            <div key={user.id} className="border rounded-lg p-3">
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          ))}
        </div>
      </section>
      */}

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">المنتجات</h2>
        <div className="space-y-2">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-bold">{product.name}</p>
                <p className="text-sm text-gray-600">{product.pricing.final} ج.م</p>
              </div>
              <button onClick={() => deleteProduct(product.id)} className="text-red-600">
                حذف
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
