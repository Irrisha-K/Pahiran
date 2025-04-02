import React, { useState } from "react";
import "./Navbar.css";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingBag,
  FaBars,
} from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Top Section: Logo, Search Bar, and Icons */}
      <div className="nav-top">
        <div className="logo">PAHIRAN</div>

        <div className="search-bar">
          <input type="text" placeholder="Search for products..." />
          <button>
            <FaSearch />
          </button>
        </div>

        <div className="icons">
          <FaUser className="icon" />
          <FaHeart className="icon" />
          <FaShoppingBag className="icon" />
        </div>
      </div>

      {/* Bottom Section: Navigation Links */}
      <div className="nav-links">
        <ul>
          <li>
            <a href="#">New Arrivals</a>
          </li>
          <li>
            <a href="#">Best Sellers</a>
          </li>
          <li>
            <a href="#">Collections</a>
          </li>
          <li>
            <a href="#">Shop By</a>
          </li>
          <li>
            <a href="#">Gifting</a>
          </li>
          <li>
            <a href="#">Track Order</a>
          </li>
          <li>
            <a href="#">Return & Exchange</a>
          </li>
          <li>
            <a href="#">About Us</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
