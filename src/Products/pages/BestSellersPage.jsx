import { useEffect, useState } from "react";
import NewArrivalsList from "../../NewArrivals/Components/NewArrivalsList";
import CardsUI from "../../shared/components/UIElements/Card";
import ProductsList from "../components/ProductsList";

const BestSellersPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); // ⬅️ error state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5001/api/products/bestseller",
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
        <CardsUI className="no-product">
          <p className="no-product-text">Loading products...</p>
        </CardsUI>
      </div>
    );
  }

  if (error) {
    return (
      <div className="no-product-container">
        <CardsUI className="no-product">
          <p className="no-product-text">{error}</p>
        </CardsUI>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="no-product-container">
        <CardsUI className="no-product">
          <p className="no-product-text">
            No Items Found! Please Try Again Later!
          </p>
        </CardsUI>
      </div>
    );
  }

  return <ProductsList items={products} />;
  // return <NewArrivalsList items={products} />;
};

export default BestSellersPage;
