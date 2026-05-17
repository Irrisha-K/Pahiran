import React, { useState } from "react";
import { NavLink } from "react-router-dom";

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
          <div className="logo">
            <NavLink to="/"> PAHIRAN</NavLink>
          </div>

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
              <NavLink to="/new-arrivals">New Arrivals</NavLink>
            </li>
            <li>
              <NavLink to="/best-sellers">Best Sellers</NavLink>
            </li>
            <li className="dropdown">
              <NavLink
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  setCollectionsOpen((prev) => !prev);
                }}
              >
                Collections ▾
              </NavLink>
              {collectionsOpen && (
                <ul className="dropdown-menu">
                  <li>
                    <NavLink to="/collections/spring">
                      Spring Collection
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/collections/ethnic">Ethnic Wear</NavLink>
                  </li>
                  <li>
                    <NavLink to="/collections/western">Western</NavLink>
                  </li>
                  <li>
                    <NavLink to="/collections/work">Work Wear</NavLink>
                  </li>
                  <li>
                    <NavLink to="/collections/casuals">Casuals</NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <NavLink to="/shop-by">Shop By</NavLink>
            </li>
            <li>
              <NavLink to="/gifting">Gifting</NavLink>
            </li>
            <li>
              <NavLink to="/seasonal">Seasonal Collection</NavLink>
            </li>
            <li>
              <NavLink to="/track-order">Track Order</NavLink>
            </li>
            <li>
              <NavLink to="/about">About Us</NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
