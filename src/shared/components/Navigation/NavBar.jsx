import React, { useContext, useState } from "react";
import { FaSearch, FaUser, FaHeart, FaShoppingBag } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import CartContext from "../../../store/CartContext";
import { AuthContext } from "../../../store/AuthContext";
import "./NavBar.css";

import SearchBar from "../UIElements/SearchBar";

export default function Navbar() {
  const auth = useContext(AuthContext);

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
          {/*           
          <NavLink to="/auth">
            <FaUser />
          </NavLink> */}
          {auth.isLoggedIn ? (
            <>
              {/* <NavLink to="/profile">
                <FaUser />
              </NavLink> */}
              <button onClick={auth.logout} className="logout-btn">
                Log Out
              </button>
            </>
          ) : (
            <NavLink to="/auth">
              <FaUser />
            </NavLink>
          )}

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
        {auth.isLoggedIn && auth.role === "admin" ? (
          <li>
            <NavLink to="/add">Add Products</NavLink>
          </li>
        ) : (
          auth.isLoggedIn && (
            <li>
              <NavLink to="/new-arrivals">New Arrivals</NavLink>
            </li>
          )
        )}
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
            <NavLink to="/dresses">Dresses</NavLink>
            <NavLink to="/skirts">Skirts</NavLink>
            <NavLink to="/coord">Co-ords</NavLink>
          </div>
        </li>

        <li>
          <NavLink to="/about">About Us</NavLink>
        </li>
      </ul>
    </nav>
  );
}
