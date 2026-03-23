import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { ProductPage } from "./pages/ProductPage";
import { UserPage } from "./pages/UserPage";
import { OutfitBuilderPage } from "./pages/OutfitBuilderPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: HomePage },
      { path: "product/:id", Component: ProductPage },
      { path: "user", Component: UserPage },
      { path: "outfit-builder", Component: OutfitBuilderPage },
    ],
  },
]);
