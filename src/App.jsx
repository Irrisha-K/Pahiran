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
import PantsPage from "./Products/pages/Pants";
import TopsPage from "./Products/pages/TopsPage";
import SkirtPage from "./Products/pages/Skirts";
import CoordPage from "./Products/pages/Coord";
import SearchResultsPage from "./shared/pages/SearchResultsPage";
import DressesPages from "./Products/pages/DressesPages";
import AdminProductForm from "./users/Admin/AddProduct";
import { AuthContext } from "./store/AuthContext";
import { useContext } from "react";
import AuthProvider from "./store/AuthProvider";
import ProtectedAdminRoute from "./users/Admin/components/ProtectedAdminRoute";
import UsersHomePage from "./users/pages/UsersHomePage";
import AdminHomePage from "./users/pages/AdminHomePage";

const routes = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <ProductsPage /> },
      // { path: "/home", element: <Homepage /> },
      { path: "/new-arrivals", element: <NewArrivalsPage /> },
      { path: "/best-seller", element: <BestSellersPage /> },
      { path: "/auth", element: <AuthForm /> },
      { path: "/cart", element: <CartPage /> },
      { path: "/about", element: <AboutUs /> },
      { path: "/checkout", element: <CheckoutPage /> },
      { path: "/tops", element: <TopsPage /> },
      { path: "/pants", element: <PantsPage /> },
      { path: "/dresses", element: <DressesPages /> },
      { path: "/skirts", element: <SkirtPage /> },
      { path: "/coord", element: <CoordPage /> },
      { path: "/search", element: <SearchResultsPage /> },
      { path: "/add", element: <AdminProductForm /> },
      { path: "/users", element: <UsersHomePage /> },
      { path: "/admin", element: <AdminHomePage /> },
    ],
  },
  { path: "/auth", element: <AuthForm /> },
];
const router = createBrowserRouter(routes);

// function App() {
//   return (
//     <>
//       <main>
//         <AuthProvider>
//           <CartContextProvider>
//             <RouterProvider router={router} />
//           </CartContextProvider>
//         </AuthProvider>
//       </main>
//     </>
//   );
// }

function App() {
  return (
    <AuthProvider>
      <CartContextProvider>
        <RouterProvider router={router} />
      </CartContextProvider>
    </AuthProvider>
  );
}

export default App;
