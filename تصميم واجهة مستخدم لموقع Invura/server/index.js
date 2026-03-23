import http from "node:http";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { WebSocketServer } from "ws";
import Stripe from "stripe";
import dotenv from "dotenv";
import { nextNumericId, randomId, readDb, withDb } from "./db.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.API_PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET || "invura_dev_secret";
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "2mb" }));

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    vip: !!user.vip,
    createdAt: user.createdAt,
  };
}

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "غير مصرح" });
  }

  try {
    const token = header.replace("Bearer ", "");
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ error: "جلسة غير صالحة" });
  }
}

function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "يتطلب صلاحية مدير" });
  }
  return next();
}

function productPriceForUser(product, user) {
  const base = Number(product.price);
  const offer = Number(product.offerPercent || 0);
  // VIP discount disabled per request.
  // const vipExtra = user?.vip ? 20 : 0;
  const vipExtra = 0;
  // VIP-only product restriction disabled per request to ensure all products appear.
  // const vipAllowed = product.isVipOnly ? !!user?.vip : true;
  const vipAllowed = true;
  if (!vipAllowed) {
    return null;
  }
  const discountPercent = Math.max(offer, vipExtra);
  return {
    base,
    discountPercent,
    final: Math.round(base * (1 - discountPercent / 100)),
  };
}

function attachComputedProduct(product, user) {
  const pricing = productPriceForUser(product, user);
  if (!pricing) {
    return null;
  }
  return {
    ...product,
    pricing,
  };
}

function getCurrentUserEntity(decodedUser, db) {
  if (!decodedUser) {
    return null;
  }
  return db.users.find((u) => u.id === decodedUser.id) || null;
}

function getCart(db, userId) {
  let cart = db.carts.find((c) => c.userId === userId);
  if (!cart) {
    cart = { userId, items: [] };
    db.carts.push(cart);
  }
  return cart;
}

function summarizeCart(db, userEntity) {
  const cart = getCart(db, userEntity.id);
  const detailed = [];
  let subtotal = 0;

  for (const item of cart.items) {
    const product = db.products.find((p) => p.id === item.productId);
    if (!product) {
      continue;
    }

    const computed = attachComputedProduct(product, userEntity);
    if (!computed) {
      continue;
    }

    const lineTotal = computed.pricing.final * item.qty;
    subtotal += lineTotal;

    detailed.push({
      ...item,
      product: computed,
      lineTotal,
    });
  }

  return {
    userId: userEntity.id,
    items: detailed,
    subtotal,
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "Invura API" });
});

app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "البيانات مطلوبة" });
  }

  const db = readDb();
  if (db.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    return res.status(409).json({ error: "البريد مستخدم بالفعل" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    id: nextNumericId(db.users),
    name,
    email: String(email).toLowerCase(),
    passwordHash,
    role: "user",
    vip: false,
    createdAt: new Date().toISOString(),
  };

  db.users.push(user);
  withDb((mutable) => Object.assign(mutable, db));

  const payload = sanitizeUser(user);
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return res.status(201).json({ token, user: payload });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  const db = readDb();
  const user = db.users.find((u) => u.email === String(email).toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
  }

  const ok = await bcrypt.compare(password || "", user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "بيانات الدخول غير صحيحة" });
  }

  const payload = sanitizeUser(user);
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return res.json({ token, user: payload });
});

app.get("/api/auth/me", auth, (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: "المستخدم غير موجود" });
  }
  return res.json({ user: sanitizeUser(user) });
});

app.get("/api/products", (req, res) => {
  const db = readDb();
  const currentUser = getCurrentUserEntity(req.user, db);
  const {
    q,
    category,
    size,
    color,
    maxPrice,
    featured,
    bestSeller,
    vipOnly,
    offersOnly,
  } = req.query;

  let products = db.products
    .map((p) => attachComputedProduct(p, currentUser))
    .filter(Boolean);

  if (q) {
    const needle = String(q).toLowerCase();
    products = products.filter((p) =>
      p.name.toLowerCase().includes(needle) || p.description.toLowerCase().includes(needle),
    );
  }

  if (category) {
    products = products.filter((p) => p.category === category);
  }
  if (size) {
    products = products.filter((p) => p.sizes.includes(size));
  }
  if (color) {
    products = products.filter((p) => p.colors.includes(color));
  }
  if (maxPrice) {
    const max = Number(maxPrice);
    products = products.filter((p) => p.pricing.final <= max);
  }
  if (featured === "1") {
    products = products.filter((p) => p.featured);
  }
  if (bestSeller === "1") {
    products = products.filter((p) => p.bestSeller);
  }
  // VIP filtering disabled per request.
  // if (vipOnly === "1") {
  //   products = products.filter((p) => p.isVipOnly);
  // }
  if (offersOnly === "1") {
    products = products.filter((p) => Number(p.offerPercent) > 0);
  }

  return res.json({ items: products });
});

app.get("/api/products/:id", (req, res) => {
  const db = readDb();
  const user = getCurrentUserEntity(req.user, db);
  const product = db.products.find((p) => p.id === Number(req.params.id));
  if (!product) {
    return res.status(404).json({ error: "المنتج غير موجود" });
  }
  const computed = attachComputedProduct(product, user);
  if (!computed) {
    return res.status(404).json({ error: "المنتج غير متاح" });
  }
  return res.json({ item: computed });
});

app.get("/api/meta/filters", (_req, res) => {
  const db = readDb();
  const categories = [...new Set(db.products.map((p) => p.category))];
  const sizes = [...new Set(db.products.flatMap((p) => p.sizes))];
  const colors = [...new Set(db.products.flatMap((p) => p.colors))];
  return res.json({ categories, sizes, colors });
});

app.get("/api/cart", auth, (req, res) => {
  const db = readDb();
  const user = getCurrentUserEntity(req.user, db);
  const cart = summarizeCart(db, user);
  return res.json(cart);
});

app.post("/api/cart/items", auth, (req, res) => {
  const { productId, qty = 1, size, color } = req.body || {};
  if (!productId || Number(qty) < 1) {
    return res.status(400).json({ error: "بيانات المنتج غير صالحة" });
  }

  const cart = withDb((db) => {
    const user = getCurrentUserEntity(req.user, db);
    const currentCart = getCart(db, user.id);
    const existing = currentCart.items.find(
      (it) => it.productId === Number(productId) && it.size === size && it.color === color,
    );
    if (existing) {
      existing.qty += Number(qty);
    } else {
      currentCart.items.push({
        id: randomId("cart_item"),
        productId: Number(productId),
        qty: Number(qty),
        size: size || null,
        color: color || null,
      });
    }
    return summarizeCart(db, user);
  });

  return res.status(201).json(cart);
});

app.delete("/api/cart/items/:itemId", auth, (req, res) => {
  const cart = withDb((db) => {
    const user = getCurrentUserEntity(req.user, db);
    const currentCart = getCart(db, user.id);
    currentCart.items = currentCart.items.filter((it) => it.id !== req.params.itemId);
    return summarizeCart(db, user);
  });

  return res.json(cart);
});

app.post("/api/cart/clear", auth, (req, res) => {
  withDb((db) => {
    const user = getCurrentUserEntity(req.user, db);
    const currentCart = getCart(db, user.id);
    currentCart.items = [];
  });
  return res.json({ ok: true });
});

app.post("/api/checkout", auth, async (req, res) => {
  const { paymentMethod = "local", shippingAddress } = req.body || {};

  const response = await withDb(async (db) => {
    const user = getCurrentUserEntity(req.user, db);
    const cart = summarizeCart(db, user);

    if (!cart.items.length) {
      return { error: "السلة فارغة", status: 400 };
    }

    const order = {
      id: randomId("order"),
      userId: user.id,
      items: cart.items.map((it) => ({
        productId: it.product.id,
        qty: it.qty,
        size: it.size,
        color: it.color,
        unitPrice: it.product.pricing.final,
      })),
      subtotal: cart.subtotal,
      total: cart.subtotal,
      paymentMethod,
      paymentStatus: paymentMethod === "local" ? "pending" : "created",
      orderStatus: "processing",
      shippingAddress: shippingAddress || null,
      createdAt: new Date().toISOString(),
    };

    db.orders.push(order);
    const currentCart = getCart(db, user.id);
    currentCart.items = [];

    let paymentPayload = {
      provider: paymentMethod,
      status: order.paymentStatus,
    };

    if (paymentMethod === "stripe") {
      if (!stripe) {
        paymentPayload = {
          provider: "stripe",
          status: "mock",
          clientSecret: `mock_cs_${order.id}`,
        };
      } else {
        const intent = await stripe.paymentIntents.create({
          amount: order.total * 100,
          currency: "egp",
          automatic_payment_methods: { enabled: true },
          metadata: { orderId: order.id },
        });
        paymentPayload = {
          provider: "stripe",
          status: "created",
          clientSecret: intent.client_secret,
        };
      }
    }

    if (paymentMethod === "paypal") {
      paymentPayload = {
        provider: "paypal",
        status: "created",
        approvalUrl: `https://www.paypal.com/checkoutnow?token=${order.id}`,
      };
    }

    return {
      status: 201,
      body: {
        order,
        payment: paymentPayload,
        notification: "تم إنشاء الطلب بنجاح وسيصلك إشعار بالتأكيد.",
      },
    };
  });

  if (response.error) {
    return res.status(response.status || 400).json({ error: response.error });
  }

  return res.status(response.status).json(response.body);
});

app.get("/api/orders/my", auth, (req, res) => {
  const db = readDb();
  const orders = db.orders
    .filter((o) => o.userId === req.user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json({ items: orders });
});

app.get("/api/vip/offers", auth, (req, res) => {
  const db = readDb();
  // VIP program disabled per request while keeping endpoint shape stable.
  // const user = getCurrentUserEntity(req.user, db);
  // const offers = db.offers.filter((o) => o.active);
  void db;
  return res.json({
    vip: false,
    items: [],
  });
});

app.get("/api/admin/orders", auth, adminOnly, (_req, res) => {
  const db = readDb();
  const items = [...db.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return res.json({ items });
});

app.patch("/api/admin/orders/:id", auth, adminOnly, (req, res) => {
  const { orderStatus, paymentStatus } = req.body || {};
  const updated = withDb((db) => {
    const order = db.orders.find((o) => o.id === req.params.id);
    if (!order) {
      return null;
    }
    if (orderStatus) {
      order.orderStatus = orderStatus;
    }
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    return order;
  });

  if (!updated) {
    return res.status(404).json({ error: "الطلب غير موجود" });
  }

  return res.json({ item: updated });
});

app.get("/api/admin/vip-customers", auth, adminOnly, (_req, res) => {
  // VIP customers report disabled per request while preserving endpoint.
  // const db = readDb();
  // const items = db.users.filter((u) => u.vip).map(sanitizeUser);
  return res.json({ items: [] });
});

app.post("/api/admin/products", auth, adminOnly, (req, res) => {
  const payload = req.body || {};
  const item = withDb((db) => {
    const product = {
      id: nextNumericId(db.products),
      name: payload.name || "منتج جديد",
      description: payload.description || "",
      category: payload.category || "General",
      price: Number(payload.price || 0),
      offerPercent: Number(payload.offerPercent || 0),
      isVipOnly: !!payload.isVipOnly,
      featured: !!payload.featured,
      bestSeller: !!payload.bestSeller,
      stock: Number(payload.stock || 0),
      sizes: payload.sizes || ["M"],
      colors: payload.colors || ["أسود"],
      images: payload.images || [],
    };
    db.products.push(product);
    return product;
  });

  return res.status(201).json({ item });
});

app.patch("/api/admin/products/:id", auth, adminOnly, (req, res) => {
  const payload = req.body || {};
  const item = withDb((db) => {
    const product = db.products.find((p) => p.id === Number(req.params.id));
    if (!product) {
      return null;
    }
    Object.assign(product, payload);
    return product;
  });

  if (!item) {
    return res.status(404).json({ error: "المنتج غير موجود" });
  }

  return res.json({ item });
});

app.delete("/api/admin/products/:id", auth, adminOnly, (req, res) => {
  const ok = withDb((db) => {
    const oldLength = db.products.length;
    db.products = db.products.filter((p) => p.id !== Number(req.params.id));
    return db.products.length < oldLength;
  });

  if (!ok) {
    return res.status(404).json({ error: "المنتج غير موجود" });
  }

  return res.json({ ok: true });
});

app.post("/api/chat/reply", (req, res) => {
  const text = String(req.body?.message || "").toLowerCase();
  let reply = "شكراً لتواصلك مع Invura. كيف أقدر أساعدك أكثر؟";

  if (text.includes("vip")) {
    // VIP flow disabled per request.
    reply = "ميزة VIP غير مفعلة حالياً.";
  } else if (text.includes("طلب") || text.includes("order")) {
    reply = "لمتابعة طلبك، ادخل إلى صفحة حسابي ثم تبويب الطلبات.";
  } else if (text.includes("شحن")) {
    reply = "الشحن المحلي يستغرق عادة من 2 إلى 4 أيام عمل.";
  }

  return res.json({ message: reply });
});

const wss = new WebSocketServer({ server, path: "/ws/chat" });

wss.on("connection", (ws) => {
  ws.send(JSON.stringify({ sender: "bot", text: "أهلاً بك في خدمة Invura المباشرة" }));

  ws.on("message", (buffer) => {
    let incoming = "";
    try {
      incoming = JSON.parse(String(buffer)).text || "";
    } catch {
      incoming = String(buffer);
    }

    let text = "تم استلام رسالتك، وسيتم الرد عليك خلال لحظات.";
    if (incoming.includes("خصم") || incoming.toLowerCase().includes("discount")) {
      text = "لدينا الآن عروض خاصة حتى 20% على بعض المنتجات.";
    }

    ws.send(JSON.stringify({ sender: "bot", text }));
  });
});

server.listen(PORT, () => {
  console.log(`Invura API running on http://localhost:${PORT}`);
});
