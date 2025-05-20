import React from "react";
import "./ProductsPage.css";
import NewArrivalsList from "../../NewArrivals/Components/NewArrivalsList";

const products = [
  {
    id: 1,
    name: "Black Co-ord Set",
    price: "Rs. 1,999",
    image: "/tops/bc.jpg",
  },
  {
    id: 2,
    name: "Assymetric  Matcha Hem T-shirt",
    price: "Rs. 2,499",
    image: "/tops/bcoat.jpg",
  },
  {
    id: 3,
    name: "Blue Maxi Dress",
    price: "Rs. 2,199",
    image: "/tops/bflo.jpg",
  },
  {
    id: 4,
    name: "Checked Bow T-shirt",
    price: "Rs. 2,199",
    image: "/tops/bgstrip.jpg",
  },
];

export default function TopsPage() {
  return (
    <>
      {/* <ImageSlider /> */}

      <NewArrivalsList items={products} />
    </>
  );
}
