// import { useState, useEffect } from "react";
// import Card from "../../shared/components/UIElements/Card";
// import ProductsList from "../components/ProductsList";
// import useDebounce from "../../shared/hooks/useDebounce";

import CategoryProductsPage from "../../shared/pages/CategoryProductsPage";

// const ITEMS_PER_PAGE = 6;

// export default function SkirtsPage() {
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [totalItems, setTotalItems] = useState(0);
//   const [priceOrder, setPriceOrder] = useState("");

//   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

//   const debouncedQuery = useDebounce(searchQuery, 300);

//   const handlePageChange = (newPage) => {
//     setCurrentPage(newPage);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };
//   const isSearching = searchQuery !== debouncedQuery;

//   useEffect(() => {
//     const fetchProducts = async () => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         const res = await fetch(
//           `http://localhost:5001/api/products/skirts?search=${debouncedQuery}&page=${currentPage}&limit=${ITEMS_PER_PAGE}&price=${priceOrder}`
//         );

//         if (!res.ok) {
//           throw new Error("Something went wrong!");
//         }

//         const data = await res.json();
//         setProducts(data.products);
//         setTotalItems(data.quantity);
//       } catch (err) {
//         setError("Failed to load products. Please check your network.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [debouncedQuery, currentPage, priceOrder]);

//   if (isLoading) {
//     return (
//       <div className="no-product-container">
//         <Card className="no-product">
//           <p className="no-product-text">Loading products...</p>
//         </Card>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="no-product-container">
//         <Card className="no-product">
//           <p className="no-product-text">{error}</p>
//         </Card>
//       </div>
//     );
//   }

//   if (products.length === 0) {
//     return (
//       <div className="no-product-container">
//         <Card className="no-product">
//           <p className="no-product-text">
//             No Items Found! Please Try Again Later!
//           </p>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div
//         className="filter-bar"
//         style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
//       >
//         <select
//           value={priceOrder}
//           onChange={(e) => {
//             setPriceOrder(e.target.value);
//             setCurrentPage(1);
//           }}
//         >
//           <option value="">Sort by Price</option>
//           <option value="asc">Price: Low to High</option>
//           <option value="desc">Price: High to Low</option>
//         </select>

//         <input
//           type="text"
//           placeholder="Search skirts..."
//           value={searchQuery}
//           onChange={(e) => {
//             setSearchQuery(e.target.value.toLowerCase());
//             setCurrentPage(1);
//           }}
//         />
//       </div>

//       {isSearching && (
//         <div className="searching-message">
//           <p>Searching...</p>
//         </div>
//       )}

//       <ProductsList items={products} />

//       <div className="pagination">
//         {Array.from({ length: totalPages }, (_, i) => (
//           <button
//             type="button"
//             key={i}
//             className={`page-btn ${i + 1 === currentPage ? "active" : ""}`}
//             onClick={() => handlePageChange(i + 1)}
//           >
//             {i + 1}
//           </button>
//         ))}
//       </div>
//     </>
//   );
// }

export default function SkirtPage() {
  return (
    <CategoryProductsPage category="skirts" placeholder="Search skirts..." />
  );
}
