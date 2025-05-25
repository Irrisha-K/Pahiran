import React, { useEffect, useState } from "react";
import "./ProductsPage.css";
import NewArrivalsList from "../../NewArrivals/Components/NewArrivalsList";
import Card from "../../shared/components/UIElements/Card";
import ProductList from "../../Products/components/ProductsList";

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
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); // ⬅️ error state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/products/tops");
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
      {/* <ImageSlider /> */}

      <ProductList items={products} />
    </>
  );
}
