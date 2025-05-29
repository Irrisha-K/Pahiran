import { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";
import Card from "../components/UIElements/Card";
import ProductsList from "../../Products/components/ProductsList";
import Pagination from "../components/UIElements/Pagination";
import FilterBar from "../components/UIElements/FilterBar";

const ITEMS_PER_PAGE = 6;

export default function CategoryProductsPage({ category, placeholder }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [priceOrder, setPriceOrder] = useState("");

  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const debouncedQuery = useDebounce(searchQuery, 300);
  const isSearching = searchQuery !== debouncedQuery;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:5001/api/products/category/${category}?search=${debouncedQuery}&page=${currentPage}&limit=${ITEMS_PER_PAGE}&price=${priceOrder}`

          // `http://localhost:5001/api/products/${category}?search=${debouncedQuery}&page=${currentPage}&limit=${ITEMS_PER_PAGE}&price=${priceOrder}`
        );
        if (!res.ok) throw new Error("Something went wrong!");
        const data = await res.json();
        setProducts(data.products);
        setTotalItems(data.quantity);
      } catch (err) {
        setError("Failed to load products. Please check your network.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedQuery, currentPage, priceOrder, category]);

  if (isLoading || error || products.length === 0) {
    const message = isLoading
      ? "Loading products..."
      : error
      ? error
      : "No Items Found! Please Try Again Later!";

    return (
      <div className="no-product-container">
        <Card className="no-product">
          <p className="no-product-text">{message}</p>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* <div
        className="filter-bar"
        style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
      >
        <select
          value={priceOrder}
          onChange={(e) => {
            setPriceOrder(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">Sort by Price</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>

        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value.toLowerCase());
            setCurrentPage(1);
          }}
        />
      </div> */}
      <FilterBar
        priceOrder={priceOrder}
        onPriceChange={(value) => {
          setPriceOrder(value);
          setCurrentPage(1);
        }}
        searchQuery={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search tops..."
      />

      {isSearching && (
        <div className="searching-message">
          <p>Searching...</p>
        </div>
      )}

      <ProductsList items={products} />

      {/* <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            type="button"
            key={i}
            className={`page-btn ${i + 1 === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div> */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </>
  );
}
