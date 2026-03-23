import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { UserPage } from "./pages/UserPage";
// import { OutfitBuilderPage } from "./pages/OutfitBuilderPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { AuthPage } from "./pages/AuthPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProductsPage } from "./pages/ProductsPage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    Component: AuthPage,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "products", Component: ProductsPage },
      { path: "product/:id", Component: ProductPage },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        ),
      },
      // Outfit Builder disabled per request while preserving route code.
      // { path: "outfit-builder", Component: OutfitBuilderPage },
      { path: "cart", Component: CartPage },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute adminOnly>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
