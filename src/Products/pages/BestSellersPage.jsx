import React from "react";
import "./ProductsPage.css";
import ProductsList from "../components/ProductsList";
import ImageSlider from "../../shared/components/FormElements/ImageSlider";

const products = [
  {
    id: 1,
    name: "Black Sweatpants",
    price: 1899,
    originalPrice: 3226,
    discount: 41,
    image: "/images/sweatp.jpeg",
  },
  {
    id: 2,
    name: "White Silk Pajama Set",
    price: 1899,
    originalPrice: 2847,
    discount: 33,
    image: "/images/whsilkpj.jpeg",
  },
  {
    id: 3,
    name: "White Long Coat",
    price: "Rs. 2,199",
    image: "/images/wcoat.jpeg",
  },
  {
    id: 4,
    name: "Polka Pajama Set",
    price: "Rs. 2,199",
    image: "/images/polkapj.jpeg",
  },
  {
    id: 5,
    name: "White Tshirt",
    price: "Rs. 2,199",
    image: "/images/whi.jpeg",
  },
  {
    id: 6,
    name: "Black Silk Pajama Set",
    price: "Rs. 2,199",
    image: "/images/blsipj.jpeg",
  },
  {
    id: 7,
    name: "Red Leather Coat",
    price: "Rs. 2,199",
    image: "/images/redlejacket.jpeg",
  },
  {
    id: 8,
    name: "Floral Print Satin Skirt",
    price: "Rs. 2,199",
    image: "/images/silskirt.jpg",
  },
  {
    id: 9,
    name: "High Waist Jeans",
    price: "Rs. 2,199",
    image: "/images/highj.jpg",
  },
  {
    id: 10,
    name: "Wool co-ord set",
    price: "Rs. 2,199",
    image: "/images/wollset.jpeg",
  },
  {
    id: 11,
    name: "Minimal Pastel Pink Lehenga",
    price: "Rs. 2,199",
    image: "/images/pinleh.jpg",
  },
  {
    id: 12,
    name: "Floral Print Crop Top",
    price: "Rs. 2,199",
    image: "/images/redt.jpg",
  },
  {
    id: 13,
    name: "Full Set pj",
    price: "Rs. 2,199",
    image: "/images/bwpj.jpeg",
  },
  {
    id: 14,
    name: "Black Skinny Jeans",
    price: "Rs. 2,199",
    image: "/images/blskinny.jpeg",
  },
];

const BestSellersPage = () => {
  return (
    <>
      <ImageSlider />
      <ProductsList items={products} />
    </>
  );
};

export default BestSellersPage;
