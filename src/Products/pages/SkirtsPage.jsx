import { useState } from "react";

const ITEMS_PER_PAGE = 6;

const skirtPrices = {
  "bflo.jpg": "Rs. 1,499",
  "brcheck.jpg": "Rs. 1,299",
  "brjean.jpg": "Rs. 1,699",
  "brplead.jpg": "Rs. 1,199",
  "brwin.jpg": "Rs. 1,399",
  "bumid.jpg": "Rs. 1,599",
  "flob1g1.jpg": "Rs. 1,499",
  "flowh.jpg": "Rs. 1,499",
  "gboho.jpg": "Rs. 1,299",
  "gmini.jpg": "Rs. 1,699",
  "jski.jpg": "Rs. 1,199",
  "pcheski.jpg": "Rs. 1,399",
  "pflo.jpg": "Rs. 1,599",
  "pij.jpg": "Rs. 1,499",
  "polka.jpg": "Rs. 1,499",
  "reslea.jpg": "Rs. 1,299",
  "rlong.jpg": "Rs. 1,699",
  "rmini.jpg": "Rs. 1,199",
  "sil.jpg": "Rs. 1,399",
  "whbopho.jpg": "Rs. 1,599",
  "ytie.jpg": "Rs. 1,499",
};

const skirtProducts = Object.keys(skirtPrices).map((filename, index) => ({
  id: index + 1,
  name: filename.replace(".jpg", "").toUpperCase(),
  price: skirtPrices[filename],
  image: `/skirts/${filename}`, // Make sure these images are in public/skirts folder
}));

export default function SkirtsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = skirtProducts.filter((item) =>
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
          placeholder="Search skirts..."
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
