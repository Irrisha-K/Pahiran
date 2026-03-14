import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CartContext from "../../store/CartContext";
import "./NewCartCss.css";

export default function CartPage({ onClose }) {
  const navigate = useNavigate();
  const { items, clearCart, increaseQuantity, decreaseQuantity, removeAll } =
    useContext(CartContext);

  const cartTotal = items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.numericPrice,
    0,
  );

  const formattedTotal =
    "Rs. " +
    new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2 }).format(
      cartTotal,
    );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    const safeItems = items.map(
      ({ id, name, quantity, price, numericPrice, image }) => ({
        id,
        name,
        quantity,
        price,
        numericPrice,
        image,
      }),
    );
    console.log("Navigating with safe items:", safeItems);
    navigate("/checkout", { state: { items: safeItems } });
  };

  const handleContinueShopping = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-slide" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        {/* <button
          className="cart-close-btn"
          onClick={onClose}
          aria-label="Close cart"
        >
          ×
        </button> */}

        {/* Header */}
        <div className="cart-header">
          <h2>🛒 Your Cart</h2>
          {items.length > 0 && (
            <span className="cart-item-count">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </span>
          )}
        </div>

        {/* Empty Cart State */}
        {items.length === 0 ? (
          <div className="empty-cart-container">
            <div className="empty-cart-icon">🛍️</div>
            <p className="empty-cart-text">Your cart is empty...</p>
            <button className="empty-cart-btn" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-container">
            {/* Cart Items List */}
            <ul className="cart-items">
              {items.map((item, index) => (
                <li
                  key={item.id}
                  className="cart-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="cart-item-image-wrapper">
                    <img src={item.image} alt={item.name} loading="lazy" />
                    {item.quantity > 1 && (
                      <span className="cart-item-badge">{item.quantity}</span>
                    )}
                  </div>

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p className="cart-item-price">{item.price}</p>

                    <div className="quantity-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => decreaseQuantity(item.id)}
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => increaseQuantity(item.id)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-btn"
                      onClick={() => removeAll(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* Cart Summary */}
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal ({totalItems} items)</span>
                <span>{formattedTotal}</span>
              </div>
              <div className="cart-summary-row">
                <span>Shipping</span>
                <span style={{ color: "#4ade80" }}>Free</span>
              </div>
              <div className="cart-summary-row total">
                <span>Total</span>
                <span>{formattedTotal}</span>
              </div>

              <div className="cart-actions">
                <button
                  onClick={clearCart}
                  className="cart-btn cart-btn-secondary"
                >
                  🗑️ Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  className="cart-btn cart-btn-primary"
                >
                  Go To Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
