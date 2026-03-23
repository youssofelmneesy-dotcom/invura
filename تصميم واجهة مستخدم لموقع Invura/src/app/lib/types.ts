export interface Product {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  offerPercent: number;
  isVipOnly: boolean;
  featured: boolean;
  bestSeller: boolean;
  stock: number;
  sizes: string[];
  colors: string[];
  images: string[];
  pricing: {
    base: number;
    discountPercent: number;
    final: number;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  vip: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: number;
  qty: number;
  size: string | null;
  color: string | null;
  product: Product;
  lineTotal: number;
}

export interface Cart {
  userId: number;
  items: CartItem[];
  subtotal: number;
}

export interface Order {
  id: string;
  userId: number;
  subtotal: number;
  total: number;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  type: string;
  discountPercent: number;
  active: boolean;
}
