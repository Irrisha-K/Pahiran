import React from "react";
import "./Product.css";

const products = [
  {
    id: 1,
    name: "Floral Co-ord Set",
    price: "Rs. 1,999",
    image: "/images/bg.jpg",
  },
  {
    id: 2,
    name: "Sequin Blue Dress",
    price: "Rs. 2,499",
    image: "/images/bg.jpg",
  },
  {
    id: 3,
    name: "White Power Blazer",
    price: "Rs. 2,199",
    image: "/images/bg.jpg",
  },
  {
    id: 3,
    name: "White Power Blazer",
    price: "Rs. 2,199",
    image: "/images/bg.jpg",
  },
  {
    id: 3,
    name: "White Power Blazer",
    price: "Rs. 2,199",
    image: "/images/bg.jpg",
  },
  {
    id: 3,
    name: "White Power Blazer",
    price: "Rs. 2,199",
    image: "/images/bg.jpg",
  },
  {
    id: 3,
    name: "White Power Blazer",
    price: "Rs. 2,199",
    image: "/images/bg.jpg",
  },
  {
    id: 3,
    name: "White Power Blazer",
    price: "Rs. 2,199",
    image: "/images/bg.jpg",
  },
];

const ProductGallery = () => {
  return (
    <div className="product-container">
      {products.map((item) => (
        <div className="product-card" key={item.id}>
          <img src={item.image} alt={item.name} />
          <div className="product-details">
            <h3>{item.name}</h3>
            <p>{item.price}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGallery;
