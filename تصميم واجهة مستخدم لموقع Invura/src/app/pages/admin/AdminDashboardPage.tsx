import { FormEvent, useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Order, Product, User } from "../../lib/types";

export function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [vipCustomers, setVipCustomers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProductName, setNewProductName] = useState("");

  async function loadData() {
    const [ordersResponse, vipResponse, productsResponse] = await Promise.all([
      api.adminOrders(),
      api.adminVipCustomers(),
      api.products(),
    ]);
    setOrders(ordersResponse.items);
    setVipCustomers(vipResponse.items);
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
    if (!newProductName.trim()) {
      return;
    }
    await api.adminCreateProduct({
      name: newProductName,
      description: "منتج جديد من لوحة الإدارة",
      category: "General",
      price: 99,
      offerPercent: 0,
      stock: 25,
      images: ["https://images.unsplash.com/photo-1669807164466-10a6584a067e?auto=format&fit=crop&w=800&q=80"],
      sizes: ["M", "L"],
      colors: ["أسود"],
    });
    setNewProductName("");
    loadData();
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
        <form onSubmit={createProduct} className="flex gap-3">
          <input
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2"
            placeholder="اسم المنتج"
          />
          <button className="bg-black text-white px-5 rounded-lg">إضافة</button>
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

      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4">المنتجات</h2>
        <div className="space-y-2">
          {products.map((product) => (
            <div key={product.id} className="border rounded-lg p-3 flex justify-between items-center">
              <div>
                <p className="font-bold">{product.name}</p>
                <p className="text-sm text-gray-600">{product.pricing.final} ر.س</p>
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
