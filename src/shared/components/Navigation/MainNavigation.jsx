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
    <>
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
            {/* <!-- NAVIGATION MENU --> */}

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
      {/* <nav class="nav">
        <ul class="nav-menu">
          <li class="nav-item">
            <a href="#" class="nav-link">
              Home
            </a>
          </li>

          <li class="nav-item dropdown">
            <a href="#" class="nav-link">
              Collection
            </a>
            <div class="dropdown-menu">
              <div class="dropdown-column">
                <h4>Category</h4>
                <a href="#">Dresses</a>
                <a href="#">Tops</a>
                <a href="#">Bottoms</a>
                <a href="#">Co-ords</a>
                <a href="#">Jumpsuits</a>
              </div>
              <div class="dropdown-column">
                <h4>Occasion</h4>
                <a href="#">Casual</a>
                <a href="#">Party</a>
                <a href="#">Work</a>
                <a href="#">Festive</a>
                <a href="#">Wedding</a>
              </div>
              <div class="dropdown-column">
                <h4>Style</h4>
                <a href="#">Trendy</a>
                <a href="#">Minimal</a>
                <a href="#">Boho</a>
                <a href="#">Chic</a>
                <a href="#">Vintage</a>
              </div>
              <div class="dropdown-column">
                <h4>Season</h4>
                <a href="#">Spring</a>
                <a href="#">Summer</a>
                <a href="#">Fall</a>
                <a href="#">Winter</a>
              </div>
            </div>
          </li>
        </ul>
      </nav> */}
    </>
  );
};

export default Navbar;
