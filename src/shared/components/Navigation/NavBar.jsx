import React from "react";

import "./NavBar.css";
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        {/* <div className="logo">PAHIRAN</div> */}
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
          <NavLink to="/cart">
            <FaShoppingBag />
          </NavLink>
        </div>
      </div>

      {/* <div className="nav-inner">
        <div className="left-section">
          <div className="logo">PAHIRAN</div>
          <div className="search-container">
            <input type="text" placeholder="Search for clothes..." />
            <FaSearch />
          </div>
        </div>
        <div className="nav-icons">
          <FaUser />
          <FaHeart />
          <FaShoppingBag />
        </div>
      </div> */}

      {/* <ul className="nav-links">
        {[
          "New Arrivals",
          "Best Seller",
          "Collection",
          "About Us",
        ].map((text, i) => (
          <li key={i}>
            <a href="#">{text}</a>
          </li>
        ))}
      </ul> */}
      <ul className="nav-links">
        <li>
          <NavLink to="/new-arrivals">New Arrivals</NavLink>
        </li>
        <li>
          <NavLink to="/best-seller">Best Seller</NavLink>
        </li>
        <li>
          <NavLink to="/collection">Collection</NavLink>
        </li>
        <li>
          <NavLink to="/shop-by">Shop By</NavLink>
        </li>
        <li>
          <NavLink to="/about">About Us</NavLink>
        </li>
        {/* Continue for other links */}
      </ul>
    </nav>
  );
};

export default Navbar;
