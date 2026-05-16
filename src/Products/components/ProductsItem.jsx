import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../store/AuthContext";
import CartContext from "../../store/CartContext";
import { toast } from "react-toastify";
import ConfirmModal from "../../shared/components/UIElements/ConfirmModal";
import "./ProductsItem.css";

export default function ProductsItem(props) {
  const [quantity, setQuantity] = useState(props.quantity);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const cartCtx = useContext(CartContext);
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  async function decrementProductQuantity() {
    try {
      const res = await fetch(
        `http://localhost:5001/api/products/${props.id}/decrement`,
        { method: "PATCH", headers: { "Content-Type": "application/json" } },
      );
      if (!res.ok) throw new Error("Failed to decrement");
      const data = await res.json();
      setQuantity(data.quantity);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update quantity. Please try again.");
    }
  }

  async function handleProductDelete() {
    try {
      const res = await fetch(
        `http://localhost:5001/api/products/${props.id}`,
        { method: "DELETE", headers: { "Content-Type": "application/json" } },
      );
      if (!res.ok) throw new Error("Failed to delete product");
      await res.json();
      toast.success("Product deleted successfully!");
      if (props.onProductDeleted) props.onProductDeleted(props.id);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Could not delete product.");
    } finally {
      setShowConfirm(false);
    }
  }

  async function handleProductToCart() {
    if (!authCtx.isLoggedIn) {
      navigate("/auth");
      return;
    }
    if (quantity === 0) {
      toast.warning("This product is out of stock!");
      return;
    }

    const numericPrice =
      typeof props.price === "string"
        ? parseFloat(props.price.replace(/[^\d.]/g, ""))
        : Number(props.price);

    cartCtx.addItem({
      id: props.id,
      name: props.name,
      image: props.image,
      price: props.price,
      numericPrice,
      quantity: 1,
    });

    toast.success(`${props.name} added to cart!`, {
      style: {
        backgroundColor: "#1c1917",
        color: "#f0ece5",
        fontWeight: "500",
        borderRadius: "10px",
        border: "1px solid rgba(255,160,40,0.25)",
      },
    });
  }

  const isOutOfStock = quantity === 0;

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          title="Confirm Deletion"
          message="Are you sure you want to delete this product?"
          onConfirm={handleProductDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <li className="product-item">
        {/* Plain div — NOT the Card component, which has overflow:hidden */}
        <div className="product-item__card">
          <div className="product-item__image">
            {/* <img src={props.image} alt={props.name} /> */}
            <img
              src={`http://localhost:5001/${props.image}`}
              alt={props.name}
            />
            {isOutOfStock && (
              <span className="product-item__oos-badge">Out of stock</span>
            )}
          </div>

          <div className="product-item__info">
            <h2 className="product-item__title">{props.name}</h2>
            <span className="product-item__price">NRS {props.price}</span>
            <span
              className={`product-item__quantity${isOutOfStock ? " out-of-stock" : ""}`}
            >
              {isOutOfStock ? "Out of stock" : `${quantity} left in stock`}
            </span>
          </div>

          <div className="product-item__buttons">
            <button
              className="pi-btn pi-btn--ghost"
              onClick={() => navigate(`/product/${props.id}`)}
            >
              View Details
            </button>

            {authCtx.role === "admin" ? (
              <div className="product-item__admin-row">
                <button
                  className="pi-btn pi-btn--blue"
                  onClick={() => navigate(`/admin/update/${props.id}`)}
                >
                  Update
                </button>
                <button
                  className="pi-btn pi-btn--red"
                  onClick={() => setShowConfirm(true)}
                >
                  Delete
                </button>
              </div>
            ) : (
              <button
                className="pi-btn pi-btn--amber"
                onClick={handleProductToCart}
                disabled={isOutOfStock || isLoading}
              >
                {isLoading
                  ? "Adding…"
                  : isOutOfStock
                    ? "Out of Stock"
                    : "Add to Cart"}
              </button>
            )}
          </div>
        </div>
      </li>
    </>
  );
}
