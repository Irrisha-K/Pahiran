import { createBrowserRouter, RouterProvider } from "react-router-dom";

import ProductsPage from "./Products/pages/ProductsPage";
import Homepage from "./pages/Home";
import RootLayout from "./shared/RootLayout/RootLayout";
import ErrorPage from "./shared/RootLayout/Error";
import BestSellersPage from "./Products/pages/BestSellersPage";
import AuthForm from "./users/pages/AuthForm";
import NewArrivalsPage from "./NewArrivals/Pages/NewArrivalsPage";
import AboutUs from "./pages/AboutUs";
import { CartContextProvider } from "./store/CartContext";
import CartPage from "./users/pages/CartPage";
import CheckoutPage from "./users/pages/CheckoutPage";
import ShopbyPage from "./Products/pages/Shopby";

const routes = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <ProductsPage /> },
      { path: "/home", element: <Homepage /> },
      { path: "/new-arrivals", element: <NewArrivalsPage /> },
      { path: "/best-seller", element: <BestSellersPage /> },
      { path: "/auth", element: <AuthForm /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/about", element: <AboutUs /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/shop-by", element: <ShopbyPage /> },
    ],
  },
  // { path: "/auth", element: <AuthForm /> },
];
const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <main>
        <CartContextProvider>
          <RouterProvider router={router} />
        </CartContextProvider>
      </main>
    </>
  );
}

export default App;
