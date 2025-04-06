import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import HomePage from "./pages/Home";
import ProductGallery from "./components/Product";
import Navbar from "./shared/components/UIElements/NavBar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Navbar />
      <main>
        <ProductGallery />
      </main>
    </>
  );
}

export default App;
