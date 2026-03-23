import type { Cart, Offer, Order, Product, User } from "./types";

const API_BASE = "/api";

let authToken = localStorage.getItem("invura_token") || "";

function setToken(token: string) {
  authToken = token;
  if (token) {
    localStorage.setItem("invura_token", token);
  } else {
    localStorage.removeItem("invura_token");
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  if (authToken) {
    headers.set("Authorization", `Bearer ${authToken}`);
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "حدث خطأ غير متوقع");
  }
  return data as T;
}

export const api = {
  get token() {
    return authToken;
  },
  setToken,

  health: () => request<{ ok: boolean }>("/health"),

  signup: (payload: { name: string; email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () => request<{ user: User }>("/auth/me"),

  products: (query = "") => request<{ items: Product[] }>(`/products${query}`),
  product: (id: number) => request<{ item: Product }>(`/products/${id}`),
  filters: () => request<{ categories: string[]; sizes: string[]; colors: string[] }>("/meta/filters"),

  cart: () => request<Cart>("/cart"),
  addCartItem: (payload: { productId: number; qty: number; size?: string; color?: string }) =>
    request<Cart>("/cart/items", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  removeCartItem: (itemId: string) =>
    request<Cart>(`/cart/items/${itemId}`, {
      method: "DELETE",
    }),
  clearCart: () =>
    request<{ ok: boolean }>("/cart/clear", {
      method: "POST",
    }),

  checkout: (payload: {
    paymentMethod: "stripe" | "paypal" | "local";
    shippingAddress: string;
  }) =>
    request<{
      order: Order;
      payment: {
        provider: string;
        status: string;
        clientSecret?: string;
        approvalUrl?: string;
      };
      notification: string;
    }>("/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  myOrders: () => request<{ items: Order[] }>("/orders/my"),
  vipOffers: () => request<{ vip: boolean; items: Offer[] }>("/vip/offers"),

  adminOrders: () => request<{ items: Order[] }>("/admin/orders"),
  adminUpdateOrder: (id: string, payload: { orderStatus?: string; paymentStatus?: string }) =>
    request<{ item: Order }>(`/admin/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  adminVipCustomers: () => request<{ items: User[] }>("/admin/vip-customers"),
  adminCreateProduct: (payload: Partial<Product>) =>
    request<{ item: Product }>("/admin/products", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  adminUpdateProduct: (id: number, payload: Partial<Product>) =>
    request<{ item: Product }>(`/admin/products/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }),
  adminDeleteProduct: (id: number) =>
    request<{ ok: boolean }>(`/admin/products/${id}`, {
      method: "DELETE",
    }),

  chatReply: (message: string) =>
    request<{ message: string }>("/chat/reply", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
