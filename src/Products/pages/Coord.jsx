import { useState } from "react";
// import "./Coord.css"; // Optional CSS import for Co-ord page styling

const ITEMS_PER_PAGE = 6;

const coordPrices = {
  "bco.jpg": "Rs. 2,699",
  "bcord.jpg": "Rs. 2,499",
  "bset.jpg": "Rs. 2,799",
  "buco.jpg": "Rs. 2,599",
  "bwco.jpg": "Rs. 2,399",
  "fleececo.jpg": "Rs. 2,299",
  "hinco.jpg": "Rs. 2,699",
  "hookset.jpg": "Rs. 2,499",
  "pco.jpg": "Rs. 2,799",
  "tpic.jpg": "Rs. 2,599",
  "tset.jpg": "Rs. 2,399",
  "whset.jpg": "Rs. 2,299",
  "wolset.jpg": "Rs. 2,199",
  "wpj.jpg": "Rs. 2,199",
  "wstrip.jpg": "Rs. 2,199",
};

const coordProducts = Object.keys(coordPrices).map((filename, index) => ({
  id: index + 1,
  name: filename.replace(".jpg", "").toUpperCase(),
  price: coordPrices[filename],
  image: `/coords/${filename}`, // Images should be in public/coords
}));

export default function CoordPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = coordProducts.filter((item) =>
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
          placeholder="Search co-ords..."
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
