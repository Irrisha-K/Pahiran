import { useState, useEffect } from "react";
import Card from "../../shared/components/UIElements/Card";
import ProductsList from "../components/ProductsList";
// import "./Dress.css";

const ITEMS_PER_PAGE = 6;

const dressPrices = {
  "Black Coat.jpg": "Rs. 2,299",
  "Back Floral Dress.jpg": "Rs. 1,999",
  "Black Fairy Dress.jpg": "Rs. 2,199",
  "Black Wollen Ball-sleeve .jpg": "Rs. 2,099",
  "Black-slit Dress.jpg": "Rs. 1,899",
  "Blue Floral Dress.jpg": "Rs. 2,499",
  "Blue Jeans Dress.jpg": "Rs. 2,799",
  "Boho Maxi.jpg": "Rs. 2,199",
  "Brown Corset Dress.jpg": "Rs. 1,999",
  "Darkblue Button A-line Dress.jpg": "Rs. 2,299",
  "Orange Maxi Dress.jpg": "Rs. 1,899",
  "Pastel Blue Nightdress.jpg": "Rs. 2,099",
  "Pastel Purple Maxi.jpg": "Rs. 1,999",
  "Pink Floral Dress.jpg": "Rs. 2,199",
};

const dressProducts = Object.keys(dressPrices).map((filename, index) => ({
  id: index + 1,
  name: filename.replace(".jpg", "").toUpperCase(),
  price: dressPrices[filename],
  image: `/dresses/${filename}`,
}));

export default function DressesPages() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); // ⬅️ error state
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = dressProducts.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
      const fetchProducts = async () => {
        try {
          const res = await fetch(
            "http://localhost:5001/api/products/dresses"
          );
          if (!res.ok) {
            throw new Error("Something went wrong!");
          }
          const data = await res.json();
          setProducts(data);
        } catch (err) {
          setError("Failed to load products. Please check your network.");
        } finally {
          setIsLoading(false);
        }
      };
  
      fetchProducts();
    }, []);
  
    if (isLoading) {
      return (
        <div className="no-product-container">
          <Card className="no-product">
            <p className="no-product-text">Loading products...</p>
          </Card>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="no-product-container">
          <Card className="no-product">
            <p className="no-product-text">{error}</p>
          </Card>
        </div>
      );
    }
  
    if (products.length === 0) {
      return (
        <div className="no-product-container">
          <Card className="no-product">
            <p className="no-product-text">
              No Items Found! Please Try Again Later!
            </p>
          </Card>
        </div>
      );
    }

  return (
    <>
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search dresses..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* <div className="product-list">
        {paginatedItems.map((item) => (
          <div key={item.id} className="product-item">
            <div className="product-item__content">
              <div className="product-item__image">
                <img src={item.image} alt={item.name} />
              </div>
              <div className="product-item__info">
                <h2>{item.name}</h2>
                <div className="product-item__price">{item.price}</div>
              </div>
            </div>
            <div className="product-item__actions">
              <button>View</button>
              <button>Edit</button>
              <button>Delete</button>
            </div>
          </div>
        ))}
      </div> */}

      <ProductsList items={products}/>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-btn ${i + 1 === currentPage ? "active" : ""}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </>
  );
}
