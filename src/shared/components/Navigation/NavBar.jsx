import React, { useContext, useEffect, useState, useRef } from "react";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingBag,
  FaUserCircle,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import CartContext from "../../../store/CartContext";
import { AuthContext } from "../../../store/AuthContext";

import "./NavBar.css";

import SearchBar from "../UIElements/SearchBar";

export default function Navbar() {
  const auth = useContext(AuthContext);
  const { clearCart, items } = useContext(CartContext);

  const totalCartItems = items.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceTimer = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    clearCart();
    navigate("/");
  };

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Clear previous timer
    clearTimeout(debounceTimer.current);

    // Set new timer
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:5001/api/products/search?query=${encodeURIComponent(query.trim())}`,
        );
        const data = await res.json();
        const results = Array.isArray(data) ? data : (data.products ?? []);
        setSuggestions(results.slice(0, 8));
        setShowDropdown(results.length > 0);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 200);

    return () => clearTimeout(debounceTimer.current);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleSuggestionClick = (productId) => {
    setShowDropdown(false);
    setQuery("");
    navigate(`/product/${productId}`);
  };

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <NavLink to="/" className="logo">
          PAHIRAN
        </NavLink>

        {/* 🔍 Global Search Bar */}
        <div className="search-wrapper">
          <form className="search-container" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for clothes..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                // setShowDropdown(false);
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
            />
            <button
              type="submit"
              style={{ background: "none", border: "none" }}
            >
              <FaSearch />
            </button>
          </form>

          {/* Dropdown suggestions */}
          {showDropdown && suggestions.length > 0 && (
            <div className="search-dropdown">
              {suggestions.map((product) => (
                <div
                  key={product._id}
                  className="search-suggestion"
                  onMouseDown={() => handleSuggestionClick(product._id)}
                >
                  <img src={product.image} alt={product.name} />
                  <div className="suggestion-info">
                    <span className="suggestion-name">{product.name}</span>
                    <span className="suggestion-price">
                      Rs. {product.price}
                    </span>
                  </div>
                </div>
              ))}
              <div className="suggestion-view-all" onMouseDown={handleSearch}>
                View all results for "{query}"
              </div>
            </div>
          )}
        </div>

        {/* 👤 Icons */}
        <div className="nav-icons">
          {auth.isLoggedIn ? (
            <>
              <button onClick={handleLogout} className="logout-btn">
                Log Out
              </button>
            </>
          ) : (
            <NavLink to="/auth">
              <FaUser />
            </NavLink>
          )}

          {auth.isLoggedIn && (
            <NavLink to="/myDetails">
              <FaUserCircle />
            </NavLink>
          )}

          {auth.isLoggedIn && auth.role === "user" && (
            <NavLink
              to="/khalti-wallet"
              title="Khalti Wallet"
              style={{ fontSize: "1.1rem" }}
            >
              💳
            </NavLink>
          )}

          {/* {auth.isLoggedIn && } */}
          {auth.role === "user" ? (
            <NavLink to="/cart" className="cart-icon">
              <FaShoppingBag />
              {totalCartItems > 0 && (
                <span className="cart-badge">{totalCartItems}</span>
              )}
            </NavLink>
          ) : null}
        </div>
      </div>

      {/* 🔗 Navigation Links */}
      <ul className="nav-links">
        <li>
          <NavLink
            to={
              auth.isLoggedIn ? (auth.role === "admin" ? "/admin" : "/") : "/"
            }
          >
            {auth.isLoggedIn
              ? auth.role === "admin"
                ? "Admin Page"
                : "Home Page"
              : "Home"}
          </NavLink>
        </li>

        {(!auth.isLoggedIn || auth.role === "user") && (
          <li>
            <NavLink to="/new-arrivals">New Arrivals</NavLink>
          </li>
        )}
        {auth.isLoggedIn && auth.role === "admin" && (
          <li>
            <NavLink to="/add">Add Products</NavLink>
          </li>
        )}

        {auth.isLoggedIn && auth.role === "admin" && (
          <li>
            <NavLink to="/orders">All Orders</NavLink>
          </li>
        )}

        {(!auth.isLoggedIn || auth.role === "user") && (
          <li>
            <NavLink to="/best-seller">Best Seller</NavLink>
          </li>
        )}
        {auth.isLoggedIn && auth.role === "admin" && (
          <li>
            <NavLink to="/user-list">View All Users</NavLink>
          </li>
        )}

        {/* <li>
          <NavLink to="/best-seller">Best Seller</NavLink>
        </li> */}
        {/* {auth.isLoggedIn && auth.role === "admin" ? (
          <li>
            <NavLink to="/update/:pid">Update Products</NavLink>
          </li>
        ) : (
          //       {products.map((product) => (
          //   <li key={product._id}>
          //     <NavLink to={`/update/${product._id}`}>{product.name}</NavLink>
          //   </li>
          // ))}
          auth.isLoggedIn && (
            <li>
              <NavLink to="/best-seller">Best Seller</NavLink>
            </li>
          )
        )} */}
        {/* <li>
          <NavLink to="/best-seller">Best Seller</NavLink>
        </li> */}
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
