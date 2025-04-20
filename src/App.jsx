import { createBrowserRouter, RouterProvider } from "react-router-dom";

// import Navbar from "./shared/components/UIElements/NavBar";
import ProductsPage from "./Products/pages/ProductsPage";
import Homepage from "./pages/Home";
import RootLayout from "./shared/RootLayout/RootLayout";
import ErrorPage from "./shared/RootLayout/Error";
import Navbar from "./shared/components/Navigation/NavBar";
import BestSellersPage from "./Products/pages/BestSellersPage";
import AuthForm from "./users/pages/AuthForm";
import NewArrivalsPage from "./NewArrivals/Pages/NewArrivalsPage";
import AboutUs from "./pages/AboutUs";

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
      { path: "/about", element: <AboutUs /> },
    ],
  },
  // { path: "/auth", element: <AuthForm /> },
];
const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      {/* <Navbar /> */}
      {/* <Navbar /> */}
      <main>
        <RouterProvider router={router} />
      </main>
    </>
  );
}

export default App;


