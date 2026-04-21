import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./SearchResultsPage.css";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query.trim()) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:5001/api/products/search?query=${encodeURIComponent(query)}`,
        );
        if (!res.ok) throw new Error("Failed to fetch results");
        const data = await res.json();
        setResults(Array.isArray(data) ? data : (data.products ?? []));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]); // reruns whenever query changes

  if (loading)
    return (
      <div className="search-page">
        <p className="search-status">Searching...</p>
      </div>
    );
  if (error)
    return (
      <div className="search-page">
        <p className="search-status error">{error}</p>
      </div>
    );

  return (
    <div className="search-page">
      <h2>
        Results for "<span>{query}</span>"
      </h2>

      {results.length === 0 ? (
        <p className="search-status">No products found for "{query}".</p>
      ) : (
        <div className="search-grid">
          {results.map((product) => (
            <NavLink
              to={`/product/${product._id}`}
              key={product._id}
              className="search-card"
            >
              <img src={product.image} alt={product.name} />
              <div className="search-card-info">
                <h3>{product.name}</h3>
                <p className="search-price">Rs. {product.price}</p>
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
