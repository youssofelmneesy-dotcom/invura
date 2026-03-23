import { Link } from "react-router";
import { ShoppingCart, User, Heart, Menu, Search } from "lucide-react";
import { useState } from "react";
import { useStore } from "../contexts/StoreContext";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const { cart, wishlist } = useStore();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartCount = cart?.items.length || 0;

  return (
    <header className="bg-black text-white sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-extrabold tracking-wider hover:text-red-500 transition-colors">
            INVURA
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="hover:text-red-500 transition-colors">
              الرئيسية
            </Link>
            <Link to="/product/1" className="hover:text-red-500 transition-colors">
              المنتجات
            </Link>
            <Link to="/outfit-builder" className="hover:text-red-500 transition-colors">
              منشئ الأزياء
            </Link>
            <Link to={isAuthenticated ? "/user" : "/auth"} className="hover:text-red-500 transition-colors">
              حسابي
            </Link>
            {user?.role === "admin" && (
              <Link to="/admin" className="hover:text-red-500 transition-colors">
                الإدارة
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button className="hover:text-red-500 transition-colors hidden md:block">
              <Search className="w-5 h-5" />
            </button>
            <Link to="/user" className="hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="relative hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to={isAuthenticated ? "/user" : "/auth"} className="hover:text-red-500 transition-colors">
              <User className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="relative hover:text-red-500 transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated && (
              <button onClick={logout} className="hidden md:block text-sm bg-white/10 px-3 py-1 rounded hover:bg-red-600">
                خروج
              </button>
            )}
            <button
              className="md:hidden hover:text-red-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                className="hover:text-red-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                الرئيسية
              </Link>
              <Link
                to="/product/1"
                className="hover:text-red-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                المنتجات
              </Link>
              <Link
                to="/cart"
                className="hover:text-red-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                السلة
              </Link>
              <Link
                to="/outfit-builder"
                className="hover:text-red-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                منشئ الأزياء
              </Link>
              <Link
                to={isAuthenticated ? "/user" : "/auth"}
                className="hover:text-red-500 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                حسابي
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="hover:text-red-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  الإدارة
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
