import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProductsPage from "./Products/pages/ProductsPage";
import RootLayout from "./shared/RootLayout/RootLayout";
import ErrorPage from "./shared/RootLayout/Error";
import BestSellersPage from "./Products/pages/BestSellersPage";
import AuthForm from "./users/pages/AuthForm";
import NewArrivalsPage from "./NewArrivals/Pages/NewArrivalsPage";
import AboutUs from "./pages/AboutUs";
import { CartContextProvider } from "./store/CartContext";
import CartPage from "./users/pages/CartPage";
import CheckoutPage from "./users/pages/CheckoutPage";
import PantsPage from "./Products/pages/PantsPage";
import TopsPage from "./Products/pages/TopsPage";
import SkirtPage from "./Products/pages/SkirtsPage";
import CoordPage from "./Products/pages/Coord";
import SearchResultsPage from "./shared/pages/SearchResultsPage";
import DressesPages from "./Products/pages/DressesPages";
import AdminProductForm from "./users/Admin/AddProduct";
import AuthProvider from "./store/AuthProvider";
import UsersHomePage from "./users/pages/UsersHomePage";
import AdminHomePage from "./users/pages/AdminHomePage";
import ProductDetailsPage from "./Products/pages/ProductDetailsPage";
import AdminUpdateProduct from "./users/Admin/AdminUpdateProduct";

const routes = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <ProductsPage /> },
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
      { path: "/product/:id", element: <ProductDetailsPage /> },
      { path: "/admin/update/:id", element: <AdminUpdateProduct /> },
      // <Route path="/admin/update/:id" element={<AdminUpdateProduct />} />
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
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
      />
      <AuthProvider>
        <CartContextProvider>
          <RouterProvider router={router} />
        </CartContextProvider>
      </AuthProvider>
    </>
  );
}

export default App;
