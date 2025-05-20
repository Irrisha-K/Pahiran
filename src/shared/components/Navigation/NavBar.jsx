// import React, { useContext } from "react";

// import "./NavBar.css";
// import { FaSearch, FaUser, FaHeart, FaShoppingBag } from "react-icons/fa";
// import { NavLink } from "react-router-dom";
// import CartContext from "../../../store/CartContext";

// export default function Navbar() {
//   const { items } = useContext(CartContext);

//   const totalCartItems = items.reduce(
//     (total, item) => total + item.quantity,
//     0
//   );

//   return (
//     <nav className="navbar">
//       <div className="nav-inner">
//         <NavLink to="/" className="logo">
//           PAHIRAN
//         </NavLink>

//         <div className="search-container">
//           <input type="text" placeholder="Search for clothes..." />
//           <FaSearch />
//         </div>

//         <div className="nav-icons">
//           <NavLink to="/auth">
//             <FaUser />
//           </NavLink>
//           <NavLink to="/wishlist">
//             <FaHeart />
//           </NavLink>
//           <NavLink to="/cart" className="cart-icon">
//             <FaShoppingBag />
//             {totalCartItems > 0 && (
//               <span className="cart-badge">{totalCartItems}</span>
//             )}
//           </NavLink>
//         </div>
//       </div>
//       <ul className="nav-links">
//         <li>
//           <NavLink to="/new-arrivals">New Arrivals</NavLink>
//         </li>
//         <li>
//           <NavLink to="/best-seller">Best Seller</NavLink>
//         </li>
//         {/* <li>
//           <NavLink to="/collection">Collection</NavLink>
//         </li> */}
//         {/* <div className="dropdown">
//           <a href="#" className="dropbtn">
//             Collection
//           </a>
//           <div className="dropdown-content">
//             <a href="#">Casual Wear</a>
//             <a href="#">Party Fits</a>
//             <a href="#">Workwear Edits</a>
//             <a href="#">Ethnic Elegance</a>
//           </div>
//         </div> */}
//         {/* <li>
//           <NavLink to="/shop-by">Shop By</NavLink>
//         </li> */}
//         <div className="dropdown">
//           {/* <a href="/Shopby.jsx" className="dropbtn">
//             Shop By just gonna stand there and hold me close but thats alright cause i like the way it hurts
//           </a> */}
//           <li>
//             {/* <NavLink to="/shop-by">Tops</NavLink> */}
//             <NavLink to="/shop-by">Shop By</NavLink>
//           </li>
//           <div className="dropdown-content">
//             {/* <a href="#">Tops</a> */}
//             <li>
//               {/* <NavLink to="/shop-by">Shop By</NavLink> */}
//               <NavLink to="/tops">Tops</NavLink>
//             </li>
//             <NavLink to="/pants">Pants</NavLink>
//             <a href="#">Dresses</a>
//             <a href="#">Skirts</a>
//             <a href="#">Co-ords</a>
//           </div>
//         </div>
//         <li>
//           <NavLink to="/about">About Us</NavLink>
//         </li>
//         {/* Continue for other links */}
//       </ul>
//     </nav>
//   );
// }

//

import React, { useContext, useState } from "react";
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import CartContext from "../../../store/CartContext";
import "./NavBar.css";
import SearchBar from "../UIElements/SearchBar";

export default function Navbar() {
  const { items } = useContext(CartContext);
  const totalCartItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <NavLink to="/" className="logo">
          PAHIRAN
        </NavLink>

        {/* 🔍 Global Search Bar */}
        <form className="search-container" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for clothes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" style={{ background: "none", border: "none" }}>
            <FaSearch />
          </button>
        </form>
        {/* <div className="search-container">
          <SearchBar />
        </div> */}

        {/* 👤 Icons */}
        <div className="nav-icons">
          <NavLink to="/auth">
            <FaUser />
          </NavLink>
          <NavLink to="/wishlist">
            <FaHeart />
          </NavLink>
          <NavLink to="/cart" className="cart-icon">
            <FaShoppingBag />
            {totalCartItems > 0 && (
              <span className="cart-badge">{totalCartItems}</span>
            )}
          </NavLink>
        </div>
      </div>

      {/* 🔗 Navigation Links */}
      <ul className="nav-links">
        <li>
          <NavLink to="/new-arrivals">New Arrivals</NavLink>
        </li>
        <li>
          <NavLink to="/best-seller">Best Seller</NavLink>
        </li>

        {/* <div className="dropdown">
          <li>Shop By</li>
          <div className="dropdown-content">
            <li>
              <NavLink to="/tops">Tops</NavLink>
            </li>
            <NavLink to="/pants">Pants</NavLink>
            <a href="#">Dresses</a>
            <a href="#">Skirts</a>
            <a href="#">Co-ords</a>
          </div>
        </div> */}

        <li className="dropdown">
          <span className="dropbtn">Shop By</span>
          <div className="dropdown-content">
            <NavLink to="/tops">Tops</NavLink>
            <NavLink to="/pants">Pants</NavLink>
            <NavLink to="#">Dresses</NavLink>
            <NavLink to="#">Skirts</NavLink>
            <NavLink to="#">Co-ords</NavLink>
          </div>
        </li>

        <li>
          <NavLink to="/about">About Us</NavLink>
        </li>
      </ul>
    </nav>
  );
}
