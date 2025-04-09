import React from "react";
import "./ProductsPage.css";
import ProductsList from "../components/ProductsList";
import ImageSlider from "../../shared/components/FormElements/ImageSlider";

const products = [
  {
    id: 1,
    name: "Black Co-ord Set",
    price: "Rs. 1,999",
    image: "/images/blackcoord.jpg",
  },
  {
    id: 2,
    name: "Assymetric Hem T-shirt",
    price: "Rs. 2,499",
    image: "/images/assyhemt.jpg",
  },
  {
    id: 3,
    name: "Blue Maxi Dress",
    price: "Rs. 2,199",
    image: "/images/bluemaxi.jpg",
  },
  {
    id: 4,
    name: "Checked Bow T-shirt",
    price: "Rs. 2,199",
    image: "/images/checkt.jpg",
  },
  {
    id: 5,
    name: "Disco Pants",
    price: "Rs. 2,199",
    image: "/images/discopant.jpg",
  },
  {
    id: 6,
    name: "Brown High Waist Wide Pant",
    price: "Rs. 2,199",
    image: "/images/brpant.jpg",
  },
  {
    id: 7,
    name: "Floral Print Crop Top",
    price: "Rs. 2,199",
    image: "/images/redt.jpg",
  },
  {
    id: 8,
    name: "Floral Print Top",
    price: "Rs. 2,199",
    image: "/images/pinkflo.jpg",
  },
  {
    id: 9,
    name: "High Waist Jeans",
    price: "Rs. 2,199",
    image: "/images/highj.jpg",
  },
  {
    id: 10,
    name: "Puffed Sleeved Croped Jacket",
    price: "Rs. 2,199",
    image: "/images/cropj.jpg",
  },
  {
    id: 11,
    name: "Red Halter Neck Frock",
    price: "Rs. 2,199",
    image: "/images/redfrock.jpg",
  },
  {
    id: 12,
    name: "Red Maxi Dress",
    price: "Rs. 2,199",
    image: "/images/redmaxi.jpg",
  },
];

const ProductsPage = () => {
  // return (
  //   <div className="product-container">
  //     {products.map((item) => (
  //       <div className="product-card" key={item.id}>
  //         <img src={item.image} alt={item.name} />
  //         <div className="product-details">
  //           <h3>{item.name}</h3>
  //           <p>{item.price}</p>
  //         </div>
  //       </div>
  //     ))}
  //   </div>
  // );
  return (
    <>
      <ImageSlider />
      <ProductsList items={products} />;
    </>
  );
};

export default ProductsPage;
