import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
// import Navbar from "./shared/components/UIElements/NavBar";
import ProductsPage from "./Products/pages/ProductsPage";
import Homepage from "./pages/Home";
import RootLayout from "./shared/RootLayout/RootLayout";
import ErrorPage from "./shared/RootLayout/Error";
import Navbar from "./shared/components/Navigation/NavBar";
import NewArrivalsPage from "./Products/pages/NewArrivalsPage";
import BestSellersPage from "./Products/pages/BestSellersPage";
import AuthForm from "./users/pages/AuthForm";

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
      { path: "/new-arrivals", element: <NewArrivalsPage /> },
      { path: "/auth", element: <AuthForm /> },
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
