import { useState } from "react";
import "./Dress.css";

const ITEMS_PER_PAGE = 6;

const dressPrices = {
  "bcoat.jpg": "Rs. 2,299",
  "bdre.jpg": "Rs. 1,999",
  "bflo.jpg": "Rs. 2,199",
  "blflo.jpg": "Rs. 2,099",
  "blsk.jpg": "Rs. 1,899",
  "blubtn.jpg": "Rs. 2,499",
  "blwol.jpg": "Rs. 2,799",
  "boho.jpg": "Rs. 2,199",
  "budre.jpg": "Rs. 1,999",
  "button.jpg": "Rs. 2,299",
  "flodre.jpg": "Rs. 1,899",
  "ord.jpg": "Rs. 2,099",
  "pdre.jpg": "Rs. 1,999",
  "pudre.jpg": "Rs. 2,199",
};

const dressProducts = Object.keys(dressPrices).map((filename, index) => ({
  id: index + 1,
  name: filename.replace(".jpg", "").toUpperCase(),
  price: dressPrices[filename],
  image: `/dresses/${filename}`,
}));

export default function DressPage() {
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

      <div className="product-list">
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
      </div>

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
