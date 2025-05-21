import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./ProductCarousel.css";

const products = [
  {
    id: 1,
    name: "Striped Oversized T-shirt",
    price: 1899,
    originalPrice: 3226,
    discount: 41,
    image: "/images/bawstrip.jpg",
  },
  {
    id: 2,
    name: "Red Flowy Blouse",
    price: 1899,
    originalPrice: 2847,
    discount: 33,
    image: "/images/redfb.jpg",
  },
  {
    id: 3,
    name: "Strawberry Night Suite",
    price: 1899,
    originalPrice: 2847,
    discount: 33,
    image: "/images/pjw.jpg",
  },
  {
    id: 4,
    name: "Sweatants",
    price: 2366,
    originalPrice: 3380,
    discount: 30,
    offer: "BUY 1 GET 1",
    image: "/images/bogosweat.jpg",
  },
  {
    id: 5,
    name: "Innerwear",
    price: 2580,
    originalPrice: 3686,
    discount: 30,
    offer: "BUY 1 GET 1",
    image: "/images/bogo.jpg",
  },
];

export default function ProductCarousel() {
  const containerRef = useRef();

  const scroll = (direction) => {
    const scrollAmount = 300;
    if (direction === "left") {
      containerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    } else {
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleAddToBag = (product) => {
    console.log("Added to bag:", product);
    // Hook this to your cart context or global state
  };

  return (
    <div className="relative w-full">
      {/* <button onClick={() => scroll("left")} className="carousel-btn left">
        <ChevronLeft size={24} />
      </button> */}

      <div ref={containerRef} className="carousel-track">
        {products.map((item) => (
          <div key={item.id} className="product-card group">
            {item.offer && <div className="offer-label">{item.offer}</div>}
            <img src={item.image} alt={item.name} className="product-image" />
            <h3 className="product-title">{item.name}</h3>
            <div className="product-price">
              ₹{item.price.toLocaleString()}
              <span className="original-price">
                ₹{item.originalPrice.toLocaleString()}
              </span>
              <span className="discount">({item.discount}%)</span>
            </div>
            <button
              className="add-to-bag-btn"
              onClick={() => handleAddToBag(item)}
            >
              Add to Bag
            </button>
          </div>
        ))}
      </div>

      {/* <button onClick={() => scroll("right")} className="carousel-btn right">
        <ChevronRight size={24} />
      </button> */}
    </div>
  );
}
