import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const DB_PATH = path.resolve(process.cwd(), "server/data/db.json");

const defaultDb = {
  users: [],
  products: [],
  carts: [],
  orders: [],
  offers: [
    {
      id: "offer-vip-20",
      title: "خصم 20% لأعضاء VIP",
      description: "خصم تلقائي على المنتجات المؤهلة",
      type: "vip",
      discountPercent: 20,
      active: true,
    },
    {
      id: "offer-summer-10",
      title: "عرض الصيف",
      description: "خصم 10% على المنتجات المختارة",
      type: "seasonal",
      discountPercent: 10,
      active: true,
    },
  ],
};

function ensureDbFile() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2), "utf-8");
  }
}

function readDb() {
  ensureDbFile();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), "utf-8");
}

function withDb(mutator) {
  const db = readDb();
  const result = mutator(db);
  writeDb(db);
  return result;
}

function nextNumericId(items) {
  if (!items.length) {
    return 1;
  }
  return Math.max(...items.map((item) => Number(item.id) || 0)) + 1;
}

function randomId(prefix = "id") {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

export {
  DB_PATH,
  readDb,
  writeDb,
  withDb,
  nextNumericId,
  randomId,
  defaultDb,
};
