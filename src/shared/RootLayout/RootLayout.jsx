import { Outlet } from "react-router-dom";
import MainNavigation from "../components/Navigation/MainNavigation";
import PromoBar from "../components/Navigation/PromoBar";
import Navbar from "../components/Navigation/NavBar";

const RootLayout = () => {
  return (
    <>
      {/* <MainNavigation /> */}
      <PromoBar />
      <Navbar />
      <main>
        <Outlet /> {/* This renders the nested route content dynamically */}
      </main>
    </>
  );
};

export default RootLayout;
