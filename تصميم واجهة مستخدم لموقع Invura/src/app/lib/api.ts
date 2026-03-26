import type { Cart, Offer, Order, Product, User } from "./types";

const API_BASE = "/api";
const USE_FRONTEND_ONLY =
  import.meta.env.VITE_FRONTEND_ONLY === "true" ||
  (typeof window !== "undefined" && window.location.hostname.endsWith("github.io"));

type MockUserRecord = User & {
  password: string;
};

type MockCartRecord = {
  userId: number;
  items: Array<{
    id: string;
    productId: number;
    qty: number;
    size: string | null;
    color: string | null;
  }>;
};

type MockDb = {
  users: MockUserRecord[];
  products: Product[];
  carts: MockCartRecord[];
  orders: Order[];
  offers: Offer[];
};

const MOCK_DB_KEY = "invura_mock_db";
const MOCK_TOKEN_PREFIX = "mock-token-";

let authToken = localStorage.getItem("invura_token") || "";

const mockProducts: Product[] = [
  {
    id: 2,
    name: "بنطال رياضي مرن",
    description: "بنطال مريح للجري والتمارين اليومية.",
    category: "Gym Wear",
    price: 199,
    offerPercent: 0,
    isVipOnly: false,
    featured: true,
    bestSeller: false,
    stock: 70,
    sizes: ["M", "L", "XL"],
    colors: ["أسود", "كحلي"],
    images: [
      "https://images.unsplash.com/photo-1669807164466-10a6584a067e?auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1632077804406-188472f1a810?auto=format&fit=crop&w=1080&q=80",
    ],
    pricing: { base: 199, discountPercent: 0, final: 199 },
  },
  {
    id: 3,
    name: "حذاء جري سريع",
    description: "خفيف الوزن مع دعم ممتاز للكاحل.",
    category: "Running",
    price: 299,
    offerPercent: 15,
    isVipOnly: false,
    featured: false,
    bestSeller: true,
    stock: 40,
    sizes: ["40", "41", "42", "43", "44"],
    colors: ["أبيض", "أسود", "أحمر"],
    images: [
      "https://images.unsplash.com/photo-1765914448113-ebf0ce8cb918?auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1765914448113-ebf0ce8cb918?auto=format&fit=crop&w=900&q=80",
    ],
    pricing: { base: 299, discountPercent: 15, final: 254 },
  },
  {
    id: 4,
    name: "طقم جيم VIP",
    description: "طقم حصري يشمل تيشيرت وبنطال.",
    category: "Gym Wear",
    price: 499,
    offerPercent: 20,
    isVipOnly: false,
    featured: true,
    bestSeller: true,
    stock: 20,
    sizes: ["M", "L", "XL"],
    colors: ["أسود", "ذهبي"],
    images: [
      "https://images.unsplash.com/photo-1632077804406-188472f1a810?auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1762744827101-404f5cc7d8ab?auto=format&fit=crop&w=1080&q=80",
    ],
    pricing: { base: 499, discountPercent: 20, final: 399 },
  },
  {
    id: 5,
    name: "حقيبة رياضية فاخرة",
    description: "حقيبة متعددة الجيوب مقاومة للماء.",
    category: "Accessories",
    price: 279,
    offerPercent: 5,
    isVipOnly: false,
    featured: false,
    bestSeller: true,
    stock: 60,
    sizes: ["One Size"],
    colors: ["أسود", "رمادي"],
    images: [
      "https://images.unsplash.com/photo-1761946356399-8335dbdce394?auto=format&fit=crop&w=1080&q=80",
    ],
    pricing: { base: 279, discountPercent: 5, final: 265 },
  },
];

function defaultMockDb(): MockDb {
  return {
    users: [
      {
        id: 1,
        name: "مدير Invura",
        email: "admin@invura.com",
        password: "admin123",
        role: "admin",
        vip: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: "عميل تجريبي",
        email: "user@invura.com",
        password: "user123",
        role: "user",
        vip: false,
        createdAt: new Date().toISOString(),
      },
    ],
    products: [...mockProducts],
    carts: [],
    orders: [],
    offers: [
      {
        id: "offer-summer-10",
        title: "عرض خاص",
        description: "خصم على منتجات مختارة لفترة محدودة.",
        type: "seasonal",
        discountPercent: 10,
        active: true,
      },
    ],
  };
}

function getMockDb(): MockDb {
  const raw = localStorage.getItem(MOCK_DB_KEY);
  if (!raw) {
    const seeded = defaultMockDb();
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    return JSON.parse(raw) as MockDb;
  } catch {
    const seeded = defaultMockDb();
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function setMockDb(db: MockDb) {
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db));
}

function toSafeUser(user: MockUserRecord): User {
  const { password: _password, ...safe } = user;
  return safe;
}

function currentUserIdFromToken() {
  if (!authToken.startsWith(MOCK_TOKEN_PREFIX)) {
    return null;
  }
  const id = Number(authToken.replace(MOCK_TOKEN_PREFIX, ""));
  return Number.isFinite(id) ? id : null;
}

function withPricing(product: Product): Product {
  const discountPercent = Number(product.offerPercent || 0);
  const base = Number(product.price);
  const final = Math.round(base * (1 - discountPercent / 100));
  return {
    ...product,
    pricing: {
      base,
      discountPercent,
      final,
    },
  };
}

function getOrCreateCart(db: MockDb, userId: number) {
  let cart = db.carts.find((c) => c.userId === userId);
  if (!cart) {
    cart = { userId, items: [] };
    db.carts.push(cart);
  }
  return cart;
}

function summarizeCart(db: MockDb, userId: number): Cart {
  const cart = getOrCreateCart(db, userId);
  const items = cart.items
    .map((item) => {
      const product = db.products.find((p) => p.id === item.productId);
      if (!product) {
        return null;
      }
      const priced = withPricing(product);
      const lineTotal = priced.pricing.final * item.qty;
      return {
        ...item,
        product: priced,
        lineTotal,
      };
    })
    .filter(Boolean) as Cart["items"];

  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return { userId, items, subtotal };
}

function nextId(items: Array<{ id: number }>) {
  if (!items.length) {
    return 1;
  }
  return Math.max(...items.map((item) => item.id)) + 1;
}

function ensureAuthUser(db: MockDb): MockUserRecord {
  const userId = currentUserIdFromToken();
  if (!userId) {
    throw new Error("غير مصرح");
  }
  const user = db.users.find((u) => u.id === userId);
  if (!user) {
    throw new Error("جلسة غير صالحة");
  }
  return user;
}

function filterProducts(products: Product[], query = "") {
  const params = new URLSearchParams(query.replace(/^\?/, ""));
  let next = [...products];

  const q = params.get("q");
  const category = params.get("category");
  const size = params.get("size");
  const color = params.get("color");
  const maxPrice = params.get("maxPrice");
  const featured = params.get("featured");
  const bestSeller = params.get("bestSeller");
  const offersOnly = params.get("offersOnly");

  if (q) {
    const needle = q.toLowerCase();
    next = next.filter(
      (product) =>
        product.name.toLowerCase().includes(needle) ||
        product.description.toLowerCase().includes(needle),
    );
  }
  if (category) {
    next = next.filter((product) => product.category === category);
  }
  if (size) {
    next = next.filter((product) => product.sizes.includes(size));
  }
  if (color) {
    next = next.filter((product) => product.colors.includes(color));
  }
  if (maxPrice) {
    const max = Number(maxPrice);
    next = next.filter((product) => withPricing(product).pricing.final <= max);
  }
  if (featured === "1") {
    next = next.filter((product) => product.featured);
  }
  if (bestSeller === "1") {
    next = next.filter((product) => product.bestSeller);
  }
  if (offersOnly === "1") {
    next = next.filter((product) => Number(product.offerPercent) > 0);
  }

  return next.map(withPricing);
}

async function mockRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const method = (options.method || "GET").toUpperCase();
  const body = options.body ? JSON.parse(String(options.body)) : {};
  const db = getMockDb();

  if (path === "/health" && method === "GET") {
    return { ok: true } as T;
  }

  if (path === "/auth/login" && method === "POST") {
    const user = db.users.find(
      (u) =>
        u.email.toLowerCase() === String(body.email || "").toLowerCase() &&
        u.password === String(body.password || ""),
    );
    if (!user) {
      throw new Error("بيانات الدخول غير صحيحة");
    }
    return {
      token: `${MOCK_TOKEN_PREFIX}${user.id}`,
      user: toSafeUser(user),
    } as T;
  }

  if (path === "/auth/signup" && method === "POST") {
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "").trim();
    if (!name || !email || !password) {
      throw new Error("البيانات مطلوبة");
    }
    if (db.users.some((user) => user.email.toLowerCase() === email)) {
      throw new Error("البريد مستخدم بالفعل");
    }

    const user: MockUserRecord = {
      id: nextId(db.users),
      name,
      email,
      password,
      role: "user",
      vip: false,
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    setMockDb(db);

    return {
      token: `${MOCK_TOKEN_PREFIX}${user.id}`,
      user: toSafeUser(user),
    } as T;
  }

  if (path === "/auth/me" && method === "GET") {
    const user = ensureAuthUser(db);
    return { user: toSafeUser(user) } as T;
  }

  if (path.startsWith("/products") && method === "GET") {
    if (path === "/products") {
      return { items: filterProducts(db.products) } as T;
    }

    if (path.startsWith("/products?")) {
      return { items: filterProducts(db.products, path.slice("/products".length)) } as T;
    }

    const id = Number(path.split("/").pop());
    const product = db.products.find((item) => item.id === id);
    if (!product) {
      throw new Error("المنتج غير موجود");
    }
    return { item: withPricing(product) } as T;
  }

  if (path === "/meta/filters" && method === "GET") {
    return {
      categories: [...new Set(db.products.map((product) => product.category))],
      sizes: [...new Set(db.products.flatMap((product) => product.sizes))],
      colors: [...new Set(db.products.flatMap((product) => product.colors))],
    } as T;
  }

  if (path === "/cart" && method === "GET") {
    const user = ensureAuthUser(db);
    return summarizeCart(db, user.id) as T;
  }

  if (path === "/cart/items" && method === "POST") {
    const user = ensureAuthUser(db);
    const cart = getOrCreateCart(db, user.id);
    const productId = Number(body.productId);
    const qty = Number(body.qty || 1);

    if (!productId || qty < 1) {
      throw new Error("بيانات المنتج غير صالحة");
    }

    const existing = cart.items.find(
      (item) =>
        item.productId === productId &&
        item.size === (body.size || null) &&
        item.color === (body.color || null),
    );

    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({
        id: `cart_item_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        productId,
        qty,
        size: body.size || null,
        color: body.color || null,
      });
    }
    setMockDb(db);
    return summarizeCart(db, user.id) as T;
  }

  if (path.startsWith("/cart/items/") && method === "DELETE") {
    const user = ensureAuthUser(db);
    const itemId = path.replace("/cart/items/", "");
    const cart = getOrCreateCart(db, user.id);
    cart.items = cart.items.filter((item) => item.id !== itemId);
    setMockDb(db);
    return summarizeCart(db, user.id) as T;
  }

  if (path === "/cart/clear" && method === "POST") {
    const user = ensureAuthUser(db);
    const cart = getOrCreateCart(db, user.id);
    cart.items = [];
    setMockDb(db);
    return { ok: true } as T;
  }

  if (path === "/checkout" && method === "POST") {
    const user = ensureAuthUser(db);
    const cart = summarizeCart(db, user.id);
    if (!cart.items.length) {
      throw new Error("السلة فارغة");
    }

    const order: Order = {
      id: `order_${Date.now()}`,
      userId: user.id,
      subtotal: cart.subtotal,
      total: cart.subtotal,
      paymentMethod: body.paymentMethod || "local",
      paymentStatus: "created",
      orderStatus: "processing",
      createdAt: new Date().toISOString(),
    };

    db.orders.unshift(order);
    const userCart = getOrCreateCart(db, user.id);
    userCart.items = [];
    setMockDb(db);

    return {
      order,
      payment: {
        provider: order.paymentMethod,
        status: "created",
      },
      notification: "تم إنشاء الطلب بنجاح",
    } as T;
  }

  if (path === "/orders/my" && method === "GET") {
    const user = ensureAuthUser(db);
    return {
      items: db.orders.filter((order) => order.userId === user.id),
    } as T;
  }

  if (path === "/vip/offers" && method === "GET") {
    const user = ensureAuthUser(db);
    return {
      vip: user.vip,
      items: db.offers,
    } as T;
  }

  if (path === "/admin/orders" && method === "GET") {
    return { items: db.orders } as T;
  }

  if (path.startsWith("/admin/orders/") && method === "PATCH") {
    const id = path.replace("/admin/orders/", "");
    const order = db.orders.find((item) => item.id === id);
    if (!order) {
      throw new Error("الطلب غير موجود");
    }
    if (body.orderStatus) {
      order.orderStatus = String(body.orderStatus);
    }
    if (body.paymentStatus) {
      order.paymentStatus = String(body.paymentStatus);
    }
    setMockDb(db);
    return { item: order } as T;
  }

  if (path === "/admin/vip-customers" && method === "GET") {
    return {
      items: db.users.filter((user) => user.vip).map(toSafeUser),
    } as T;
  }

  if (path === "/admin/products" && method === "POST") {
    const product: Product = withPricing({
      id: nextId(db.products),
      name: String(body.name || "منتج جديد"),
      description: String(body.description || "منتج جديد"),
      category: String(body.category || "Gym Wear"),
      price: Number(body.price || 199),
      offerPercent: Number(body.offerPercent || 0),
      isVipOnly: !!body.isVipOnly,
      featured: !!body.featured,
      bestSeller: !!body.bestSeller,
      stock: Number(body.stock || 10),
      sizes: Array.isArray(body.sizes) ? body.sizes : ["M"],
      colors: Array.isArray(body.colors) ? body.colors : ["أسود"],
      images: Array.isArray(body.images) && body.images.length ? body.images : [
        "https://images.unsplash.com/photo-1669807164466-10a6584a067e?auto=format&fit=crop&w=800&q=80",
      ],
      pricing: { base: 0, discountPercent: 0, final: 0 },
    });
    db.products.push(product);
    setMockDb(db);
    return { item: product } as T;
  }

  if (path.startsWith("/admin/products/") && method === "PATCH") {
    const id = Number(path.replace("/admin/products/", ""));
    const product = db.products.find((item) => item.id === id);
    if (!product) {
      throw new Error("المنتج غير موجود");
    }
    Object.assign(product, body);
    const next = withPricing(product);
    Object.assign(product, next);
    setMockDb(db);
    return { item: product } as T;
  }

  if (path.startsWith("/admin/products/") && method === "DELETE") {
    const id = Number(path.replace("/admin/products/", ""));
    db.products = db.products.filter((product) => product.id !== id);
    setMockDb(db);
    return { ok: true } as T;
  }

  if (path === "/chat/reply" && method === "POST") {
    const message = String(body.message || "");
    return {
      message: message
        ? `وصلت رسالتك: "${message}". فريق Invura جاهز للمساعدة.`
        : "مرحبا بك في Invura!",
    } as T;
  }

  throw new Error("هذا الطلب غير مدعوم في وضع Frontend-only");
}

function setToken(token: string) {
  authToken = token;
  if (token) {
    localStorage.setItem("invura_token", token);
  } else {
    localStorage.removeItem("invura_token");
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (USE_FRONTEND_ONLY) {
    return mockRequest<T>(path, options);
  }

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
