import { useState } from "react";
import { toast } from "react-toastify";

function ProductCard({ product, onProductDeleted }) {
  const handleDeleteProduct = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/products/${product._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to delete product");
      }

      // Notify user
      toast.success("Product deleted successfully!");

      // Inform parent component to remove product from list
      onProductDeleted(product._id);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not delete product. Please try again.");
    }
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      {/* Product image, price, etc. */}
      <button onClick={handleDeleteProduct}>Delete</button>
    </div>
  );
}

export default ProductCard;
