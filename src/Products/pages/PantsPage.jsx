import { useEffect, useState } from "react";
import "./Pants.css";
import NewArrivalsList from "../../NewArrivals/Components/NewArrivalsList";
import ProductsList from "../components/ProductsList";
import Card from "../../shared/components/UIElements/Card";

const ITEMS_PER_PAGE = 6;

const pantsPrices = {
  "bjeans.jpg": "Rs. 1,499",
  "bjes.jpg": "Rs. 1,899",
  "bjsho.jpg": "Rs. 1,699",
  "blbo.jpg": "Rs. 2,299",
  "bleather.jpg": "Rs. 2,799",
  "blinesho.jpg": "Rs. 1,999",
  "bljo.jpg": "Rs. 1,749",
  "blmid.jpg": "Rs. 2,199",
  "bltrack.jpg": "Rs. 1,599",
  "bmid.jpg": "Rs. 2,099",
  "bow.jpg": "Rs. 1,899",
  "brsho.jpg": "Rs. 1,999",
  "bsho.jpg": "Rs. 1,999",
  "bushort.jpg": "Rs. 1,499",
  "chp.jpg": "Rs. 2,299",
  "dbwin.jpg": "Rs. 2,199",
  "flojsho.jpg": "Rs. 2,599",
  "gdenim.jpg": "Rs. 1,899",
  "gsho.jpg": "Rs. 1,799",
  "jeans.jpg": "Rs. 1,599",
  "lij.jpg": "Rs. 1,499",
  "orp.jpg": "Rs. 1,999",
  "pcheck.jpg": "Rs. 2,099",
  "pish.jpg": "Rs. 1,899",
  "whst.jpg": "Rs. 1,499",
  "wst.jpg": "Rs. 1,599",
  "gp.jpg": "Rs. 2,199",
};

const pantsProducts = Object.keys(pantsPrices).map((filename, index) => ({
  id: index + 1,
  name: filename.replace(".jpg", "").toUpperCase(),
  price: pantsPrices[filename],
  image: `/pants/${filename}`,
}));

export default function PantsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); // ⬅️ error state
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = pantsProducts.filter((item) =>
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
        const res = await fetch("http://localhost:5001/api/products/pants");
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
          placeholder="Search pants..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset page
          }}
        />
      </div>

      {/* <NewArrivalsList items={paginatedItems} />
       */}
      <ProductsList items={products} />
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
