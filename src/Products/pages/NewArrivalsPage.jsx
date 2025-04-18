import React from "react";
import "./ProductsPage.css";
import ProductsList from "../components/ProductsList";
import ImageSlider from "../../shared/components/FormElements/ImageSlider";

const products = [
  {
    id: 1,
    name: "Blue Wide Pant",
    price: 1899,
    originalPrice: 3226,
    discount: 41,
    image: "/images/blp.jpeg",
  },
  {
    id: 2,
    name: "Sweetheart Corset Top",
    price: 1899,
    originalPrice: 2847,
    discount: 33,
    image: "/images/blcorset.jpeg",
  },
  {
    id: 3,
    name: "Red Anarkali",
    price: 2366,
    originalPrice: 3380,
    discount: 30,
    offer: "BUY 1 GET 1",
    image: "/images/anarkali.jpg",
  },
  {
    id: 4,
    name: "Pink Full pj set",
    price: 2580,
    originalPrice: 3686,
    discount: 30,
    offer: "BUY 1 GET 1",
    image: "/images/fullpj.jpeg",
  },
  {
    id: 5,
    name: "Olive oversized T-shirt",
    price: "Rs. 2,199",
    image: "/images/oliveoversi.jpeg",
  },
  {
    id: 6,
    name: "Wool co-ord set",
    price: "Rs. 2,199",
    image: "/images/wollset.jpeg",
  },
  {
    id: 7,
    name: "Floral Print Crop Top",
    price: "Rs. 2,199",
    image: "/images/redt.jpg",
  },
  {
    id: 8,
    name: "Polka Pajama Set",
    price: "Rs. 2,199",
    image: "/images/polkapj.jpeg",
  },
  {
    id: 9,
    name: "High Waist Jeans",
    price: "Rs. 2,199",
    image: "/images/highj.jpg",
  },
  {
    id: 10,
    name: "White Shorts",
    price: "Rs. 2,199",
    image: "/images/whshorts.jpeg",
  },
  {
    id: 11,
    name: "Wool Frock",
    price: "Rs. 2,199",
    image: "/images/wolfr.jpeg",
  },
  {
    id: 12,
    name: "White High Neck",
    price: "Rs. 2,199",
    image: "/images/whineck.jpeg",
  },
];

const NewArrivalsPage = () => {
  return (
    <>
      <ImageSlider />
      <ProductsList items={products} />
    </>
  );
};

export default NewArrivalsPage;
