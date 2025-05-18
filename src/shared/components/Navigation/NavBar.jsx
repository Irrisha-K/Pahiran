import React, { useContext } from "react";

import "./NavBar.css";
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import CartContext from "../../../store/CartContext";

export default function Navbar() {
  const { items } = useContext(CartContext);

  const totalCartItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <NavLink to="/" className="logo">
          PAHIRAN
        </NavLink>

        <div className="search-container">
          <input type="text" placeholder="Search for clothes..." />
          <FaSearch />
        </div>

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
      <ul className="nav-links">
        <li>
          <NavLink to="/new-arrivals">New Arrivals</NavLink>
        </li>
        <li>
          <NavLink to="/best-seller">Best Seller</NavLink>
        </li>
        {/* <li>
          <NavLink to="/collection">Collection</NavLink>
        </li> */}
        {/* <div className="dropdown">
          <a href="#" className="dropbtn">
            Collection
          </a>
          <div className="dropdown-content">
            <a href="#">Casual Wear</a>
            <a href="#">Party Fits</a>
            <a href="#">Workwear Edits</a>
            <a href="#">Ethnic Elegance</a>
          </div>
        </div> */}
        {/* <li>
          <NavLink to="/shop-by">Shop By</NavLink>
        </li> */}
        <div className="dropdown">
          {/* <a href="/Shopby.jsx" className="dropbtn">
            Shop By just gonna stand there and hold me close but thats alright cause i like the way it hurts
          </a> */}
          <li>
          <NavLink to="/shop-by">Tops</NavLink>
        </li>
          <div className="dropdown-content">
            {/* <a href="#">Tops</a> */}
            <li>
          <NavLink to="/shop-by">Shop By</NavLink>
        </li>
            <a href="#">Pants</a>
            <a href="#">Dresses</a>
            <a href="#">Skirts</a>
            <a href="#">Co-ords</a>
          </div>
        </div>
        <li>
          <NavLink to="/about">About Us</NavLink>
        </li>
        {/* Continue for other links */}
      </ul>
    </nav>
  );
}
