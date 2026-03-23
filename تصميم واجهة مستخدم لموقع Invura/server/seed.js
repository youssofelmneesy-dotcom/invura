import bcrypt from "bcryptjs";
import { defaultDb, writeDb } from "./db.js";

const productSeed = [
  {
    id: 1,
    name: "قميص تدريب احترافي",
    description: "قميص مرن بتقنية امتصاص العرق مناسب للتمارين المكثفة.",
    category: "Gym Wear",
    price: 149,
    offerPercent: 10,
    isVipOnly: false,
    featured: true,
    bestSeller: true,
    stock: 90,
    sizes: ["S", "M", "L", "XL"],
    colors: ["أسود", "رمادي", "أبيض"],
    images: [
      "https://images.unsplash.com/photo-1769072060413-93a53d8778e3?auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1765791277994-33e886a83a9d?auto=format&fit=crop&w=1080&q=80"
    ]
  },
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
      "https://images.unsplash.com/photo-1632077804406-188472f1a810?auto=format&fit=crop&w=1080&q=80"
    ]
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
      "https://images.unsplash.com/photo-1765914448113-ebf0ce8cb918?auto=format&fit=crop&w=900&q=80"
    ]
  },
  {
    id: 4,
    name: "طقم جيم VIP",
    description: "طقم حصري لأعضاء VIP يشمل تيشيرت وبنطال.",
    category: "VIP",
    price: 499,
    offerPercent: 20,
    isVipOnly: true,
    featured: true,
    bestSeller: true,
    stock: 20,
    sizes: ["M", "L", "XL"],
    colors: ["أسود", "ذهبي"],
    images: [
      "https://images.unsplash.com/photo-1632077804406-188472f1a810?auto=format&fit=crop&w=1080&q=80",
      "https://images.unsplash.com/photo-1762744827101-404f5cc7d8ab?auto=format&fit=crop&w=1080&q=80"
    ]
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
      "https://images.unsplash.com/photo-1761946356399-8335dbdce394?auto=format&fit=crop&w=1080&q=80"
    ]
  }
];

async function seed() {
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const userPasswordHash = await bcrypt.hash("user123", 10);

  const db = {
    ...defaultDb,
    users: [
      {
        id: 1,
        name: "مدير Invura",
        email: "admin@invura.com",
        passwordHash: adminPasswordHash,
        role: "admin",
        vip: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        name: "عميل تجريبي",
        email: "user@invura.com",
        passwordHash: userPasswordHash,
        role: "user",
        vip: false,
        createdAt: new Date().toISOString(),
      },
    ],
    products: productSeed,
    carts: [],
    orders: [],
  };

  writeDb(db);
  console.log("Seed complete: admin@invura.com / admin123");
}

seed();
