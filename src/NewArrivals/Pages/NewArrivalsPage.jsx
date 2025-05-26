import React, { useEffect, useState } from "react";
import "./NewArrivalsPage.css";
import ImageSlider from "../../shared/components/FormElements/ImageSlider";
import NewArrivalsList from "../Components/NewArrivalsList";
import Card from "../../shared/components/UIElements/Card";
import ProductsList from "../../Products/components/ProductsList";

const NewArrivalsPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); // ⬅️ error state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5001/api/products/newarrival"
        );
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

      <ProductsList items={products} />
    </>
  );
};

export default NewArrivalsPage;
