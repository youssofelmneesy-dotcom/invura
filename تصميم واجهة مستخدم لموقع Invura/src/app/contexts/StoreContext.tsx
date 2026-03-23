import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { api } from "../lib/api";
import type { Cart, Product } from "../lib/types";
import { useAuth } from "./AuthContext";

interface StoreContextValue {
  cart: Cart | null;
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: number) => void;
  isWishlisted: (productId: number) => boolean;
  addToCart: (params: {
    productId: number;
    qty?: number;
    size?: string;
    color?: string;
  }) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const WISHLIST_KEY = "invura_wishlist";

export function StoreProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  });
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const refreshCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }
    const response = await api.cart();
    setCart(response);
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async ({ productId, qty = 1, size, color }: { productId: number; qty?: number; size?: string; color?: string }) => {
      if (!isAuthenticated) {
        window.location.assign("/auth");
        return;
      }
      const next = await api.addCartItem({ productId, qty, size, color });
      setCart(next);
    },
    [isAuthenticated],
  );

  const removeCartItem = useCallback(async (itemId: string) => {
    const next = await api.removeCartItem(itemId);
    setCart(next);
  }, []);

  const addToWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        return prev;
      }
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const isWishlisted = useCallback(
    (productId: number) => wishlist.some((item) => item.id === productId),
    [wishlist],
  );

  const value = useMemo(
    () => ({
      cart,
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isWishlisted,
      addToCart,
      removeCartItem,
      refreshCart,
    }),
    [addToCart, addToWishlist, cart, isWishlisted, refreshCart, removeCartItem, removeFromWishlist, wishlist],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return context;
}
