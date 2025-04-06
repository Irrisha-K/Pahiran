import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import Navbar from "./shared/components/UIElements/NavBar";
import ProductsPage from "./Products/pages/ProductsPage";
import Homepage from "./pages/Home";
import RootLayout from "./shared/RootLayout/RootLayout";
import ErrorPage from "./shared/RootLayout/Error";

const routes = [
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <ProductsPage /> },
      { path: "/home", element: <Homepage /> },
    ],
  },
];
const router = createBrowserRouter(routes);

function App() {
  return (
    <>
      <Navbar />
      <main>
        <RouterProvider router={router} />
      </main>
    </>
  );
}

export default App;
