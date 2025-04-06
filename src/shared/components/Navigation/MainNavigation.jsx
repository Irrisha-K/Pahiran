import React, { useState } from "react";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingBag,
  FaBars,
} from "react-icons/fa";

import "./MainNavigation.css";

const Navbar = () => {
  const [collectionsOpen, setCollectionsOpen] = useState(false);

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
          {/* <li
            className="dropdown"
            onMouseEnter={() => setCollectionsOpen(true)}
            onMouseLeave={() => setCollectionsOpen(false)}
          >
            <a href="#">Collections ▾</a>
            {collectionsOpen && (
              <ul className="dropdown-menu">
                <li>
                  <a href="#">Spring Collection</a>
                </li>
                <li>
                  <a href="#">Ethnic Wear</a>
                </li>
                <li>
                  <a href="#">Western</a>
                </li>
                <li>
                  <a href="#">Work Wear</a>
                </li>
                <li>
                  <a href="#">Casuals</a>
                </li>
              </ul>
            )}
          </li> */}
          <li className="dropdown">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault(); // prevent page jump
                setCollectionsOpen((prev) => !prev);
              }}
            >
              Collections ▾
            </a>
            {collectionsOpen && (
              <ul className="dropdown-menu">
                <li>
                  <a href="#">Spring Collection</a>
                </li>
                <li>
                  <a href="#">Ethnic Wear</a>
                </li>
                <li>
                  <a href="#">Western</a>
                </li>
                <li>
                  <a href="#">Work Wear</a>
                </li>
                <li>
                  <a href="#">Casuals</a>
                </li>
              </ul>
            )}
          </li>

          <li>
            <a href="#">Shop By</a>
          </li>
          <li>
            <a href="#">Gifting</a>
          </li>
          <li>
            <a href="#">Seasonal Collection</a>
          </li>
          <li>
            <a href="#">Track Order</a>
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
