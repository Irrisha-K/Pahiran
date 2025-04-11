import React from "react";

import "./NavBar.css";
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-inner">
        <div className="logo">PALMONAS</div>

        <div className="search-container">
          <input type="text" placeholder="Search for Necklaces..." />
          <FaSearch />
        </div>

        <div className="nav-icons">
          <NavLink to="/home">
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
          <div className="logo">PALMONAS</div>
          <div className="search-container">
            <input type="text" placeholder="Search for Necklaces..." />
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
          "Lab Grown Diamond",
          "Emily In Paris",
          "Collection",
          "Shop By",
          "Gifting",
          "Track Order",
          "Return & Exchange",
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
          <NavLink to="/lab-grown-diamond">Lab Grown Diamond</NavLink>
        </li>
        <li>
          <NavLink to="/emily-in-paris">Emily In Paris</NavLink>
        </li>
        {/* Continue for other links */}
      </ul>
    </nav>
  );
};

export default Navbar;
