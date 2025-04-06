import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import ProductGallery from "./components/Product";
import Navbar from "./shared/components/UIElements/NavBar";
import ProductsPage from "./Products/pages/ProductsPage";
import Homepage from "./pages/Home";

const routes = [
  { path: "/", element: <ProductsPage /> },
  { path: "/home", element: <Homepage /> },
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
