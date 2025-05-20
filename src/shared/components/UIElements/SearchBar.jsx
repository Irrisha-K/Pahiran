import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import allProducts from "../../pages/AllProducts";
import "./SearchBar.css";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.trim() === "") {
      setFilteredResults([]);
      return;
    }

    const results = allProducts.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredResults(results);
  }, [query]);

  const handleSelect = (id) => {
    navigate(`/product/${id}`);
    setQuery(""); // optional: clear input
    setFilteredResults([]);
  };

  return (
    <div className="search-bar-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search for clothes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" style={{ background: "none", border: "none" }}>
          <FaSearch />
        </button>
      </div>

      {filteredResults.length > 0 && (
        <ul className="autocomplete-results">
          {filteredResults.map((product) => (
            <li
              key={product.id}
              onClick={() => handleSelect(product.id)}
              className="autocomplete-item"
            >
              <img src={product.image} alt={product.name} />
              <span>{product.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
